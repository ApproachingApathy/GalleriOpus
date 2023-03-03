/*
  Warnings:

  - A unique constraint covering the columns `[value]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `url` to the `Asset` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Asset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "url" TEXT NOT NULL
);
INSERT INTO "new_Asset" ("createdAt", "id", "updatedAt") SELECT "createdAt", "id", "updatedAt" FROM "Asset";
DROP TABLE "Asset";
ALTER TABLE "new_Asset" RENAME TO "Asset";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Tag_value_key" ON "Tag"("value");
