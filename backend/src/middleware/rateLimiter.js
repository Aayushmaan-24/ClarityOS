const rateLimit = require("express-rate-limit");
const rateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Wait 15 minutes." },
  skip: () => process.env.NODE_ENV === "test",
});
module.exports = { rateLimiter };
