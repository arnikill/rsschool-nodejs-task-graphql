import { Type } from '@fastify/type-provider-typebox'; import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';
import { UUIDType } from './types/uuid.js';
import { typeOfUser, createUserInput, changeUserInput } from './types/User.js';
import { memberType, memberTypeEnum } from './types/Member.js';
import { changePostInput, createPostInput, typeOfPost } from './types/Post.js';
import { changeProfileInput, typeOfProfile, createProfileInput, } from './types/Profile.js';


export const gqlResponseSchema = Type.Partial(
  Type.Object({
    data: Type.Any(),
    errors: Type.Any(),
  }),
);

export const createGqlResponseSchema = {
  body: Type.Object(
    {
      query: Type.String(),
      variables: Type.Optional(Type.Record(Type.String(), Type.Any())),
    },
    {
      additionalProperties: false,
    },
  ),
};
//определяет типы запросов и мутаций
const query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    user: {
      type: typeOfUser,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
    },
    users: {
      type: new GraphQLList(typeOfUser),
    },
    memberType: {
      type: memberType as GraphQLObjectType,
      args: {
        id: { type: new GraphQLNonNull(memberTypeEnum) },
      },
    },
    memberTypes: {
      type: new GraphQLList(memberType),
    },
    post: {
      type: typeOfPost as GraphQLObjectType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
    },
    posts: {
      type: new GraphQLList(typeOfPost)
    },
    profile: {
      type: typeOfProfile as GraphQLObjectType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
    },
    profiles: {
      type: new GraphQLList(typeOfProfile)
    }
  }
})

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUsers: {
      type: typeOfUser,
      args: {
        dto: { type: createUserInput }
      },
    },
    changeUsers: {
      type: typeOfUser,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: changeUserInput }
      },
    },
    deleteUsers: {
      type: UUIDType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) }
      },
    },
    createPost: {
      type: typeOfPost as GraphQLObjectType,
      args: {
        dto: { type: createPostInput },
      },
    },
    changePost: {
      type: typeOfPost as GraphQLObjectType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: changePostInput },
      },
    },
    deletePost: {
      type: UUIDType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
    },
    createProfile: {
      type: typeOfProfile as GraphQLObjectType,
      args: {
        dto: { type: createProfileInput }
      },
    },
    changeProfile: {
      type: typeOfProfile as GraphQLObjectType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: changeProfileInput }
      }
    },
    deleteProfile: {
      type: UUIDType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      }
    },
    subscribeTo: {
      type: typeOfUser,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
    },
    unSubscibedFrom: {
      type: GraphQLString,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
    },
  }
})
export const gqlSchema = new GraphQLSchema({ query, mutation })