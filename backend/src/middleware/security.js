const helmet = require("helmet");
const cors = require("cors");
const ALLOWED = process.env.ALLOWED_ORIGIN || "http://localhost:5173";

function applySecurityMiddleware(app) {
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'", ALLOWED, "http://localhost:4000"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
  }));

  app.use(cors({
    origin: (origin, cb) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return cb(null, true);

      const allowedOrigins = [ALLOWED, "http://localhost:5173", "http://localhost:5174"];
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === "development") {
        cb(null, true);
      } else {
        cb(new Error("CORS: not allowed — " + origin));
      }
    },
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: false,
  }));
}

module.exports = { applySecurityMiddleware };
