/*
  Warnings:

  - You are about to drop the column `userProfileId` on the `Run` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Run` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Run" DROP CONSTRAINT "Run_userProfileId_fkey";

-- AlterTable
ALTER TABLE "Run" DROP COLUMN "userProfileId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Run" ADD CONSTRAINT "Run_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
