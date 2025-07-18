const jwt = require('jsonwebtoken');

const createJWT = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

module.exports = { createJWT };
