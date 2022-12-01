const ObjectId = require('@fastify/mongodb').ObjectId;
const { auth } = require('./JWT-token');
const { jwtMiddlware } = require('./JWTMiddlware');

async function routesAnimals(fastify, options) {
  const collection = fastify.mongo.db.collection('test_collection');

  const animalBodyJsonSchema = {
    type: 'object',
    required: ['animal'],
    properties: {
      animal: { type: 'string' },
    },
  };

  const schema = {
    body: animalBodyJsonSchema,
  };

  fastify.get('/animals', { preHandler: [jwtMiddlware] }, async (request, reply) => {
    const result = await collection.find().toArray();
    if (result.length === 0) {
      throw new Error('No documents found');
    }
    return result;
  });

  fastify.get('/animals/:animal', { preHandler: [jwtMiddlware] }, async (request, reply) => {
    const result = await collection.findOne({ animal: request.params.animal });
    if (!result) {
      throw new Error('Invalid value');
    }
    return result;
  });

  fastify.put('/animals/:id', { preHandler: [jwtMiddlware] }, async (request, reply) => {
    const id = new ObjectId(request.params.id);
    const result = await collection.updateOne({ _id: id }, { $set: { animal: request.body.animal } });
    if (!result) {
      throw new Error('Cannot access id');
    }
    return result;
  });

  fastify.delete('/animals/:id', { preHandler: [jwtMiddlware] }, async (request, reply) => {
    const id = new ObjectId(request.params.id);
    const result = await collection.deleteOne({ _id: id }, { $lt: { animal: request.body.animal } });
    if (!result) {
      throw new Error('Cannot access id');
    }
    return result;
  });

  fastify.post('/animals', { schema }, async (request, reply) => {
    auth(request, reply);
    const result = await collection.insertOne({ animal: request.body.animal });
    return result;
  });
}
module.exports = { routesAnimals };
