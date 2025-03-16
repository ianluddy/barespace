-- This is an empty migration.

-- Create payment status enum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'paid', 'failed', 'refunded');

-- Add payment status column to appointments
ALTER TABLE "Appointment" ADD COLUMN "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'pending';

-- Add payment amount column
ALTER TABLE "Appointment" ADD COLUMN "paymentAmount" DECIMAL(10,2);

-- Add payment intent ID column
ALTER TABLE "Appointment" ADD COLUMN "paymentIntentId" TEXT;