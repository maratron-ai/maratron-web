-- CreateEnum
CREATE TYPE "elevationGainUnit" AS ENUM ('miles', 'kilometers', 'meters', 'feet');

-- AlterTable
ALTER TABLE "Runs" ADD COLUMN     "elevationGainUnit" "elevationGainUnit";
