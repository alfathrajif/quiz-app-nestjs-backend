-- AlterTable
ALTER TABLE `payment_requests` MODIFY `notes` TEXT NULL;

-- CreateTable
CREATE TABLE `payment_receipts` (
    `uuid` VARCHAR(191) NOT NULL,
    `payment_request_uuid` VARCHAR(191) NOT NULL,
    `upload_date` DATETIME(3) NOT NULL,
    `payment_date` DATETIME(3) NOT NULL,
    `amount_paid` INTEGER NOT NULL,
    `payment_proof_url` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `reviewed_by_uuid` VARCHAR(191) NULL,
    `review_date` DATETIME(3) NULL,
    `remarks` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `payment_receipts_payment_request_uuid_key`(`payment_request_uuid`),
    PRIMARY KEY (`uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `payment_receipts` ADD CONSTRAINT `payment_receipts_payment_request_uuid_fkey` FOREIGN KEY (`payment_request_uuid`) REFERENCES `payment_requests`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_receipts` ADD CONSTRAINT `payment_receipts_reviewed_by_uuid_fkey` FOREIGN KEY (`reviewed_by_uuid`) REFERENCES `users`(`uuid`) ON DELETE SET NULL ON UPDATE CASCADE;
