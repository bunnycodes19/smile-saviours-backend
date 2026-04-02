const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const err = new Error(result.error.issues[0].message);
    err.statusCode = 400;
    return next(err);
  }

  req.validatedData = result.data;
  next();
};

module.exports = validate;
