const { z } = require("zod");

// Patient Validation
const patientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
});

// Appointment Validation
const appointmentSchema = z.object({
  patient_id: z.number(),
  appointment_date: z.string(), // later: stricter date validation
  appointment_time: z.string(), // later: stricter time validation
});

// Auth Validation
const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

module.exports = {
  patientSchema,
  appointmentSchema,
  signupSchema,
  loginSchema,
};
