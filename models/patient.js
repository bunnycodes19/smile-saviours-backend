const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Patient = sequelize.define(
  "Patient",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
    },
    medical_allergies: {
      type: DataTypes.TEXT,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = Patient;
