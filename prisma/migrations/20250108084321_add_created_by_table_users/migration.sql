-- AlterTable
ALTER TABLE `users` ADD COLUMN `created_by_uuid` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_created_by_uuid_fkey` FOREIGN KEY (`created_by_uuid`) REFERENCES `users`(`uuid`) ON DELETE SET NULL ON UPDATE CASCADE;
