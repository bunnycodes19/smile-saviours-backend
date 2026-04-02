const { Appointment, Patient } = require("../models");
const { appointmentSchema } = require("../utils/validators");

// ✅ CREATE APPOINTMENT
exports.createAppointment = async (req, res) => {
  try {
    // 🔒 ZOD VALIDATION
    const validatedData = appointmentSchema.safeParse(req.body);

    if (!validatedData.success) {
      return res.status(400).json({
        error: validatedData.error.issues[0].message,
      });
    }

    const { patient_id, appointment_date, appointment_time } =
      validatedData.data;

    // 🔒 DATE VALIDATION
    const inputDate = new Date(appointment_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(inputDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    if (inputDate < today) {
      return res.status(400).json({ error: "Cannot book past dates" });
    }

    // 🔒 TIME VALIDATION
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

    if (!timeRegex.test(appointment_time)) {
      return res.status(400).json({
        error: "Invalid time format (HH:MM)",
      });
    }

    // 🔒 PATIENT EXISTS
    const patient = await Patient.findByPk(patient_id);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    // 🔒 DOUBLE BOOKING CHECK
    const existing = await Appointment.findOne({
      where: {
        appointment_date,
        appointment_time,
      },
    });

    if (existing) {
      return res.status(400).json({
        error: "Time slot already booked",
      });
    }

    const appointment = await Appointment.create({
      patient_id,
      appointment_date,
      appointment_time,
    });

    res.status(201).json(appointment);
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ GET ALL APPOINTMENTS
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      include: {
        model: Patient,
        attributes: ["id", "name", "phone"],
      },
      order: [
        ["appointment_date", "ASC"],
        ["appointment_time", "ASC"],
      ],
    });

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ GET APPOINTMENT BY ID
exports.getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findByPk(id, {
      include: {
        model: Patient,
        attributes: ["id", "name", "phone"],
      },
    });

    if (!appointment) {
      return res.status(404).json({
        error: "Appointment not found",
      });
    }

    res.status(200).json(appointment);
  } catch (error) {
    console.error("Error fetching appointment:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ UPDATE APPOINTMENT
exports.updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      return res.status(404).json({
        error: "Appointment not found",
      });
    }

    const { appointment_date, appointment_time } = req.body;

    // 🔒 DATE VALIDATION
    if (appointment_date) {
      const inputDate = new Date(appointment_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (isNaN(inputDate.getTime())) {
        return res.status(400).json({
          error: "Invalid date format",
        });
      }

      if (inputDate < today) {
        return res.status(400).json({
          error: "Cannot set past dates",
        });
      }
    }

    // 🔒 TIME VALIDATION
    if (appointment_time) {
      const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

      if (!timeRegex.test(appointment_time)) {
        return res.status(400).json({
          error: "Invalid time format (HH:MM)",
        });
      }
    }

    // 🔒 DOUBLE BOOKING CHECK
    if (appointment_date && appointment_time) {
      const existing = await Appointment.findOne({
        where: {
          appointment_date,
          appointment_time,
        },
      });

      if (existing && existing.id !== appointment.id) {
        return res.status(400).json({
          error: "Time slot already booked",
        });
      }
    }

    if (appointment_date) appointment.appointment_date = appointment_date;
    if (appointment_time) appointment.appointment_time = appointment_time;

    await appointment.save();

    const updated = await Appointment.findByPk(id, {
      include: {
        model: Patient,
        attributes: ["id", "name", "phone"],
      },
    });

    res.status(200).json(updated);
  } catch (error) {
    console.error("Update Appointment Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ DELETE APPOINTMENT
exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findByPk(id);

    if (!appointment) {
      return res.status(404).json({
        error: "Appointment not found",
      });
    }

    await appointment.destroy();

    res.status(200).json({
      message: "Appointment deleted successfully",
    });
  } catch (error) {
    console.error("Delete Appointment Error:", error);
    res.status(500).json({ error: error.message });
  }
};
