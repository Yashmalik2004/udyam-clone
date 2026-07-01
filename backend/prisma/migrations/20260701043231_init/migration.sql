-- CreateEnum
CREATE TYPE "OrganisationType" AS ENUM ('PROPRIETORSHIP', 'PARTNERSHIP', 'HUF', 'PRIVATE_LIMITED', 'PUBLIC_LIMITED', 'LLP', 'CO_OPERATIVE', 'SELF_HELP_GROUP', 'OTHER');

-- CreateTable
CREATE TABLE "submissions" (
    "id" TEXT NOT NULL,
    "aadhaarNumber" TEXT NOT NULL,
    "aadhaarName" TEXT NOT NULL,
    "otpVerified" BOOLEAN NOT NULL DEFAULT false,
    "organisationType" "OrganisationType" NOT NULL,
    "panNumber" TEXT NOT NULL,
    "panHolderName" TEXT NOT NULL,
    "dobOrDoi" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "submissions_pkey" PRIMARY KEY ("id")
);
