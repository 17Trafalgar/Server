const Fastify = require("fastify");
const dbConnector = require("./our-db-connector");
const firstRoute = require("./out-first-route");

const fastify = Fastify({
  logger: true,
});
console.log(2);
fastify.register(dbConnector);
console.log(3);
fastify.register(firstRoute);
console.log(4);

fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
