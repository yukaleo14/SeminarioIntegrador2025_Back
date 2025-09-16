/*
  Warnings:

  - A unique constraint covering the columns `[address]` on the table `Sucursal` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Sucursal_address_key` ON `Sucursal`(`address`);
