/*
  Warnings:

  - You are about to drop the `RunningPlan` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RunningPlan" DROP CONSTRAINT "RunningPlan_userId_fkey";

-- DropTable
DROP TABLE "RunningPlan";

-- CreateTable
CREATE TABLE "RunningPlans" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "weeks" INTEGER NOT NULL,
    "planData" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RunningPlans_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RunningPlans" ADD CONSTRAINT "RunningPlans_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
