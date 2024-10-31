/*
  Warnings:

  - You are about to drop the column `choice_text` on the `choices` table. All the data in the column will be lost.
  - Added the required column `text` to the `choices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `choices` DROP COLUMN `choice_text`,
    ADD COLUMN `text` TEXT NOT NULL;
