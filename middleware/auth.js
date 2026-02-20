const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Token comes in header as: "Bearer <token>"
  const token = req.header('Authorization')?.split(' ')[1];

  // If no token, block the request
  if (!token)
    return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    // Verify token is valid and not expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // now route can use req.user.id
    next();             // move on to the actual route
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};