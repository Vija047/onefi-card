function notFoundHandler(req, res, next) {
  res.status(404).json({ message: 'Route not found' });
}

function errorHandler(err, req, res, next) {
  console.error(err);

  const status = err.status || err.statusCode || 500;
  const message =
    status === 500 ? 'Internal server error' : err.message || 'Request failed';

  res.status(status).json({ message });
}

module.exports = { notFoundHandler, errorHandler };
