const notFound = (req, res, next) => {
  res.status(404).json({
    status: 400,
    message: `Url endpoint does not exist - ${req.originalUrl}`,
  });
  next();
};

module.exports = notFound;
