-- -- Estados para PEDIDO
-- INSERT INTO Estado (fechaHora, ambito, nombre) VALUES
--   (NOW(), 'PEDIDO', 'CREADO'),
--   (NOW(), 'PEDIDO', 'ENPREPARACION'),
--   (NOW(), 'PEDIDO', 'TOMADO'),
--   (NOW(), 'PEDIDO', 'ENRUTA'),
--   (NOW(), 'PEDIDO', 'ENTREGADO'),
--   (NOW(), 'PEDIDO', 'CANCELADO'),
--   (NOW(), 'PEDIDO', 'DEMORADO'),
--   (NOW(), 'PEDIDO', 'PENDIENTE');

-- -- Estados para PRODUCTO
-- INSERT INTO Estado (fechaHora, ambito, nombre) VALUES
--   (NOW(), 'PRODUCTO', 'CREADO'),
--   (NOW(), 'PRODUCTO', 'PUBLICADO'),
--   (NOW(), 'PRODUCTO', 'CANCELADO'),
--   (NOW(), 'PRODUCTO', 'PENDIENTE');

-- -- Estados para PAGO
-- INSERT INTO Estado (fechaHora, ambito, nombre) VALUES
--   (NOW(), 'PAGO', 'CREADO'),
--   (NOW(), 'PAGO', 'PENDIENTE'),
--   (NOW(), 'PAGO', 'CANCELADO');

-- -- Estados para SUCURSAL
-- INSERT INTO Estado (fechaHora, ambito, nombre) VALUES
--   (NOW(), 'SUCURSAL', 'ABIERTO'),
--   (NOW(), 'SUCURSAL', 'CERRADO');


-- INSERT INTO FormaPago (nombre) VALUES
--   ('Debito'),
--   ('Efectivo'),
--   ('Credito'),
--   ('Mercado Pago');

-- INSERT INTO Categoria (nombre, imagen) VALUES
--   ('Hamburguesas', 'Hamburguesas.png'),
--   ('Pizzas', 'Pizzas.png'),
--   ('Empanadas', 'Empanadas.png'),
--   ('Lomitos', 'Lomitos.png'),
--   ('Sushi', 'Sushi.png'),
--   ('Ensaladas', 'Ensaladas.png'),
--   ('Pastas', 'Pastas.png'),
--   ('Postres', 'Postres.png'),
--   ('Vegano', 'Vegano.png'),
--   ('Bebidas', 'Bebidas.png'),
--   ('Helados', 'Helados.png'),
--   ('Panadería', 'Panadería.png');

-- INSERT INTO `Pago` (`numero`, `monto`, `estadoId`)
-- VALUES 
--     ('PAGO-1001', 12500.50, (SELECT id FROM `Estado` WHERE ambito = 'PAGO' AND nombre = 'PENDIENTE' LIMIT 1)),
--     ('PAGO-1002', 8750.00,  (SELECT id FROM `Estado` WHERE ambito = 'PAGO' AND nombre = 'PENDIENTE' LIMIT 1)),
--     ('PAGO-1003', 23400.75, (SELECT id FROM `Estado` WHERE ambito = 'PAGO' AND nombre = 'PENDIENTE' LIMIT 1));

-- INSERT INTO `Usuario` (`mail`, `rol`, `contrasena`)
-- VALUES
--  ('u1@gmail.com', 'COMPRADOR', '$2b$10$EjemploHashAquiNoUsarEnProduccion'),
--  ('u2@gmail.com', 'EMPRESA', '$2b$14$EjemploHashAquiNoUsarEnProduccion'),
--  ('u3@gmail.com', 'REPARTIDOR', '$2b$11$EjemploHashAquiNoUsarEnProduccion');

-- INSERT INTO `Posicion` (`coordenadaX`, `coordenadaY`) VALUES
--     (-34.603722, -58.381592),
--     (-34.609722, -58.382592),
--     (-34.610722, -58.383592);

-- INSERT INTO `Ubicacion` (`calle`, `altura`, `nombre`, `posicionId`) VALUES
--     ('Calle Falsa', '123', 'Springfield', 1),
--     ('Avenida Siempre Viva', '742', 'Springfield', 2),
--     ('Calle Principal', '456', 'Shelbyville', 3);


-- INSERT INTO `Comprador` (`nombre`, `apellido`, `cuitCuil`, `dni`, `telefono`, `ubicacionId`, `usuarioId`) VALUES
--     ('Juan', 'Perez', '20-12345678-9', '12345678', '123456789', 1, 1),
--     ('Maria', 'Gomez', '27-87654321-0', '87654321', '987654321', 2, 3),
--     ('Carlos', 'Lopez', '20-11111111-2', '11111111', '555555555', 3, 2);

-- INSERT INTO `Empresa` (`nombre`, `cuitCuil`, `usuarioId`) VALUES
--     ('Pizzeria La Estrella', '30-12345678-9', 1),
--     ('Hamburguesería El Sabor', '30-87654321-0', 2),
--     ('Sushi Bar Tokyo', '30-11111111-2', 3);

 INSERT INTO `Repartidor` (`nombre`, `apellido`, `cuitCuil`  ,`dni`, `telefono`, `usuarioId`) VALUES
--     ('Luis', 'Martinez', '20-12345678-9', '12345678', '123456789', 1),
--     ('Ana', 'Rodriguez', '27-87654321-0', '87654321', '987654321', 2),
--     ('Sofia', 'Garcia', '20-11111111-2', '11111111', '555555555', 3);
    ('Pedro', 'Gomez', '20-22222222-3', '22222222', '666666666', 3);

-- INSERT INTO `Ruta` (`origenId`, `destinoId`, `tarifaDistancia`, `ubicacionId` ) VALUES
--     (1, 2, 50.00, 1),
--     (2, 3, 75.00, 2),
--     (3, 1, 100.00, 3);

INSERT INTO `Pedido` (`numero`, `horaLlegadaEstimada`, `empresaId`, `rutaId` , `repartidorId`, `montoTotal`, `pagoId`, `tiempoPreparacionEstimado`, `tiempoRepartoEstimado`, `estadoId`, `compradorId`)
 VALUES 
--     ('PED-1001', '2024-07-01 19:30:00', 1, 1, 1, 12500.50, (SELECT id FROM `Pago` WHERE numero = 'PAGO-1001' LIMIT 1), 30, 20, (SELECT id FROM `Estado` WHERE ambito = 'PEDIDO' AND nombre = 'CREADO' LIMIT 1), 1),
--     ('PED-1002', '2024-07-01 20:00:00', 2, 2, 2, 8750.00, (SELECT id FROM `Pago` WHERE numero = 'PAGO-1002' LIMIT 1), 25, 15, (SELECT id FROM `Estado` WHERE ambito = 'PEDIDO' AND nombre = 'CREADO' LIMIT 1), 2),
--     ('PED-1003', '2024-07-01 21:00:00', 3, 3, 3, 23400.75, (SELECT id FROM `Pago` WHERE numero = 'PAGO-1003' LIMIT 1), 40, 30, (SELECT id FROM `Estado` WHERE ambito = 'PEDIDO' AND nombre = 'CREADO' LIMIT 1), 3);
    ('PED-1004', '2024-07-01 23:00:00', 4, 3, 3, 23500.75, (SELECT id FROM `Pago` WHERE numero = 'PAGO-1003' LIMIT 1), 45, 35, (SELECT id FROM `Estado` WHERE ambito = 'PEDIDO' AND nombre = 'CREADO' LIMIT 1), 3);
