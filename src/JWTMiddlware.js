const jwt = require('jsonwebtoken');
const { secret } = require('./confing');

async function jwtMiddlware(request, response, next) {
  const authHeader = request.headers.authorization;
  const token = authHeader.split(' ')[1];
  if (!token) throw new Error('Unauthorized');

  jwt.verify(token, secret, (error, token) => {
    if (error) throw new Error('Server error');
    request.token = token;
    next();
  });
}
module.exports = { jwtMiddlware };
