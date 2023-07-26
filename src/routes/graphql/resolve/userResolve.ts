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
    return new Promise((resolve, reject) => {
        try {
            const user = prisma.user.create({ data })
            resolve(user)
        } catch {
            reject('operation failed')
        }
    })

}
const modifyUsers = async ({ id, dto: data }: ID & { dto: Partial<AboutUser> }, { prisma }: Context) => {
    //пользователям обновлять существующих пользователей
    return new Promise((resolve, reject) => {
        try {
            const user = prisma.user.update({
                where: { id }, //идентификатор пользователя, которого нужно обновить
                data //содержит изменения, которые необходимо внести в информацию о пользователе
            })
            resolve(user)
        } catch {
            reject('operation failed')
        }
    })

}

//     //позволяет пользователям удалять существующих пользователей
const deleteUsers = async ({ id }: ID, { prisma }: Context) => {
    console.log('deleting');
    try {
        await prisma.user.delete({
            where: { id } // идентификатор удаляемого пользователя
        });
        return (id);
    } catch {
        throw new Error('operation failed');
    }
};

const subscribedTo = async ({ userId: id, authorId }: SubscriptionMutationUser, { prisma }: Context) => {
    //позволяет пользователям подписываться на других пользователей
    return new Promise((resolve, reject) => {
        try {
            const user = prisma.user.update({
                where: { id },//это идентификатор пользователя, который подписывается
                data: { userSubscribedTo: { create: { authorId } } },//это идентификатор пользователя, на которого подписывается пользователь
            })
            resolve(user)
        } catch {
            reject('operation failed')
        }
    })
}
const unSubscibedFrom = async ({ userId: subscriberId, authorId }: SubscriptionMutationUser, { prisma }: Context) => {
    //позволяет пользователям отписываться от других пользователей
    return new Promise((resolve, reject) => {
        try {
            const user = prisma.subscribersOnAuthors.delete({
                where: {
                    subscriberId_authorId: {
                        subscriberId, //идентификатор пользователя, отписавшегося от подписки
                        authorId //идентификатор пользователя, от которого отписывается пользователь
                    }
                },
            })
            resolve(user)
        } catch {
            reject('operation failed')
        }
    })
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