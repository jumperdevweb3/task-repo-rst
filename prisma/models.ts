import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const { users, users_addresses } = prisma;

export { users, users_addresses };
