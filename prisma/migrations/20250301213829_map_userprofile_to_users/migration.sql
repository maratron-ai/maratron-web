/*
  Warnings:

  - You are about to drop the `UserProfile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Run" DROP CONSTRAINT "Run_userProfileId_fkey";

-- DropTable
DROP TABLE "UserProfile";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "age" INTEGER,
    "gender" TEXT,
    "trainingLevel" "TrainingLevel" NOT NULL,
    "VO2Max" INTEGER,
    "goals" TEXT[],
    "avatarUrl" TEXT,
    "yearsRunning" INTEGER,
    "weeklyMileage" INTEGER,
    "height" INTEGER,
    "weight" INTEGER,
    "injuryHistory" TEXT,
    "preferredTrainingDays" TEXT,
    "preferredTrainingEnvironment" "TrainingEnvironment" NOT NULL,
    "device" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "Run" ADD CONSTRAINT "Run_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
