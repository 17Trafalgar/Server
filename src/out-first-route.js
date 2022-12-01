const { auth } = require('./JWT-token');
const { jwtMiddlware } = require('./JWTMiddlware');

async function routesFirst(fastify, options) {
  fastify.get('/', { preHandler: [jwtMiddlware] }, async (request, reply) => {
    return reply.send(request.token);
  });
}
module.exports = { routesFirst };
