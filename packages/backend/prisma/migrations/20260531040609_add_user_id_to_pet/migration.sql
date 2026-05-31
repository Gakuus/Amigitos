-- AlterTable
ALTER TABLE "Pet" ADD COLUMN     "userId" TEXT;

-- CreateIndex
CREATE INDEX "Pet_userId_idx" ON "Pet"("userId");

-- AddForeignKey
ALTER TABLE "Pet" ADD CONSTRAINT "Pet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
