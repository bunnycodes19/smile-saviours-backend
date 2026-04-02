const { Patient } = require("../models");

// CREATE PATIENT
exports.createPatient = async (req, res, next) => {
  try {
    const patient = await Patient.create(req.validatedData);

    res.status(201).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};

// GET ALL PATIENTS
exports.getPatients = async (req, res, next) => {
  try {
    const patients = await Patient.findAll();

    res.status(200).json({
      success: true,
      data: patients,
    });
  } catch (error) {
    next(error);
  }
};

// GET PATIENT BY ID
exports.getPatientById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const patient = await Patient.findByPk(id);

    if (!patient) {
      const err = new Error("Patient not found");
      err.statusCode = 404;
      return next(err);
    }

    res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE PATIENT
exports.updatePatient = async (req, res, next) => {
  try {
    const { id } = req.params;

    const patient = await Patient.findByPk(id);

    if (!patient) {
      const err = new Error("Patient not found");
      err.statusCode = 404;
      return next(err);
    }

    // ⚠️ STILL TEMP — we’ll fix this next
    await patient.update(req.validatedData);

    res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE PATIENT
exports.deletePatient = async (req, res, next) => {
  try {
    const patient = await Patient.findByPk(req.params.id);

    if (!patient) {
      const err = new Error("Patient not found");
      err.statusCode = 404;
      return next(err);
    }

    await patient.destroy();

    res.status(200).json({
      success: true,
      message: "Patient deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
