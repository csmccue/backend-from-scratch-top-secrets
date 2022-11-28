module.exports = async (req, res, next) => {
  try {
    if (!req.user)
      throw new Error('You do not have access to view this page');
    next();
  } catch (err) {
    err.status = 403;
    next(err);
  }
};
