require("dotenv").config(); // ✅ MUST BE FIRST

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const sequelize = require("./config/db");

// ✅ ROUTES
const patientRoutes = require("./routes/patientRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const authRoutes = require("./routes/authRoutes");

// ✅ ERROR HANDLER
const errorHandler = require("./middleware/errorMiddleware");

const app = express();

// ✅ ENV CHECK
const isProduction = process.env.NODE_ENV === "production";

// ✅ RATE LIMITER
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

// ✅ CORS CONFIG (ENV-BASED)
const allowedOrigins = [process.env.CLIENT_URL];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

// ✅ SECURITY + BODY PARSING
app.use(helmet());
app.use(express.json());

// ✅ LOGGING
if (!isProduction) {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

app.use(limiter);

// ✅ ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/appointments", appointmentRoutes);

// ✅ HEALTH CHECK
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ ERROR HANDLER (ALWAYS LAST)
app.use(errorHandler);

// ✅ SERVER START FUNCTION (NO CALLBACK HELL)
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");

    await sequelize.sync(
      isProduction
        ? {} // 🚫 NEVER mutate schema in production
        : { alter: true }, // ✅ DEV ONLY
    );
    console.log("Database synced...");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Startup error:", error);
    process.exit(1); // 💀 Kill process if startup fails
  }
};

startServer();
