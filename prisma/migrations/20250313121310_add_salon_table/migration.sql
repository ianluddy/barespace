/*
  Warnings:

  - Added the required column `salonId` to the `Staff` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Staff` table without a default value. This is not possible if the table is not empty.
  - Made the column `phone` on table `Staff` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateTable
CREATE TABLE "Salon" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- Insert default salon
INSERT INTO "Salon" ("name", "address", "phone", "email", "description", "createdAt", "updatedAt")
VALUES ('Default Salon', '123 Default St', '(555) 000-0000', 'default@barespace.com', 'Default salon for existing staff', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

-- Create new Staff table
CREATE TABLE "new_Staff" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Stylist',
    "imageUrl" TEXT,
    "salonId" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Staff_salonId_fkey" FOREIGN KEY ("salonId") REFERENCES "Salon" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Copy existing data with default values
INSERT INTO "new_Staff" ("createdAt", "email", "id", "imageUrl", "name", "phone", "title", "salonId", "updatedAt")
SELECT "createdAt", "email", "id", "imageUrl", "name", COALESCE("phone", '(555) 000-0000'), 'Stylist', 1, "updatedAt"
FROM "Staff";

DROP TABLE "Staff";
ALTER TABLE "new_Staff" RENAME TO "Staff";

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
