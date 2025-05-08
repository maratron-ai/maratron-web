/*
  Warnings:

  - The `preferredTrainingDays` column on the `Users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "preferredTrainingDays",
ADD COLUMN     "preferredTrainingDays" "DayOfWeek"[];
