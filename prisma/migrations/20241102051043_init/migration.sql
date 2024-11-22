/*
  Warnings:

  - You are about to drop the `paymentrequest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `paymentrequest` DROP FOREIGN KEY `PaymentRequest_subscription_plan_uuid_fkey`;

-- DropForeignKey
ALTER TABLE `paymentrequest` DROP FOREIGN KEY `PaymentRequest_user_uuid_fkey`;

-- DropTable
DROP TABLE `paymentrequest`;

-- CreateTable
CREATE TABLE `payment_requests` (
    `uuid` VARCHAR(191) NOT NULL,
    `user_uuid` VARCHAR(191) NOT NULL,
    `subscription_plan_uuid` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `request_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `due_date` DATETIME(3) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `payment_method` VARCHAR(191) NOT NULL DEFAULT 'bank_transfer',
    `notes` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `payment_requests` ADD CONSTRAINT `payment_requests_user_uuid_fkey` FOREIGN KEY (`user_uuid`) REFERENCES `users`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_requests` ADD CONSTRAINT `payment_requests_subscription_plan_uuid_fkey` FOREIGN KEY (`subscription_plan_uuid`) REFERENCES `subscription_plans`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;
