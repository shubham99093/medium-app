-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "imgUrl" TEXT NOT NULL DEFAULT '/images/profile.jpg';
