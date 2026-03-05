import { PrismaPg } from "@prisma/adapter-pg";
import pkg from "@prisma/client"; // Import the package as a default
import "dotenv/config"; // Ensure your environment variables are loaded

const { PrismaClient } = pkg; // Extract PrismaClient from the package

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter, log: ["query"] });

export default prisma;
