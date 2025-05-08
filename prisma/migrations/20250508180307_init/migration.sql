-- CreateEnum
CREATE TYPE "DistanceUnit" AS ENUM ('miles', 'kilometers');

-- CreateEnum
CREATE TYPE "elevationGainUnit" AS ENUM ('miles', 'kilometers', 'meters', 'feet');

-- CreateEnum
CREATE TYPE "TrainingLevel" AS ENUM ('beginner', 'intermediate', 'advanced');

-- CreateEnum
CREATE TYPE "TrainingEnvironment" AS ENUM ('outdoor', 'treadmill', 'indoor', 'mixed');

-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');

-- CreateEnum
CREATE TYPE "Device" AS ENUM ('Garmin', 'Polar', 'Suunto', 'Fitbit', 'Apple Watch', 'Samsung Galaxy Watch', 'Coros', 'Other');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female', 'Other');

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "age" INTEGER,
    "gender" "Gender",
    "trainingLevel" "TrainingLevel",
    "VO2Max" INTEGER,
    "goals" TEXT[],
    "avatarUrl" TEXT,
    "yearsRunning" INTEGER,
    "weeklyMileage" INTEGER,
    "height" INTEGER,
    "weight" INTEGER,
    "injuryHistory" TEXT,
    "preferredTrainingDays" "DayOfWeek"[],
    "preferredTrainingEnvironment" "TrainingEnvironment",
    "device" "Device",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Runs" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "duration" TEXT NOT NULL,
    "distance" DOUBLE PRECISION NOT NULL,
    "distanceUnit" "DistanceUnit" NOT NULL,
    "trainingEnvironment" "TrainingEnvironment",
    "pace" TEXT,
    "paceUnit" "DistanceUnit",
    "elevationGain" DOUBLE PRECISION,
    "elevationGainUnit" "elevationGainUnit",
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Runs_pkey" PRIMARY KEY ("id")
);

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

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- AddForeignKey
ALTER TABLE "Runs" ADD CONSTRAINT "Runs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RunningPlans" ADD CONSTRAINT "RunningPlans_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
