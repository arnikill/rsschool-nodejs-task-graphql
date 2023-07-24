import { Context, ID } from "../types/subscription.js"
import { AboutPost } from "../types/Post.js"


const getPost = async ({ id }: ID, { prisma }: Context) => {
    //принимает параметр идентификатора и возвращает объект сообщения из базы данных на основе идентификатора.
    const post = await prisma.post.findUnique({
        where: { id }
    })
    console.log(post)
};

const getPosts = async ({ prisma }: Context) => {
    //возвращает массив всех сообщений в базе данных.
    const allposts = await prisma.post.findMany()
    console.log(allposts)
};

const developPost = async ({ dto: data }: { dto: AboutPost }, { prisma }: Context) => {
    //возвращает массив всех сообщений в базе данных.
    const post = await prisma.post.create({ data });
    return post;
};

const modifyPost = async ({ id, dto: data }: ID & { dto: Partial<AboutPost> }, { prisma }: Context) => {
    ////принимает идентификатор и объект данных и обновляет существующий пост в базе данных на основе идентификатора и объекта данных.
    try {
        const post = await prisma.post.update({
            where: { id },
            data,
        });
        return post;
    } catch {
        return null;
    }
};

const deletePost = async ({ id }: ID, { prisma }: Context) => {
    //принимает идентификатор и удаляет существующий пост в базе данных на основе идентификатора.
    try {
        await prisma.post.delete({ where: { id } });
        return id;
    } catch {
        return null;
    }
};

export default {
    post: getPost,
    posts: getPosts,
    developPost,
    modifyPost,
    deletePost,
};