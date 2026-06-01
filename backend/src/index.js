require("dotenv").config();
const express = require("express");
const { applySecurityMiddleware } = require("./middleware/security");
const { rateLimiter } = require("./middleware/rateLimiter");
const chatRouter = require("./routes/chat");
const logger = require("./utils/logger");

const app = express();
const PORT = process.env.PORT || 4000;

applySecurityMiddleware(app);
app.use(express.json({ limit: "1mb" }));
app.use("/api", rateLimiter);

app.get("/health", (req, res) => {
  res.json({ status: "ok", version: "1.0.0", ts: new Date().toISOString() });
});

app.use("/api/chat", chatRouter);
app.use((req, res) => res.status(404).json({ error: "Not found" }));
app.use((err, req, res, next) => {
  logger.error("Unhandled error", { message: err.message });
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => logger.info(`ClarityOS backend on port ${PORT} [${process.env.NODE_ENV}]`));
module.exports = app;
