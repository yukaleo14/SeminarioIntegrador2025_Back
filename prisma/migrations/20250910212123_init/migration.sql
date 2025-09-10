/*
  Warnings:

  - You are about to drop the column `Rol` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `Rol`,
    ADD COLUMN `rol` ENUM('CLIENTE', 'DELIVERY', 'BUSINESS') NOT NULL DEFAULT 'CLIENTE';
