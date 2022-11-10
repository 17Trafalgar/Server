const fastifyPlugin = require("fastify-plugin");
const fastifyMongo = require("@fastify/mongodb");

async function dbConnector(fastify, options) {
  console.log(0);
  fastify.register(fastifyMongo, {
    url: "mongodb://localhost:27017/test_database",
  });
  console.log(1);
}
module.exports = fastifyPlugin(dbConnector);
