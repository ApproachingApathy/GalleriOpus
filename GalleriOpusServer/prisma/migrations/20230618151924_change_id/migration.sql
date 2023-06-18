/*
  Warnings:

  - You are about to alter the column `assetId` on the `AssetTag` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `Asset` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Asset` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AssetTag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assetId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,
    CONSTRAINT "AssetTag_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AssetTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_AssetTag" ("assetId", "createdAt", "id", "tagId") SELECT "assetId", "createdAt", "id", "tagId" FROM "AssetTag";
DROP TABLE "AssetTag";
ALTER TABLE "new_AssetTag" RENAME TO "AssetTag";
CREATE TABLE "new_Asset" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "url" TEXT NOT NULL
);
INSERT INTO "new_Asset" ("createdAt", "id", "updatedAt", "url") SELECT "createdAt", "id", "updatedAt", "url" FROM "Asset";
DROP TABLE "Asset";
ALTER TABLE "new_Asset" RENAME TO "Asset";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
