/*
  Warnings:

  - You are about to drop the `posts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_userId_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "description" TEXT NOT NULL DEFAULT 'USER';

-- DropTable
DROP TABLE "posts";

-- CreateTable
CREATE TABLE "offers" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "level" VARCHAR(100) NOT NULL,
    "userId" VARCHAR(100) NOT NULL,

    CONSTRAINT "offers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "offers" ADD CONSTRAINT "offers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
