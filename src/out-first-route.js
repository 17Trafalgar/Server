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

  fastify.put("/animals/:animal", async (request, reply) => {
    const result = await collection.findOne({ animal: request.params.animal }); // я установил расширение, для id
    const id = { _id: new ObjectID(id) }; // я понял что мне нужно и разобрал код, то есть 25 строка запрос и нахождение записи, 26 замена id, 27 замена значения
    const animal = { animal: request.params.animal }; // в этой строчке я не уверен, ибо она у меня самая проблемная, я понимаю, что в ней надо написать такой код, который будет менять значение, но с трудом понимаю как, хотя чекнул прошлый роут и там пот такой схеме делал
    db.collection("test_collection").updateOne(id, animal, (request, reply) => {
      if (!result) {
        throw new Error("An error has occurred");
      } else {
        return result;
      }
    });
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
