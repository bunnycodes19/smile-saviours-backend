const { Sequelize } = require("sequelize");

const isProduction = process.env.NODE_ENV === "production";

let sequelize;

if (isProduction) {
  // ✅ RENDER / CLOUD POSTGRES (uses DATABASE_URL)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    protocol: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // required for Render
      },
    },
  });
} else {
  // ✅ LOCAL DEV CONFIG
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: process.env.DB_DIALECT,
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    },
  );
}

module.exports = sequelize;
