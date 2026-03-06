import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    directory: "prisma/migrations", // Note que em algumas sub-versões é 'directory' em vez de 'path'
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
