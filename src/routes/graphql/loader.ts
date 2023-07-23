import { MemberType, PrismaClient, Profile } from "@prisma/client";
import DataLoader from "dataloader";
import { MemberTypeId } from "../member-types/schemas.js";
import { AboutPost } from "./types/Post.js"
import { User } from "./types/User.js";

export interface DataLoaders {
  userLoader: DataLoader<string, User>,
  postsByAuthorIdLoader: DataLoader<string, AboutPost[]>,
  profileByUserIdLoader: DataLoader<string, Profile>,
  profilesByMemberTypeIdLoader: DataLoader<string, Profile[]>,
  memberTypeLoader: DataLoader<MemberTypeId, MemberType>,
  //использоваться для предварительной выборки данных о пользователях
};

export const developDataLoaders = (prisma: PrismaClient): DataLoaders => {//принимает объект PrismaClient в качестве входных данных и возвращает объект DataLoaders.

  const batchToGetUserId = async (ids: readonly string[]) => {
    const users = await prisma.user.findMany({
      where: { id: { in: ids as string[] } },
      include: {
        userSubscribedTo: true,
        subscribedToUser: true,
      },
    });
    const USER_ACC: Record<string, User> = {};
    for (const user of users) {
      USER_ACC[user.id] = user;
    }

    return ids.map(id => USER_ACC[id]);
  };

  const batchAuthorIdPosts = async (ids: readonly string[]) => {
    const posts = await prisma.post.findMany({
      where: { authorId: { in: ids as string[] } },
    });

    const POST_ACC: Record<string, AboutPost[]> = {};

    for (const post of posts) {
      if (POST_ACC[post.authorId]) {
        POST_ACC[post.authorId].push(post);
      } else {
        POST_ACC[post.authorId] = [post];
      }
    }

    return ids.map(id => POST_ACC[id] || []);
  };
  const batchUserIdProfiles = async (ids: readonly string[]) => {
    const profiles = await prisma.profile.findMany({
      where: { userId: { in: ids as string[] } },
    });
    const PROFILE_ACC: Record<string, Profile> = {};

    for (const profile of profiles) {
      PROFILE_ACC[profile.userId] = profile;
    }

    return ids.map(id => PROFILE_ACC[id]);
  }

  const batchMemberTypeIdProfiles = async (ids: readonly MemberTypeId[]) => {
    const profiles = await prisma.profile.findMany({
      where: { memberTypeId: { in: ids as MemberTypeId[] } },
    });
    const PROFILE_ACC: Record<string, Profile[]> = {};

    for (const profile of profiles) {
      if (PROFILE_ACC[profile.memberTypeId]) {
        PROFILE_ACC[profile.memberTypeId].push(profile);
      } else {
        PROFILE_ACC[profile.memberTypeId] = [profile];
      }
    }

    return ids.map(id => PROFILE_ACC[id] || []);
  }

  const batchMeberTypes = async (ids: readonly MemberTypeId[]) => {
    const memberTypes = await prisma.memberType.findMany({
      where: { id: { in: ids as MemberTypeId[] } }
    });
    const MEMBER_TYPE_ACC = memberTypes.reduce((acc, memberType) => {
      acc[memberType.id] = memberType;
      return acc;
    }, {} as Record<MemberTypeId, MemberType>);

    return ids.map(id => MEMBER_TYPE_ACC[id] ?? null);
  };


  return {
    userLoader: new DataLoader(batchToGetUserId),
    postsByAuthorIdLoader: new DataLoader(batchAuthorIdPosts),
    profileByUserIdLoader: new DataLoader(batchUserIdProfiles),
    profilesByMemberTypeIdLoader: new DataLoader(batchMemberTypeIdProfiles),
    memberTypeLoader: new DataLoader(batchMeberTypes),
  }
};