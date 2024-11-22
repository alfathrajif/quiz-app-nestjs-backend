/*
  Warnings:

  - You are about to drop the column `user_uuid` on the `subscriptions` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `subscriptions` DROP FOREIGN KEY `subscriptions_user_uuid_fkey`;

-- AlterTable
ALTER TABLE `subscriptions` DROP COLUMN `user_uuid`;
