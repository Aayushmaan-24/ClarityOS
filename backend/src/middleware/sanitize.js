const sanitizeHtml = require("sanitize-html");

function sanitizeText(text) {
  if (typeof text !== "string") return "";
  return sanitizeHtml(text, { allowedTags: [], allowedAttributes: {} }).slice(0, 50000);
}

function sanitizeMiddleware(req, res, next) {
  if (req.body?.message) req.body.message = sanitizeText(req.body.message);
  if (req.body?.history) {
    if (typeof req.body.history === "string") {
      try {
        req.body.history = JSON.parse(req.body.history);
      } catch (e) {
        return res.status(400).json({ error: "Invalid history JSON" });
      }
    }
    if (!Array.isArray(req.body.history)) return res.status(400).json({ error: "Invalid history" });
    if (req.body.history.length > 20) return res.status(400).json({ error: "History too long" });
    req.body.history = req.body.history.map(t => ({
      role: ["user","model"].includes(t.role) ? t.role : "user",
      content: sanitizeText(t.content || ""),
    }));
  }
  next();
}
module.exports = { sanitizeText, sanitizeMiddleware };
