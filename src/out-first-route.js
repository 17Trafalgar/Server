const { auth } = require('./JWT-token');

async function route(fastify, options) {
  fastify.get('/', async (request, reply) => {
    auth(request, reply);
    return { hello: 'world' };
  });
}
module.exports = { route };
