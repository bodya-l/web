/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Restaurant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Restaurant" DROP COLUMN "imageUrl",
ADD COLUMN     "bannerUrl" TEXT,
ADD COLUMN     "logoUrl" TEXT;
