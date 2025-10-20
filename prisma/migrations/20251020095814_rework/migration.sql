/*
  Warnings:

  - You are about to drop the column `lastLatency` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastServerAddress` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `uuid` on the `User` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "createRefer" TEXT NOT NULL,
    "createAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" DATETIME NOT NULL,
    "updates" INTEGER NOT NULL
);
INSERT INTO "new_User" ("createAt", "createRefer", "id", "name", "updateAt", "updates") SELECT "createAt", "createRefer", "id", "name", "updateAt", "updates" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
