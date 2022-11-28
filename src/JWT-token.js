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

function auth(request, reply) {
  try {
    const token = request.headers.authorization.replace('Bearer ', '');
    checkToken(token);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return reply.redirect(301, '/login');
    }
    console.error(error);
    reply.code(500).send('Oous. Something went wrong');
  }
}

module.exports = { generateAccessToken, auth };
