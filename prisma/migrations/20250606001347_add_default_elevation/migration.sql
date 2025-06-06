-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "defaultDistanceUnit" "DistanceUnit" DEFAULT 'miles',
ADD COLUMN     "defaultElevationUnit" "elevationGainUnit" DEFAULT 'feet';
