const jwt = require('jsonwebtoken');
const User = require('../Models/user');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      userType: user.user_type
    },
    process.env.JWT_SECRET, 
    { expiresIn: '6h' }
  );
};

const authorizationChecker = (userType) => {
  return async (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      // console.log("decoded",decoded);

      const user = await User.findById(req.user.id);
      if (!user || user.user_type !== userType) {
        return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
      }

      next();
    } catch (error) {
      res.status(400).json({ message: 'Invalid token.' });
    }
  };
};

module.exports = { generateToken, authorizationChecker };