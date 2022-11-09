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

import fastifyPlugin from "fastify-plugin";
import fastifyMongo from "@fastify/mongodb";

async function dbConnector(fastify, options) {
  fastify.register(fastifyMongo, {
    url: "mongodb://localhost:27017/test_database",
  });
}

module.exports = fastifyPlugin(dbConnector);

async function routes(fastify, options) {
  const collection = fastify.mongo.db.collection("test_collection");

  fastify.get("/", async (request, reply) => {
    return { hello: "world" };
  });

  fastify.get("/animals", async (request, reply) => {
    const result = await collection.find().toArray();
    if (result.length === 0) {
      throw new Error("No documents found");
    }
    return result;
  });

  fastify.get("/animals/:animal", async (request, reply) => {
    const result = await collection.findOne({ animal: request.params.animal });
    if (!result) {
      throw new Error("Invalid value");
    }
    return result;
  });

  const animalBodyJsonSchema = {
    type: "object",
    required: ["animal"],
    properties: {
      animal: { type: "string" },
    },
  };

  const schema = {
    body: animalBodyJsonSchema,
  };

  fastify.post("/animals", { schema }, async (request, reply) => {
    const result = await collection.insertOne({ animal: request.body.animal });
    return result;
  });
}

module.exports = routes;
