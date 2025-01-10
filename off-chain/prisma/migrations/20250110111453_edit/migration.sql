/*
  Warnings:

  - You are about to drop the column `owner_address` on the `Token` table. All the data in the column will be lost.
  - Added the required column `user` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Token" (
    "tokenId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user" TEXT NOT NULL,
    "tokenURI" TEXT NOT NULL
);
INSERT INTO "new_Token" ("tokenId", "tokenURI") SELECT "tokenId", "tokenURI" FROM "Token";
DROP TABLE "Token";
ALTER TABLE "new_Token" RENAME TO "Token";
CREATE UNIQUE INDEX "Token_user_tokenId_key" ON "Token"("user", "tokenId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
