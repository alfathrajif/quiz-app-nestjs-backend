/*
  Warnings:

  - You are about to drop the column `payment_proof_url` on the `payment_receipts` table. All the data in the column will be lost.
  - Added the required column `payment_proof_image` to the `payment_receipts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `payment_receipts` DROP COLUMN `payment_proof_url`,
    ADD COLUMN `payment_proof_image` VARCHAR(191) NOT NULL;
