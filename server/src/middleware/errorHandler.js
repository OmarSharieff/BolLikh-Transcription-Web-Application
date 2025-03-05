export default (err, req, res, next) => {
  console.error(`[ERROR] ${err.message} - ${req.method} ${req.url}`);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
};