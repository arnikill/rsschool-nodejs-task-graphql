import { Context, ID } from '../types/subscription.js'


const toGetTypeOfMember = async ({ id }: ID, { prisma }: Context) => {
  const memberType = await prisma.memberType.findUnique({
    where: { id }
  });
  console.log(memberType)
}

const toGetTypeOfMembers = async ({ prisma }: Context) => {
  const memberTypes = await prisma.memberType.findMany();
  console.log(memberTypes)
}

export default {
  memberType: toGetTypeOfMember,
  memberTypes: toGetTypeOfMembers,
}