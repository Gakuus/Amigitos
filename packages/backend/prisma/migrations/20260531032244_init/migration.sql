-- CreateEnum
CREATE TYPE "PetSpecies" AS ENUM ('CAT', 'DOG', 'RABBIT', 'HAMSTER', 'FOX', 'PANDA', 'PENGUIN', 'DRAGON', 'UNICORN', 'CUSTOM');

-- CreateEnum
CREATE TYPE "PetMood" AS ENUM ('HAPPY', 'NEUTRAL', 'SAD', 'SLEEPING', 'SICK');

-- CreateEnum
CREATE TYPE "CoupleStatus" AS ENUM ('PENDING', 'ACTIVE', 'DISSOLVED');

-- CreateEnum
CREATE TYPE "ClothingSlot" AS ENUM ('HAT', 'GLASSES', 'TOP', 'BOTTOM', 'SHOES', 'ACCESSORY', 'WINGS', 'TAIL');

-- CreateEnum
CREATE TYPE "ClothingRarity" AS ENUM ('COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('PET_FED', 'PET_PLAYED', 'PET_BATHED', 'PET_SLEPT', 'PET_EVOLVED', 'PET_SAD', 'PET_HAPPY');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL DEFAULT '',
    "avatarUrl" TEXT,
    "coupleId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Couple" (
    "id" TEXT NOT NULL,
    "status" "CoupleStatus" NOT NULL DEFAULT 'PENDING',
    "invitedBy" TEXT NOT NULL,
    "invitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acceptedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "user1Id" TEXT NOT NULL,
    "user2Id" TEXT NOT NULL,

    CONSTRAINT "Couple_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "species" "PetSpecies" NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "experience" INTEGER NOT NULL DEFAULT 0,
    "hunger" INTEGER NOT NULL DEFAULT 100,
    "happiness" INTEGER NOT NULL DEFAULT 100,
    "energy" INTEGER NOT NULL DEFAULT 100,
    "hygiene" INTEGER NOT NULL DEFAULT 100,
    "mood" "PetMood" NOT NULL DEFAULT 'HAPPY',
    "isSleeping" BOOLEAN NOT NULL DEFAULT false,
    "modelUrl" TEXT,
    "thumbnail" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "coupleId" TEXT NOT NULL,

    CONSTRAINT "Pet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WardrobeItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "slot" "ClothingSlot" NOT NULL,
    "rarity" "ClothingRarity" NOT NULL DEFAULT 'COMMON',
    "modelUrl" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "species" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "unlockCondition" TEXT,
    "unlockLevel" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WardrobeItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PetEquipment" (
    "id" TEXT NOT NULL,
    "equippedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "petId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,

    CONSTRAINT "PetEquipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interaction" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "petId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Interaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PetEvent" (
    "id" TEXT NOT NULL,
    "type" "EventType" NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "petId" TEXT NOT NULL,

    CONSTRAINT "PetEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Couple_user1Id_idx" ON "Couple"("user1Id");

-- CreateIndex
CREATE INDEX "Couple_user2Id_idx" ON "Couple"("user2Id");

-- CreateIndex
CREATE INDEX "Pet_coupleId_idx" ON "Pet"("coupleId");

-- CreateIndex
CREATE INDEX "WardrobeItem_slot_idx" ON "WardrobeItem"("slot");

-- CreateIndex
CREATE INDEX "WardrobeItem_rarity_idx" ON "WardrobeItem"("rarity");

-- CreateIndex
CREATE INDEX "PetEquipment_petId_idx" ON "PetEquipment"("petId");

-- CreateIndex
CREATE UNIQUE INDEX "PetEquipment_petId_itemId_key" ON "PetEquipment"("petId", "itemId");

-- CreateIndex
CREATE INDEX "Interaction_petId_createdAt_idx" ON "Interaction"("petId", "createdAt");

-- CreateIndex
CREATE INDEX "PetEvent_petId_createdAt_idx" ON "PetEvent"("petId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- CreateIndex
CREATE INDEX "Session_token_idx" ON "Session"("token");

-- AddForeignKey
ALTER TABLE "Pet" ADD CONSTRAINT "Pet_coupleId_fkey" FOREIGN KEY ("coupleId") REFERENCES "Couple"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetEquipment" ADD CONSTRAINT "PetEquipment_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetEquipment" ADD CONSTRAINT "PetEquipment_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "WardrobeItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interaction" ADD CONSTRAINT "Interaction_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interaction" ADD CONSTRAINT "Interaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetEvent" ADD CONSTRAINT "PetEvent_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
