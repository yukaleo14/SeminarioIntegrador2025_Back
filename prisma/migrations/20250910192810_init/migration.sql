/*
  Warnings:

  - Added the required column `estadoId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rutaId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estadoId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Order` ADD COLUMN `estadoId` INTEGER NOT NULL,
    ADD COLUMN `rutaId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Product` ADD COLUMN `estadoId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `ubicacionId` INTEGER NULL;

-- CreateTable
CREATE TABLE `Ruta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tarifaDistancia` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `origenId` INTEGER NOT NULL,
    `destinoId` INTEGER NOT NULL,
    `ubicacionId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ubicacion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `coordenadaX` DOUBLE NOT NULL,
    `coordenadaY` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_ubicacionId_fkey` FOREIGN KEY (`ubicacionId`) REFERENCES `Ubicacion`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_estadoId_fkey` FOREIGN KEY (`estadoId`) REFERENCES `State`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_rutaId_fkey` FOREIGN KEY (`rutaId`) REFERENCES `Ruta`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_estadoId_fkey` FOREIGN KEY (`estadoId`) REFERENCES `State`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ruta` ADD CONSTRAINT `Ruta_origenId_fkey` FOREIGN KEY (`origenId`) REFERENCES `Ubicacion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ruta` ADD CONSTRAINT `Ruta_destinoId_fkey` FOREIGN KEY (`destinoId`) REFERENCES `Ubicacion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
