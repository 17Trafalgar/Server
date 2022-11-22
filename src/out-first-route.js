const ObjectId = require('@fastify/mongodb').ObjectId;
const generateAccessToken = require('./JWT-token');
const { secret } = require('./confing');

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

  fastify.post('/register', { schema1 }, async (request, reply) => {
    try {
      const result = await collectionUser.insertOne({ email: request.body.email, password: request.body.password });
      return result;
    } catch (error) {
      if (error.code === 11000) {
        throw new Error('This email was already registered');
      }
    }
  });
  collectionUser.createIndex({ email: 1 }, { unique: true });

  fastify.post('/login', { schema1 }, async (request, reply) => {
    try {
      const user = await collectionUser.findOne({ email: request.body.email, password: request.body.password });
      return generateAccessToken(user._id, user.email);
    } catch (error) {
      if (error) {
        throw new Error('This token is not defiened');
      }
    }
  });
  async function checkaccessToken(request, reply) {
    const checkToken = await collection.findOne({ secret }).toArray();
    if (checkToken.length === 0) {
      throw new Error('Dont find a token');
    }
  }
}

module.exports = routes;
