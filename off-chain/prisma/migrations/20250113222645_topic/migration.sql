-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Log" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "eventType" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "blockId" INTEGER NOT NULL,
    "topic" TEXT,
    "transactionHash" TEXT NOT NULL,
    "userAddress" TEXT,
    "tokenId" INTEGER NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    CONSTRAINT "Log_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "Token" ("tokenId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Log_userAddress_fkey" FOREIGN KEY ("userAddress") REFERENCES "User" ("address") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Log" ("blockId", "eventType", "from", "id", "timestamp", "to", "tokenId", "topic", "transactionHash", "userAddress") SELECT "blockId", "eventType", "from", "id", "timestamp", "to", "tokenId", "topic", "transactionHash", "userAddress" FROM "Log";
DROP TABLE "Log";
ALTER TABLE "new_Log" RENAME TO "Log";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
