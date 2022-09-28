-- AlterTable
ALTER TABLE "problem" ADD COLUMN     "availableLanguages" JSONB NOT NULL DEFAULT '["plain"]',
ADD COLUMN     "isCoding" BOOLEAN NOT NULL DEFAULT false;
