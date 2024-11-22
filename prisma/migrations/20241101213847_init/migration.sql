/*
  Warnings:

  - You are about to drop the column `durationInDays` on the `subscription_plans` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `subscription_plans` DROP COLUMN `durationInDays`,
    ADD COLUMN `duration` VARCHAR(191) NOT NULL DEFAULT 'monthly';
