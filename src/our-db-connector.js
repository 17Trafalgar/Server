const fastifyPlugin = require("fastify-plugin");
const fastifyMongo = require("@fastify/mongodb");

async function dbConnector(fastify, options) {
  fastify.register(fastifyMongo, {
    url: "mongodb://localhost:27017/test_database",
  });
}
module.exports = fastifyPlugin(dbConnector);
