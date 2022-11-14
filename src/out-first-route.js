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
    // в пример было app.put, но у нас же другой путь и я заменил на fastify.put
    const result = await request.params.animal;
    const details = { _id: new ObjectID(id) }; //как я понял, это перменная вводит новую id, тут немного не уверен
    const note = { animal: request.body.body, title: request.body.title }; // вот эти две строчки 27 и 28 мне непонятны, я понимю, что этот код как раз таки создаёт замену, но в том примере, где я смотрел, данные считывались по ключ:значение, а у меня в свободной форме, не знаю как сделать в моём примере,help
    db.collection("test_collection").update(details, note, (err, result) => {
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
