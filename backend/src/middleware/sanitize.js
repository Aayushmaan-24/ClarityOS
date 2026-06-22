const sanitizeHtml = require("sanitize-html");

function sanitizeText(text) {
  if (typeof text !== "string") return "";
  return sanitizeHtml(text, { allowedTags: [], allowedAttributes: {} }).slice(0, 50000);
}

function sanitizeMiddleware(req, res, next) {
  if (req.body?.message) {
    req.body.message = sanitizeText(req.body.message);
  }

  if (req.body?.history) {
    let history = req.body.history;
    if (typeof history === "string") {
      try {
        history = JSON.parse(history);
      } catch (e) {
        return res.status(400).json({ error: "Invalid history JSON" });
      }
    }

    if (!Array.isArray(history)) {
      return res.status(400).json({ error: "Invalid history: must be an array" });
    }

    if (history.length > 20) {
      return res.status(400).json({ error: "History too long" });
    }

    req.body.history = history.map(t => ({
      role: ["user", "model", "assistant"].includes(t.role) ? (t.role === "assistant" ? "model" : t.role) : "user",
      content: sanitizeText(t.content || ""),
    }));
  }
  next();
}

module.exports = { sanitizeText, sanitizeMiddleware };
