import Fastify from "fastify";
import dbConnector from "./our-db-connector";
import firstRoute from "./our-first-route";

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

("use strict");

module.exports = async function (fastify, opts) {
  fastify.get("/", async (request, reply) => {
    return { hello: "world" };
  });
};
