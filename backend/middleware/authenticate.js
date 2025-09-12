const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');  
    req.user = decoded.userId;  
    next();  
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const requireSeller = (req, res, next) => {
  const role = req.header('x-user-role');
  if (role === 'seller') return next();
  return res.status(403).json({ message: 'Seller access required' });
};

module.exports = authenticate;
module.exports.requireSeller = requireSeller;
