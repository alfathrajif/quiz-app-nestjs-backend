/*
  Warnings:

  - You are about to drop the column `created_by_uuid` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_created_by_uuid_fkey`;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `created_by_uuid`;
