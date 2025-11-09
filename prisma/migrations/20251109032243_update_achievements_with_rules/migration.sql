-- CreateEnum
CREATE TYPE "AchievementType" AS ENUM ('TOTAL_ORDERS', 'UNIQUE_RESTAURANTS');

-- AlterTable
ALTER TABLE "Achievement" ADD COLUMN     "threshold" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "type" "AchievementType" NOT NULL DEFAULT 'TOTAL_ORDERS';
