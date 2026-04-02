const { z } = require("zod");

// ==============================
// 🧾 PATIENT VALIDATION (PRODUCTION-GRADE)
// ==============================
const patientSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),

  phone: z
    .string()
    .trim()
    .regex(/^\d{10}$/, "Phone must be exactly 10 digits"),

  medical_allergies: z
    .union([z.string(), z.null()])
    .optional()
    .transform((val) => {
      if (val === undefined || val === null) return null;

      const trimmed = val.trim();
      return trimmed === "" ? null : trimmed;
    }),
});

// ==============================
// 📅 APPOINTMENT VALIDATION (TIGHTENED)
// ==============================
const appointmentSchema = z.object({
  patient_id: z
    .number({
      required_error: "Patient ID is required",
      invalid_type_error: "Patient ID must be a number",
    })
    .int()
    .positive(),

  appointment_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),

  appointment_time: z
    .string()
    .regex(/^\d{2}:\d{2}(:\d{2})?$/, "Time must be HH:mm or HH:mm:ss"),
});

// ==============================
// 🔐 AUTH VALIDATION (HARDENED)
// ==============================
const signupSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),

  email: z.string().trim().email("Invalid email format"),

  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z.string().trim().email("Invalid email format"),
  password: z.string().min(6),
});

module.exports = {
  patientSchema,
  appointmentSchema,
  signupSchema,
  loginSchema,
};
