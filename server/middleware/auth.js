const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token') || req.header('Authorization');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    // If Authorization header was "Bearer <token>", handle that
    const pureToken = token.startsWith('Bearer ') ? token.slice(7).trim() : token;
    const decoded = jwt.verify(pureToken, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
