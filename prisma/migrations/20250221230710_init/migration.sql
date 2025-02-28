-- CreateEnum
CREATE TYPE "TrainingLevel" AS ENUM ('beginner', 'intermediate', 'advanced');

-- CreateEnum
CREATE TYPE "TrainingEnvironment" AS ENUM ('outdoor', 'treadmill', 'indoor', 'mixed');

-- CreateTable
CREATE TABLE "UserProfile" (
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

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_email_key" ON "UserProfile"("email");
