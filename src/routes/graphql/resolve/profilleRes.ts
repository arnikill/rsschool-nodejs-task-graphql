import { Context, ID } from "../types/subscription.js";
import { memProfile } from "../types/Profile.js";
import { Profile } from "@prisma/client";

const getThisProfile = async ({ id }: ID, { prisma }: Context) => {
    const profile = await prisma.profile.findUnique({
        where: { id }
    })
    console.log(profile)
}

const getThisProfiles = async ({ prisma }: Context) => {
    const allprofiles = await prisma.profile.findMany()
    return JSON.stringify(allprofiles);
}

const createProfile = async ({ dto: data }: { dto: Profile }, { prisma }: Context) => {
    try {
        const profile = await prisma.profile.create({ data });
        console.log(profile)
    } catch {
        throw new Error('file not found')
    }
};

const changeProfile = async ({ id }: ID, { dto: data }: { dto: memProfile }, { prisma }: Context) => {
    try {
        const profile = await prisma.profile.update({
            where: { id },
            data
        })
        console.log(profile)
    } catch {
        throw new Error('file not found')
    }
}
const deletedProfile = async ({ id }: ID, { prisma }: Context) => {
    try {
        const profile = await prisma.profile.delete({
            where: { id },
        })
        console.log(profile)
    } catch {
        throw new Error('operation is failed')
    }
}
export default {
    getThisProfile,
    getThisProfiles,
    createProfile,
    changeProfile,
    deletedProfile,
}