-- CreateTable
CREATE TABLE "RunningPlan" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "weeks" INTEGER NOT NULL,
    "planData" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RunningPlan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RunningPlan" ADD CONSTRAINT "RunningPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
