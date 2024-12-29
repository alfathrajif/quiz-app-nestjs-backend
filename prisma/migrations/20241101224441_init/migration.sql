/*
  Warnings:

  - You are about to drop the column `isActive` on the `subscription_plans` table. All the data in the column will be lost.
  - You are about to drop the column `end_Date` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `started_Date` on the `subscriptions` table. All the data in the column will be lost.
  - Added the required column `end_date` to the `subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `subscription_plans` DROP COLUMN `isActive`,
    ADD COLUMN `is_active` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `subscriptions` DROP COLUMN `end_Date`,
    DROP COLUMN `started_Date`,
    ADD COLUMN `end_date` DATETIME(3) NOT NULL,
    ADD COLUMN `started_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
