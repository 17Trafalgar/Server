const { auth } = require('./JWT-token');

async function routesFirst(fastify, options) {
  fastify.get('/', async (request, reply) => {
    auth(request, reply);
    return { hello: 'world' };
  });
}
module.exports = { routesFirst };
