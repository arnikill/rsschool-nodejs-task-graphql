import { ResolveTree, parseResolveInfo, simplifyParsedResolveInfoFragmentWithType } from 'graphql-parse-resolve-info';
import { AboutUser, typeOfUser } from "../types/User.js";
import { Context, ID, SubscriptionMutationUser } from "../types/subscription.js";
import { GraphQLList, GraphQLResolveInfo } from "graphql";
const getUser = async ({ id }: ID, { userLoader }: Context) => {
    //получает пользователя по его идентификатору и регистрирует пользователя
    const user = await userLoader.load(id)//использется для загрузки пользователя из базы данных.
    console.log(user)
}
const getUsers = async ({ prisma, userLoader }: Context, resolveInfo: GraphQLResolveInfo) => {
    //получает список пользователей и включает любые связанные данные для каждого пользователя.
    const parsedResolveInfoFragment = parseResolveInfo(resolveInfo);//для анализа объекта
    //упростится  объект и упрощенный объект содержит только поля, запрошенные клиентом, и включает тип каждого поля.
    const { fields }: { fields: { [key in string]: ResolveTree } } = simplifyParsedResolveInfoFragmentWithType(
        parsedResolveInfoFragment as ResolveTree,
        new GraphQLList(typeOfUser)
    )
    //клиент для базы данных
    const users = await prisma.user.findMany({
        include: {
            //поля будут включены только в том случае, если они запрошены клиентом
            userSubscribedTo: !!fields.userSubscribedTo,
            subscribedToUser: !!fields.subscribedToUser
        }
    })
    //для загрузки пользователей из базы данных
    users.forEach((user) => {
        userLoader.prime(user.id, user)//загружает пользователя из базы данных и сохраняет его в кеше
    })
    return users
}
const developUsers = async ({ dto: data }: { dto: AboutUser }, { prisma }: Context) => {
    //позволяет пользователям создавать новых пользователей
    try {
        const user = await prisma.user.create({ data })
        return user
    } catch {
        throw Error('operation failed')
    }
}
const modifyUsers = async ({ id, dto: data }: ID & { dto: Partial<AboutUser> }, { prisma }: Context) => {
    //пользователям обновлять существующих пользователей
    try {
        const user = await prisma.user.update({
            where: { id }, //идентификатор пользователя, которого нужно обновить
            data //содержит изменения, которые необходимо внести в информацию о пользователе
        })
        return user
    } catch {
        throw Error('operation failed')
    }
}
const deleteUsers = async ({ id }: ID, { prisma }: Context) => {
    //позволяет пользователям удалять существующих пользователей
    try {
        await prisma.user.delete({
            where: { id } //является идентификатором удаляемого пользователя
        })
        return id
    } catch {
        throw Error('operation failed')
    }
}
const subscribedTo = async ({ userId: id, authorId }: SubscriptionMutationUser, { prisma }: Context) => {
    //позволяет пользователям подписываться на других пользователей
    try {
        const user = await prisma.user.update({
            where: { id },//это идентификатор пользователя, который подписывается
            data: { userSubscribedTo: { create: { authorId } } },//это идентификатор пользователя, на которого подписывается пользователь
        })
        return user
    } catch {
        throw Error('operation failed')
    }

}
const unSubscibedFrom = async ({ userId: subscriberId, authorId }: SubscriptionMutationUser, { prisma }: Context) => {
    //позволяет пользователям отписываться от других пользователей
    try {
        const user = await prisma.subscribersOnAuthors.delete({
            where: {
                subscriberId_authorId: {
                    subscriberId, //идентификатор пользователя, отписавшегося от подписки
                    authorId //идентификатор пользователя, от которого отписывается пользователь
                }
            },
        })
        return user
    } catch {
        throw Error('operation failed')
    }
}
export default {
    user: getUser,
    users: getUsers,
    developUsers,
    deleteUsers,
    modifyUsers,
    subscribedTo,
    unSubscibedFrom,
};