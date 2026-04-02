const express = require("express");
const router = express.Router();

const {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment, // 👈 ADD THIS
} = require("../controllers/appointmentController");

// ✅ Create appointment
router.post("/", createAppointment);

// ✅ Get all appointments
router.get("/", getAppointments);

// ✅ Get appointment by ID
router.get("/:id", getAppointmentById);

// ✅ Update appointment
router.put("/:id", updateAppointment);
// ✅ Delete appointment
router.delete("/:id", deleteAppointment);
module.exports = router;
