const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');

module.exports.authCheck = async (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    res.status(401).json({ message: 'No token provided' });
  }

  const decoded = jwt.verify(token, config.jwt.secret);
  const user = await User.findById(decoded.id);
  if (!user) {
    res.status(404).json({ message: 'User does not exist' });
  }

  req.user = decoded;
  next();
};
