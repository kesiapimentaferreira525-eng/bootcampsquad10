/*
  Warnings:

  - Added the required column `categoria` to the `posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nivel` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "categoria" TEXT NOT NULL,
ADD COLUMN     "nivel" TEXT NOT NULL;
