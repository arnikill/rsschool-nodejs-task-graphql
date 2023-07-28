import { GraphQLFloat, GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { UUIDType } from "./uuid.js";
import { Context, ID, Subscription } from "./subscription.js";
import { typeOfProfile } from "./Profile.js";
import { typeOfPost } from "./Post.js";


export interface AboutUser {
    name: string,
    balance: number
}

export interface User extends AboutUser, ID {
    userSubscribedTo?: Subscription[];
    subscribedToUser?: Subscription[];
}

export const typeOfUser = new GraphQLObjectType({//новый тип входного объекта,используются для отправки данных на сервер GraphQl
    name: "User",
    fields: () => ({
        id: { type: new GraphQLNonNull(UUIDType) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        balance: { type: new GraphQLNonNull(GraphQLFloat) },
        profile: {
            type: typeOfProfile as GraphQLObjectType,
            description: "The User's Profile",
            resolve: (source: User, context: Context) => {
                const loaders = context;
                return loaders.userLoader.load(source.id);
            },
        },
        posts: {
            type: new GraphQLList(typeOfPost),
            description: "The User's Posts",
            resolve: (source: User, context: Context) => {
                const loaders = context;
                return loaders.postsByAuthorIdLoader.load(source.id);
            },
        },
        userSubscribedTo: {
            type: new GraphQLList(typeOfUser),
            resolve: async (
                source: User,
                { userLoader }: Context,
            ) => {
                if (source.userSubscribedTo && userLoader) {
                    const promises = source.userSubscribedTo.map(({ authorId }) => userLoader.load(authorId));
                    return Promise.all(promises);
                }
                return null;
            },
        },
        subscribedToUser: {
            type: new GraphQLList(typeOfUser),
            resolve: async (
                source: User,

                { userLoader }: Context,
            ) => {
                if (source.subscribedToUser && userLoader) {
                    const promises = source.subscribedToUser.map(({ subscriberId }) => userLoader.load(subscriberId));
                    return Promise.all(promises);
                }
                return null;
            },
        },
    }),
})


export const developUserProfile = new GraphQLInputObjectType({ //для создания новых пользовательских объектов
    name: 'developTypeOfUser',
    fields: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        balance: { type: new GraphQLNonNull(GraphQLFloat) },
    },
})


export const modifyUserProfile = new GraphQLInputObjectType({//используется для обновления существующих пользовательских объектов
    name: 'ChangeTypeOfUser',
    fields: {
        name: { type: (GraphQLString) },
        balance: { type: (GraphQLFloat) },
    },
})