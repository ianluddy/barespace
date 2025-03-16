/*
  Warnings:

  - Added the required column `salonId` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- First add the column as nullable
ALTER TABLE "Appointment" ADD COLUMN "salonId" TEXT;

-- Update existing appointments with salon IDs from their staff members
UPDATE "Appointment" a
SET "salonId" = s."salonId"
FROM "Staff" s
WHERE a."staffId" = s."id";

-- Now make the column required
ALTER TABLE "Appointment" ALTER COLUMN "salonId" SET NOT NULL;

-- Add the foreign key constraint
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_salonId_fkey" FOREIGN KEY ("salonId") REFERENCES "Salon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
