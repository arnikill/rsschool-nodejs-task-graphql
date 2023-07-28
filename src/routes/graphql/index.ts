import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema, gqlSchema } from './schemas.js';
import depthLimit from 'graphql-depth-limit'
import { developDataLoaders } from './loader.js';
import { graphql, validate, parse } from 'graphql';
import memberRes from './resolve/memberRes.js';
import postRes from './resolve/postRes.js';
import profilleRes from './resolve/profilleRes.js';
import userResolve from './resolve/userResolve.js';

const rootValue = {
  ...userResolve,
  ...memberRes,
  ...postRes,
  ...profilleRes,
}
const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;
  const dataLoaders = developDataLoaders(prisma)
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const errors = validate(gqlSchema, parse(req.body.query), [depthLimit(5)])

      if (errors.length > 0) {
        return { errors };
      }

      const response = await graphql({
        schema: gqlSchema,
        source: req.body.query,
        rootValue,
        variableValues: req.body.variables,
        contextValue: { prisma, ...dataLoaders }
      })
      return response;
    },
  });
};

export default plugin;
