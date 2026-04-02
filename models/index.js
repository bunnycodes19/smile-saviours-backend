const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const User = require("./user")(sequelize, DataTypes);
const Patient = require("./patient");
const Appointment = require("./appointment");

// 🔗 Initialize models (important if not already done inside model files)
Patient.initModel && Patient.initModel(sequelize);
Appointment.initModel && Appointment.initModel(sequelize);

// 🔗 Associations

Patient.hasMany(Appointment, {
  foreignKey: "patient_id",
  onDelete: "CASCADE",
});

Appointment.belongsTo(Patient, {
  foreignKey: "patient_id",
});

// ✅ Export everything cleanly

module.exports = {
  sequelize,
  Patient,
  Appointment,
  User,
};
