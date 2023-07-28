import { GraphQLInputObjectType, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { UUIDType } from "./uuid.js";
import { Context, ID } from "./subscription.js";
import { typeOfUser } from "./User.js";

export interface AboutPost {
    title: string;
    content: string;
    authorId: string;
};
interface Post extends AboutPost, ID { }

export const typeOfPost = new GraphQLObjectType({
    name: 'AboutPost',
    fields: () => ({
        id: { type: new GraphQLNonNull(UUIDType) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        content: { type: new GraphQLNonNull(GraphQLString) },
        author: {
            type: typeOfUser,
            resolve: (source: Post, context: Context) => {
                const loaders = context;
                return loaders.userLoader.load(source.authorId);
            },
        }
    })
})
export const developPostProfile = new GraphQLInputObjectType({//для создания нового профиля участника
    name: 'DevelopProfile',
    fields: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        content: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
    },
});

export const modifyPostProfile = new GraphQLInputObjectType({//для обновления  профиля участника
    name: 'ModifyProfile',
    fields: {
        title: { type: (GraphQLString) },
        content: { type: (GraphQLString) },
    },
});
