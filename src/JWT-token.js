const jwt = require('jsonwebtoken');
const { secret } = require('./confing');

const generateAccessToken = (id, email) => {
  const load = {
    id,
    email,
  };
  return jwt.sign(load, secret, { expiresIn: '24h' });
};

function checkToken(token) {
  return jwt.verify(token, secret);
}

module.exports = { generateAccessToken, checkToken };
