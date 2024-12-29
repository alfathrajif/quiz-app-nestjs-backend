/*
  Warnings:

  - You are about to drop the column `payment_receipt_uuid` on the `payment_logs` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `payment_logs` DROP FOREIGN KEY `payment_logs_payment_receipt_uuid_fkey`;

-- DropForeignKey
ALTER TABLE `payment_logs` DROP FOREIGN KEY `payment_logs_subscription_uuid_fkey`;

-- AlterTable
ALTER TABLE `payment_logs` DROP COLUMN `payment_receipt_uuid`,
    MODIFY `subscription_uuid` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `payment_logs` ADD CONSTRAINT `payment_logs_subscription_uuid_fkey` FOREIGN KEY (`subscription_uuid`) REFERENCES `subscriptions`(`uuid`) ON DELETE SET NULL ON UPDATE CASCADE;
