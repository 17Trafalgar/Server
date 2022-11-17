const ObjectId = require('@fastify/mongodb').ObjectId;

async function routes(fastify, options) {
  const collection = fastify.mongo.db.collection('test_collection');
  const collectionUser = fastify.mongo.db.collection('users');

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

  fastify.delete('/animals/:id', async (request, reply) => {
    const id = new ObjectId(request.params.id);
    const result = await collection.deleteOne({ _id: id }, { $lt: { animal: request.body.animal } });
    if (!result) {
      throw new Error('Cannot access id');
    }
    return result;
  });
  //
  fastify.get('/users', async (request, reply) => {
    const result = await collectionUser.find().toArray();
    if (result.length === 0) {
      throw new Error('No documents found');
    }
    return result;
  });

  fastify.get('/users/:user', async (request, reply) => {
    const result = await collectionUser.findOne({ user: request.params.user });
    if (!result) {
      throw new Error('Invalid value');
    }
    return result;
  });
  //

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
  ///
  const userBodyJsonSchema = {
    type: 'object',
    required_email: ['email'],
    required_password: ['password'],
    properties_email: {
      email: { type: 'string' },
    },
    properties_password: {
      password: { type: 'string' },
    },
  };

  const schema1 = {
    body: userBodyJsonSchema,
  };

  fastify.post('/user', { schema1 }, async (request, reply) => {
    const result = await collectionUser.insertOne({ email: request.body.email, password: request.body.password });
    return result;
  });
}

module.exports = routes;
