const express = require("express");
const multer = require("multer");
const { sanitizeMiddleware, sanitizeText } = require("../middleware/sanitize");
const { generateResponse } = require("../services/gemini");
const { TOOLS } = require("../config/tools");
const logger = require("../utils/logger");

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: parseInt(process.env.MAX_PDF_BYTES) || 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    file.mimetype === "application/pdf" ? cb(null, true) : cb(new Error("Only PDF files accepted"));
  },
});

router.post("/", upload.single("pdf"), sanitizeMiddleware, async (req, res) => {
  try {
    const { toolId, message, history } = req.body;
    if (!TOOLS[toolId]) return res.status(400).json({ error: "Invalid tool ID" });
    if (!message && !req.file) return res.status(400).json({ error: "Message or PDF required" });

    const userMessage = sanitizeText(message || "");
    let pdfPart = null;
    if (req.file) {
      pdfPart = { inlineData: { mimeType: "application/pdf", data: req.file.buffer.toString("base64") } };
      req.file.buffer = null;
    }

    let parsedHistory = [];
    try { parsedHistory = history ? JSON.parse(history) : []; } catch { parsedHistory = []; }

    const response = await generateResponse({
      systemPrompt: TOOLS[toolId].systemPrompt,
      userMessage, pdfPart,
      history: parsedHistory,
    });

    logger.info("Response generated", { toolId, hasPdf: !!req.file, ip: req.ip });
    res.json({ reply: response.text, sources: response.sources });
  } catch (err) {
    logger.error("Chat error", { message: err.message });
    if (err.code === "LIMIT_FILE_SIZE") return res.status(413).json({ error: "PDF too large. Max 10MB." });
    if (err.message?.includes("Only PDF")) return res.status(415).json({ error: "Only PDF accepted." });
    res.status(500).json({ error: "Failed to generate response." });
  }
});
module.exports = router;
