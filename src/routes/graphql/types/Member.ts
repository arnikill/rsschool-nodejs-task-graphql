import { GraphQLEnumType, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { MemberTypeId } from '../../member-types/schemas.js'
import { typeOfProfile } from "./Profile.js";
import { Context } from "./subscription.js";

interface Member {
    id: MemberTypeId,
    discount: number,
    limitPost: number
}
export const memberTypeEnum = new GraphQLEnumType({//определяет возможные значения для поля `id`
    name: 'MemberTypeEnum',
    values: {
        BASIC: { value: MemberTypeId.BASIC, description: "Basic membership" },
        BUSINESS: { value: MemberTypeId.BUSINESS, description: "Business membership" },
    }
})
export const memberType = new GraphQLObjectType<Member, Context>({
    name: 'MemberType',
    fields: () => ({
        id: { type: memberTypeEnum }, //идентификаторо объекта `Member`
        discount: { type: new GraphQLNonNull(GraphQLFloat) },//процент скидки участника
        limitPost: { type: new GraphQLNonNull(GraphQLInt) },//максимальное количество сообщений за месяц
        memberProfiles: { type: new GraphQLList(typeOfProfile) },//список профилей участников
    }),
});

export const member = new GraphQLObjectType({//«member» определяет поля для объекта «Member»
    name: 'Member',
    fields: () => ({//определяет поля, доступные в объекте `Member`
        typeId: { type: memberTypeEnum },//идентификатором объекта `Member`
        userId: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: async (source: Member, { profilesByMemberTypeIdLoader }: Context) => profilesByMemberTypeIdLoader.load(source.id) //для поля «userId» возвращает поле «_id» родительского значения.
        },
    }),
})

