/*
  Warnings:

  - A unique constraint covering the columns `[defaultShoeId]` on the table `Users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Runs" ADD COLUMN     "shoeId" TEXT;

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "defaultShoeId" TEXT;

-- CreateTable
CREATE TABLE "Shoes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "currentDistance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "distanceUnit" "DistanceUnit" NOT NULL,
    "maxDistance" DOUBLE PRECISION NOT NULL,
    "retired" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Shoes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_defaultShoeId_key" ON "Users"("defaultShoeId");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_defaultShoeId_fkey" FOREIGN KEY ("defaultShoeId") REFERENCES "Shoes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shoes" ADD CONSTRAINT "Shoes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Runs" ADD CONSTRAINT "Runs_shoeId_fkey" FOREIGN KEY ("shoeId") REFERENCES "Shoes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
