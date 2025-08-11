// Create Prisma Instance and export
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = prisma;