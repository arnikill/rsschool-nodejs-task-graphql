
import { PrismaClient } from "@prisma/client";
import { DataLoaders } from "../loader.js";

export interface ID {
    id: string;
};
export interface Subscription {
    subscriberId: string;
    authorId: string;
};

export interface SubscriptionMutationUser {
    userId: string;
    authorId: string;
};

export interface Context extends DataLoaders {
    prisma: PrismaClient;
}