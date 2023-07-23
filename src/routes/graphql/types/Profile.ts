import { GraphQLBoolean, GraphQLInputObjectType, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { MemberTypeId } from "../../member-types/schemas.js";
import { memberType, memberTypeEnum } from "./Member.js";
import { UUIDType } from "./uuid.js";
import { Context, ID } from "./subscription.js";
import { typeOfUser } from './User.js'


export interface memProfile {
    isMan: boolean,
    birthYear: number,
    memberTypeId: MemberTypeId,
    userId: string
}
export interface membProfile extends memProfile, ID { }

export const typeOfProfile = new GraphQLObjectType({
    name: 'membProfile',
    fields: ({
        id: { type: new GraphQLNonNull(UUIDType) },
        isMan: { type: new GraphQLNonNull(GraphQLBoolean) },
        birthYear: { type: new GraphQLNonNull(GraphQLInt) },
        memberType: {
            type: new GraphQLNonNull(memberType),
            // используется для извлечения типа из базы данных на основе идентификатора типа который хранится в профиле
            resolve: (source: membProfile, context: Context) => {
                const loaders = context;
                return loaders.postsByAuthorIdLoader.load(source.memberTypeId);
            },
            description: 'The ID of the associated membership plan',
            deprecationReason: "Use `planId` instead",
            args: { //определяет тип входного объекта для обновления
                input: {
                    type: new GraphQLInputObjectType({
                        name: `MembPlanInputType`,
                        fields: {
                            planName: {
                                type: GraphQLString,
                            },
                        }
                    })
                }
            }
        }
        , user: {//определяет поле идентификатора пользователя для профиля участника
            type: typeOfUser as GraphQLObjectType,
            //используется для извлечения пользователя из базы данных на основе идентификатора пользователя, который хранится в профиле участника.
            resolve: (source: membProfile, context: Context) => {
                const loaders = context;
                return loaders.postsByAuthorIdLoader.load(source.userId);
            },
        }
    }),
})
export const developProfile = new GraphQLInputObjectType({//для создания нового профиля участника
    name: 'DevelopProfile',
    fields: {
        isMan: { type: new GraphQLNonNull(GraphQLBoolean) },
        birthYear: { type: new GraphQLNonNull(GraphQLInt) },
        memberTypeId: { type: new GraphQLNonNull(memberTypeEnum) },
        userId: { type: new GraphQLNonNull(UUIDType) },
    },
});

export const modifyProfile = new GraphQLInputObjectType({//для обновления  профиля участника
    name: 'ModifyProfile',
    fields: {
        isMan: { type: GraphQLBoolean },
        birthYear: { type: GraphQLInt },
        memberTypeId: { type: memberTypeEnum },
    },
});