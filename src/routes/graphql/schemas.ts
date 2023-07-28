import { Type } from '@fastify/type-provider-typebox'; import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';
import { UUIDType } from './types/uuid.js';
import { typeOfUser, developUserProfile, modifyUserProfile } from './types/User.js';
import { memberType, memberTypeEnum } from './types/Member.js';
import { modifyPostProfile, developPostProfile, typeOfPost } from './types/Post.js';
import { modifyProfile, developProfile, typeOfProfile } from './types/Profile.js';


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
    developUsers: {
      type: typeOfUser,
      args: {
        dto: { type: developUserProfile }
      },
    },
    modifyUsers: {
      type: typeOfUser,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: modifyUserProfile }
      },
    },
    deleteUsers: {
      type: UUIDType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) }
      },
    },
    developPost: {
      type: typeOfPost as GraphQLObjectType,
      args: {
        dto: { type: developPostProfile },
      },
    },
    modifyPost: {
      type: typeOfPost as GraphQLObjectType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: modifyPostProfile },
      },
    },
    deletePost: {
      type: UUIDType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
    },
    developProfile: {
      type: typeOfProfile as GraphQLObjectType,
      args: {
        dto: { type: developProfile }
      },
    },
    modifyProfile: {
      type: typeOfProfile as GraphQLObjectType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: modifyProfile }
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