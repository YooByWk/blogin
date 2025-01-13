/*
  Warnings:

  - You are about to drop the column `user` on the `Token` table. All the data in the column will be lost.
  - Added the required column `blockId` to the `Log` table without a default value. This is not possible if the table is not empty.
  - Added the required column `topic` to the `Log` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transactionHash` to the `Log` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Token` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userAddress` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "User" (
    "address" TEXT NOT NULL PRIMARY KEY
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Log" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tokenId" INTEGER NOT NULL,
    "eventType" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "blockId" INTEGER NOT NULL,
    "topic" TEXT NOT NULL,
    "transactionHash" TEXT NOT NULL,
    "userAddress" TEXT,
    CONSTRAINT "Log_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "Token" ("tokenId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Log_userAddress_fkey" FOREIGN KEY ("userAddress") REFERENCES "User" ("address") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Log" ("eventType", "id", "timestamp", "tokenId") SELECT "eventType", "id", "timestamp", "tokenId" FROM "Log";
DROP TABLE "Log";
ALTER TABLE "new_Log" RENAME TO "Log";
CREATE TABLE "new_Token" (
    "tokenId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tokenURI" TEXT NOT NULL,
    "userAddress" TEXT NOT NULL,
    "isBurnt" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "burntAt" DATETIME,
    CONSTRAINT "Token_userAddress_fkey" FOREIGN KEY ("userAddress") REFERENCES "User" ("address") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Token" ("tokenId", "tokenURI") SELECT "tokenId", "tokenURI" FROM "Token";
DROP TABLE "Token";
ALTER TABLE "new_Token" RENAME TO "Token";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "User_address_key" ON "User"("address");
