const { z } = require("zod");

// ==============================
// 🧾 PATIENT VALIDATION (FIXED)
// ==============================
const patientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").trim(),

  phone: z.string().min(10, "Phone must be at least 10 digits").trim(),

  // ✅ FIX: aligned with DB + frontend
  medical_allergies: z.string().nullable().optional(),
});

// ==============================
// 📅 APPOINTMENT VALIDATION
// ==============================
const appointmentSchema = z.object({
  patient_id: z.number(),

  appointment_date: z.string(), // can tighten later
  appointment_time: z.string(),
});

// ==============================
// 🔐 AUTH VALIDATION
// ==============================
const signupSchema = z.object({
  name: z.string().min(2).trim(),
  email: z.string().email().trim(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email().trim(),
  password: z.string().min(6),
});

module.exports = {
  patientSchema,
  appointmentSchema,
  signupSchema,
  loginSchema,
};
