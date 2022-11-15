const ObjectId = require('@fastify/mongodb').ObjectId;

async function routes(fastify, options) {
  const collection = fastify.mongo.db.collection('test_collection');

  fastify.get('/', async (request, reply) => {
    return { hello: 'world' };
  });

  fastify.get('/animals', async (request, reply) => {
    const result = await collection.find().toArray();
    if (result.length === 0) {
      throw new Error('No documents found');
    }
    return result;
  });

  fastify.get('/animals/:animal', async (request, reply) => {
    const result = await collection.findOne({ animal: request.params.animal });
    if (!result) {
      throw new Error('Invalid value');
    }
    return result;
  });

  fastify.put('/animals/:id', async (request, reply) => {
    const id = new ObjectId(request.params.id);
    const result = await collection.updateOne({ _id: id }, { $set: { animal: request.body.animal } });
    if (!result) {
      throw new Error('Cannot access id');
    }
    return result;
  });

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

  fastify.post('/animals', { schema }, async (request, reply) => {
    const result = await collection.insertOne({ animal: request.body.animal });
    return result;
  });
}

module.exports = routes;
