const { generateAccessToken } = require('./JWT-token');

async function routeUSers(fastify, options) {
  const collectionUser = fastify.mongo.db.collection('users');

  const userBodyJsonSchema = {
    type: 'object',
    required_email: ['email'],
    required_password: ['password'],
    properties_email: {
      email: { type: 'string' },
    },
    properties_password: {
      password: { type: 'string' },
    },
  };
  const schema1 = {
    body: userBodyJsonSchema,
  };

  fastify.post('/register', { schema1 }, async (request, reply) => {
    try {
      const result = await collectionUser.insertOne({ email: request.body.email, password: request.body.password });
      return result;
    } catch (error) {
      if (error.code === 11000) {
        throw new Error('This email was already registered');
      }
    }
  });
  collectionUser.createIndex({ email: 1 }, { unique: true });

  fastify.post('/login', { schema1 }, async (request, reply) => {
    try {
      const user = await collectionUser.findOne({ email: request.body.email, password: request.body.password });
      const token = generateAccessToken(user._id, user.email);
      return { token };
    } catch (error) {
      if (error) {
        throw new Error('This token is not defiened');
      }
    }
  });
}
module.exports = { routeUSers };
