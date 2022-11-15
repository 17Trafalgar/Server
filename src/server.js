const Fastify = require('fastify');
const dbConnector = require('./our-db-connector');
const firstRoute = require('./out-first-route');

const fastify = Fastify({
  logger: true,
});
fastify.register(dbConnector);
fastify.register(firstRoute);

fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
