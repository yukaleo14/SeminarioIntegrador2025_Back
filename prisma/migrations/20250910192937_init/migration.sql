/*
  Warnings:

  - You are about to drop the column `ambit` on the `State` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `State` table. All the data in the column will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `ambito` to the `State` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre` to the `State` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `OrderDetail` DROP FOREIGN KEY `OrderDetail_productId_fkey`;

-- DropForeignKey
ALTER TABLE `Product` DROP FOREIGN KEY `Product_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `Product` DROP FOREIGN KEY `Product_estadoId_fkey`;

-- DropIndex
DROP INDEX `OrderDetail_productId_fkey` ON `OrderDetail`;

-- AlterTable
ALTER TABLE `State` DROP COLUMN `ambit`,
    DROP COLUMN `name`,
    ADD COLUMN `ambito` ENUM('PEDIDO', 'PRODUCTO', 'PAGO') NOT NULL,
    ADD COLUMN `nombre` ENUM('CREADO', 'ENPREPARACION', 'PUBLICADO', 'TOMADO', 'ENRUTA', 'ENTREGADO', 'CANCELADO', 'DEMORADO') NOT NULL;

-- DropTable
DROP TABLE `Product`;

-- CreateTable
CREATE TABLE `Producto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `unitPrice` DOUBLE NOT NULL,
    `categoryId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `estadoId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Producto` ADD CONSTRAINT `Producto_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Producto` ADD CONSTRAINT `Producto_estadoId_fkey` FOREIGN KEY (`estadoId`) REFERENCES `State`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderDetail` ADD CONSTRAINT `OrderDetail_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Producto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
