/*
  Warnings:

  - A unique constraint covering the columns `[created_by_uuid]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `users_created_by_uuid_key` ON `users`(`created_by_uuid`);
