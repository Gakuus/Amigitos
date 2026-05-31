-- DropForeignKey
ALTER TABLE "Pet" DROP CONSTRAINT "Pet_coupleId_fkey";

-- AlterTable
ALTER TABLE "Pet" ALTER COLUMN "coupleId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Pet" ADD CONSTRAINT "Pet_coupleId_fkey" FOREIGN KEY ("coupleId") REFERENCES "Couple"("id") ON DELETE SET NULL ON UPDATE CASCADE;
