const express = require("express");
const router = express.Router();

const {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
} = require("../controllers/patientController");

// 🔐 AUTH MIDDLEWARE
const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware");

// ✅ VALIDATION MIDDLEWARE
const validate = require("../middleware/validate");
const { patientSchema } = require("../utils/validators");

// 🔒 PROTECTED ROUTES
router.get("/", verifyToken, getPatients);
router.get("/:id", verifyToken, getPatientById);

// 🔥 APPLY VALIDATION HERE
router.post("/", verifyToken, validate(patientSchema), createPatient);
router.put("/:id", verifyToken, validate(patientSchema), updatePatient);

// 🔒 ADMIN ONLY
router.delete("/:id", verifyToken, authorizeRoles("admin"), deletePatient);

module.exports = router;
