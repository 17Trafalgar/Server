const jwt = require('./jsonwebtoken');
const { secret } = require('./confing');
const outRoute = require('./out-first-route');

const generateAccessToken = (id, email) => {
  const load = {
    id,
    email,
  };
  return jwt.sign(load, secret, { expiresIn: '24h' });
};

async function login(request, reply) {
  try {
    const token = await generateAccessToken(schema1._id, schema1.email);
    return reply.json({ token });
  } catch (error) {
    throw new Error('Error: token is not defined');
  }
}
return login;
