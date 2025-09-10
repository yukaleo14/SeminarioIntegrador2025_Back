/*
  Warnings:

  - You are about to drop the column `stateId` on the `Pay` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Branch` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Hours` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `State` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `EstadoId` to the `Pay` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Branch` DROP FOREIGN KEY `Branch_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Hours` DROP FOREIGN KEY `Hours_branchId_fkey`;

-- DropForeignKey
ALTER TABLE `Hours` DROP FOREIGN KEY `Hours_dayId_fkey`;

-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_estadoId_fkey`;

-- DropForeignKey
ALTER TABLE `Pay` DROP FOREIGN KEY `Pay_stateId_fkey`;

-- DropForeignKey
ALTER TABLE `Producto` DROP FOREIGN KEY `Producto_estadoId_fkey`;

-- DropIndex
DROP INDEX `Order_estadoId_fkey` ON `Order`;

-- DropIndex
DROP INDEX `Pay_stateId_fkey` ON `Pay`;

-- DropIndex
DROP INDEX `Producto_estadoId_fkey` ON `Producto`;

-- AlterTable
ALTER TABLE `Pay` DROP COLUMN `stateId`,
    ADD COLUMN `EstadoId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `role`,
    ADD COLUMN `Rol` ENUM('CLIENTE', 'DELIVERY', 'BUSINESS') NOT NULL DEFAULT 'CLIENTE';

-- DropTable
DROP TABLE `Branch`;

-- DropTable
DROP TABLE `Hours`;

-- DropTable
DROP TABLE `State`;

-- CreateTable
CREATE TABLE `Sucursal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `userId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Horario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `openTime` VARCHAR(191) NOT NULL,
    `closeTime` VARCHAR(191) NOT NULL,
    `SucursalId` INTEGER NOT NULL,
    `dayId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Estado` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ambito` ENUM('PEDIDO', 'PRODUCTO', 'PAGO') NOT NULL,
    `nombre` ENUM('CREADO', 'ENPREPARACION', 'PUBLICADO', 'TOMADO', 'ENRUTA', 'ENTREGADO', 'CANCELADO', 'DEMORADO') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Producto` ADD CONSTRAINT `Producto_estadoId_fkey` FOREIGN KEY (`estadoId`) REFERENCES `Estado`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sucursal` ADD CONSTRAINT `Sucursal_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Horario` ADD CONSTRAINT `Horario_SucursalId_fkey` FOREIGN KEY (`SucursalId`) REFERENCES `Sucursal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Horario` ADD CONSTRAINT `Horario_dayId_fkey` FOREIGN KEY (`dayId`) REFERENCES `Day`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pay` ADD CONSTRAINT `Pay_EstadoId_fkey` FOREIGN KEY (`EstadoId`) REFERENCES `Estado`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_estadoId_fkey` FOREIGN KEY (`estadoId`) REFERENCES `Estado`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
