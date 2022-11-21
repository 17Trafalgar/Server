const jwt = require('jsonwebtoken');
const { secret } = require('./confing');

const generateAccessToken = (id, email) => {
  const load = {
    id,
    email,
  };
  return jwt.sign(load, secret, { expiresIn: '24h' });
};

module.exports = generateAccessToken;
// ffunction checkaccessToken
// в каждом роуте кроме лоигна и регистр, я должен проверить свой токен, если нет, то код ошибки "503"
