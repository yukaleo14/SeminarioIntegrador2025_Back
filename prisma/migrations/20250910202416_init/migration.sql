/*
  Warnings:

  - You are about to drop the column `dayId` on the `Horario` table. All the data in the column will be lost.
  - You are about to drop the column `payId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `coordenadaY` on the `Ubicacion` table. All the data in the column will be lost.
  - You are about to drop the `Day` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MethodPay` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Pay` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `dia` to the `Horario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pagoId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estadoId` to the `Sucursal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coordenaDia` to the `Ubicacion` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Horario` DROP FOREIGN KEY `Horario_dayId_fkey`;

-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_payId_fkey`;

-- DropForeignKey
ALTER TABLE `Pay` DROP FOREIGN KEY `Pay_EstadoId_fkey`;

-- DropForeignKey
ALTER TABLE `Pay` DROP FOREIGN KEY `Pay_methodPayId_fkey`;

-- DropIndex
DROP INDEX `Horario_dayId_fkey` ON `Horario`;

-- DropIndex
DROP INDEX `Order_payId_fkey` ON `Order`;

-- AlterTable
ALTER TABLE `Horario` DROP COLUMN `dayId`,
    ADD COLUMN `dia` ENUM('LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO') NOT NULL;

-- AlterTable
ALTER TABLE `Order` DROP COLUMN `payId`,
    ADD COLUMN `pagoId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Sucursal` ADD COLUMN `estadoId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Ubicacion` DROP COLUMN `coordenadaY`,
    ADD COLUMN `coordenaDia` DOUBLE NOT NULL;

-- DropTable
DROP TABLE `Day`;

-- DropTable
DROP TABLE `MethodPay`;

-- DropTable
DROP TABLE `Pay`;

-- CreateTable
CREATE TABLE `Pago` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `nrpago` VARCHAR(191) NOT NULL,
    `pagoDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `mount` DOUBLE NOT NULL,
    `methodpagoId` INTEGER NOT NULL,
    `EstadoId` INTEGER NOT NULL,

    UNIQUE INDEX `Pago_nrpago_key`(`nrpago`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Methodpago` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Sucursal` ADD CONSTRAINT `Sucursal_estadoId_fkey` FOREIGN KEY (`estadoId`) REFERENCES `Estado`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pago` ADD CONSTRAINT `Pago_methodpagoId_fkey` FOREIGN KEY (`methodpagoId`) REFERENCES `Methodpago`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pago` ADD CONSTRAINT `Pago_EstadoId_fkey` FOREIGN KEY (`EstadoId`) REFERENCES `Estado`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_pagoId_fkey` FOREIGN KEY (`pagoId`) REFERENCES `Pago`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
