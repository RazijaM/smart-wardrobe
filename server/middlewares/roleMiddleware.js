// Role middleware - requires ADMIN role
function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }
  next();
}

// Optional auth - attaches user if token present, does not block
function optionalAuth(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) {
    req.user = null;
    return next();
  }
  const jwt = require('jsonwebtoken');
  const { SECRET_KEY } = require('../config');
  jwt.verify(token, SECRET_KEY, (err, user) => {
    req.user = err ? null : user;
    next();
  });
}

module.exports = { requireAdmin, optionalAuth };
