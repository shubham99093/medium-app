/*
  Warnings:

  - The primary key for the `SavedPost` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `id` was added to the `SavedPost` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "SavedPost" DROP CONSTRAINT "SavedPost_pkey",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "SavedPost_pkey" PRIMARY KEY ("id");
