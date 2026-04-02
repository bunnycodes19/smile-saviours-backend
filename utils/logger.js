const { createLogger, format, transports } = require("winston");

const isProduction = process.env.NODE_ENV === "production";

const logger = createLogger({
  level: isProduction ? "error" : "debug",
  format: format.combine(
    format.timestamp(),
    isProduction ? format.json() : format.prettyPrint(),
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "logs/error.log" }),
  ],
});

module.exports = logger;
