-- CreateTable
CREATE TABLE `Usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mail` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `apellido` VARCHAR(191) NOT NULL,
    `dni` VARCHAR(191) NOT NULL,
    `telefono` VARCHAR(191) NOT NULL,
    `fechaHora` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `cuit` VARCHAR(191) NULL,
    `contraseña` VARCHAR(191) NOT NULL,
    `ubicacionId` INTEGER NULL,
    `rol` ENUM('CLIENTE', 'DELIVERY', 'BUSINESS') NOT NULL DEFAULT 'CLIENTE',

    UNIQUE INDEX `Usuario_mail_key`(`mail`),
    UNIQUE INDEX `Usuario_dni_key`(`dni`),
    UNIQUE INDEX `Usuario_telefono_key`(`telefono`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Categoria` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `fechaHora` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Categoria_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Producto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `precioUnidad` DOUBLE NOT NULL,
    `categoriaId` INTEGER NOT NULL,
    `estadoId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sucursal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `direccion` VARCHAR(191) NOT NULL,
    `estadoId` INTEGER NOT NULL,
    `usuarioId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Horario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `desde` VARCHAR(191) NOT NULL,
    `hasta` VARCHAR(191) NOT NULL,
    `sucursalId` INTEGER NOT NULL,
    `dia` ENUM('LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pago` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `numero` VARCHAR(191) NOT NULL,
    `fechaHora` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `monto` DOUBLE NOT NULL,
    `formaPagoId` INTEGER NOT NULL,
    `estadoId` INTEGER NOT NULL,

    UNIQUE INDEX `Pago_numero_key`(`numero`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FormaPago` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Estado` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fechaHora` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ambito` ENUM('PEDIDO', 'PRODUCTO', 'PAGO') NOT NULL,
    `nombre` ENUM('CREADO', 'ENPREPARACION', 'PUBLICADO', 'TOMADO', 'ENRUTA', 'ENTREGADO', 'CANCELADO', 'DEMORADO', 'PENDIENTE') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pedido` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `numero` VARCHAR(191) NOT NULL,
    `horaLlegadaEstimada` DATETIME(3) NOT NULL,
    `montoTotal` INTEGER NOT NULL,
    `tiempoPreparacionEstimado` INTEGER NOT NULL,
    `tiempoRepartoEstimado` INTEGER NOT NULL,
    `fechaHora` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `usuarioId` INTEGER NOT NULL,
    `deliveryId` INTEGER NOT NULL,
    `companyId` INTEGER NOT NULL,
    `rutaId` INTEGER NOT NULL,
    `pagoId` INTEGER NOT NULL,
    `estadoId` INTEGER NOT NULL,

    UNIQUE INDEX `Pedido_numero_key`(`numero`),
    UNIQUE INDEX `Pedido_horaLlegadaEstimada_key`(`horaLlegadaEstimada`),
    UNIQUE INDEX `Pedido_montoTotal_key`(`montoTotal`),
    UNIQUE INDEX `Pedido_tiempoPreparacionEstimado_key`(`tiempoPreparacionEstimado`),
    UNIQUE INDEX `Pedido_tiempoRepartoEstimado_key`(`tiempoRepartoEstimado`),
    UNIQUE INDEX `Pedido_usuarioId_key`(`usuarioId`),
    UNIQUE INDEX `Pedido_deliveryId_key`(`deliveryId`),
    UNIQUE INDEX `Pedido_companyId_key`(`companyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DetalleDePedido` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cantidad` INTEGER NOT NULL,
    `montoSubtotal` DOUBLE NOT NULL,
    `fechaHora` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `pedidoId` INTEGER NOT NULL,
    `productoId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ruta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tarifaDistancia` DOUBLE NOT NULL,
    `fechaHora` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
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
    `fechaHora` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Usuario` ADD CONSTRAINT `Usuario_ubicacionId_fkey` FOREIGN KEY (`ubicacionId`) REFERENCES `Ubicacion`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Producto` ADD CONSTRAINT `Producto_categoriaId_fkey` FOREIGN KEY (`categoriaId`) REFERENCES `Categoria`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Producto` ADD CONSTRAINT `Producto_estadoId_fkey` FOREIGN KEY (`estadoId`) REFERENCES `Estado`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sucursal` ADD CONSTRAINT `Sucursal_estadoId_fkey` FOREIGN KEY (`estadoId`) REFERENCES `Estado`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sucursal` ADD CONSTRAINT `Sucursal_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Horario` ADD CONSTRAINT `Horario_sucursalId_fkey` FOREIGN KEY (`sucursalId`) REFERENCES `Sucursal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pago` ADD CONSTRAINT `Pago_formaPagoId_fkey` FOREIGN KEY (`formaPagoId`) REFERENCES `FormaPago`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pago` ADD CONSTRAINT `Pago_estadoId_fkey` FOREIGN KEY (`estadoId`) REFERENCES `Estado`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pedido` ADD CONSTRAINT `Pedido_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pedido` ADD CONSTRAINT `Pedido_deliveryId_fkey` FOREIGN KEY (`deliveryId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pedido` ADD CONSTRAINT `Pedido_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pedido` ADD CONSTRAINT `Pedido_rutaId_fkey` FOREIGN KEY (`rutaId`) REFERENCES `Ruta`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pedido` ADD CONSTRAINT `Pedido_pagoId_fkey` FOREIGN KEY (`pagoId`) REFERENCES `Pago`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pedido` ADD CONSTRAINT `Pedido_estadoId_fkey` FOREIGN KEY (`estadoId`) REFERENCES `Estado`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetalleDePedido` ADD CONSTRAINT `DetalleDePedido_pedidoId_fkey` FOREIGN KEY (`pedidoId`) REFERENCES `Pedido`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetalleDePedido` ADD CONSTRAINT `DetalleDePedido_productoId_fkey` FOREIGN KEY (`productoId`) REFERENCES `Producto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ruta` ADD CONSTRAINT `Ruta_origenId_fkey` FOREIGN KEY (`origenId`) REFERENCES `Ubicacion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ruta` ADD CONSTRAINT `Ruta_destinoId_fkey` FOREIGN KEY (`destinoId`) REFERENCES `Ubicacion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
