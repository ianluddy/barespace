/*
  Warnings:

  - Added the required column `reference` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateFunction to generate random references
CREATE TABLE "random_chars" (
    "char" TEXT PRIMARY KEY
);
INSERT INTO "random_chars" ("char") VALUES 
('A'),('B'),('C'),('D'),('E'),('F'),('G'),('H'),('I'),('J'),('K'),('L'),('M'),
('N'),('O'),('P'),('Q'),('R'),('S'),('T'),('U'),('V'),('W'),('X'),('Y'),('Z'),
('0'),('1'),('2'),('3'),('4'),('5'),('6'),('7'),('8'),('9');

-- Create a temporary table for references
CREATE TABLE "temp_references" (
    "id" INTEGER PRIMARY KEY,
    "reference" TEXT NOT NULL
);

-- Generate references for each existing appointment
WITH RECURSIVE
  cnt(x) AS (
    SELECT 1
    UNION ALL
    SELECT x+1 FROM cnt
    LIMIT (SELECT COUNT(*) FROM "Appointment")
  )
INSERT INTO "temp_references" ("id", "reference")
SELECT 
    ROW_NUMBER() OVER (ORDER BY (SELECT NULL)),
    (
        (SELECT "char" FROM "random_chars" ORDER BY RANDOM() LIMIT 1) ||
        (SELECT "char" FROM "random_chars" ORDER BY RANDOM() LIMIT 1) ||
        (SELECT "char" FROM "random_chars" ORDER BY RANDOM() LIMIT 1) ||
        (SELECT "char" FROM "random_chars" ORDER BY RANDOM() LIMIT 1) ||
        (SELECT "char" FROM "random_chars" ORDER BY RANDOM() LIMIT 1) ||
        (SELECT "char" FROM "random_chars" ORDER BY RANDOM() LIMIT 1)
    )
FROM cnt;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_Appointment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reference" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "serviceId" INTEGER NOT NULL,
    "staffId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Appointment_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Appointment_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Appointment_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Insert existing records with pre-generated references
INSERT INTO "new_Appointment" (
    "id", "reference", "date", "startTime", "endTime", "status", 
    "serviceId", "staffId", "customerId", "notes", "createdAt", "updatedAt"
)
SELECT 
    a.*,
    tr.reference
FROM "Appointment" a
JOIN "temp_references" tr ON tr.id = a.id;

DROP TABLE "Appointment";
ALTER TABLE "new_Appointment" RENAME TO "Appointment";
CREATE UNIQUE INDEX "Appointment_reference_key" ON "Appointment"("reference");

-- Clean up
DROP TABLE "random_chars";
DROP TABLE "temp_references";

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

CREATE TABLE "new_Staff" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "imageUrl" TEXT,
    "salonId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Staff_salonId_fkey" FOREIGN KEY ("salonId") REFERENCES "Salon" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Staff" ("createdAt", "email", "id", "imageUrl", "name", "phone", "salonId", "title", "updatedAt") SELECT "createdAt", "email", "id", "imageUrl", "name", "phone", "salonId", "title", "updatedAt" FROM "Staff";
DROP TABLE "Staff";
ALTER TABLE "new_Staff" RENAME TO "Staff";
