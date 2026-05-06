-- =============================================
-- 1. ESTADOS
-- =============================================
-- Estados para PEDIDO
INSERT INTO Estado (fechaHora, ambito, nombre) VALUES
  (NOW(), 'PEDIDO', 'CREADO'),
  (NOW(), 'PEDIDO', 'ENPREPARACION'),
  (NOW(), 'PEDIDO', 'TOMADO'),
  (NOW(), 'PEDIDO', 'ENRUTA'),
  (NOW(), 'PEDIDO', 'ENTREGADO'),
  (NOW(), 'PEDIDO', 'CANCELADO'),
  (NOW(), 'PEDIDO', 'DEMORADO'),
  (NOW(), 'PEDIDO', 'PENDIENTE');

-- Estados para PRODUCTO
INSERT INTO Estado (fechaHora, ambito, nombre) VALUES
  (NOW(), 'PRODUCTO', 'CREADO'),
  (NOW(), 'PRODUCTO', 'PUBLICADO'),
  (NOW(), 'PRODUCTO', 'CANCELADO'),
  (NOW(), 'PRODUCTO', 'PENDIENTE');

-- Estados para PAGO
INSERT INTO Estado (fechaHora, ambito, nombre) VALUES
  (NOW(), 'PAGO', 'CREADO'),
  (NOW(), 'PAGO', 'PENDIENTE'),
  (NOW(), 'PAGO', 'CANCELADO');

-- Estados para SUCURSAL
INSERT INTO Estado (fechaHora, ambito, nombre) VALUES
  (NOW(), 'SUCURSAL', 'ABIERTO'),
  (NOW(), 'SUCURSAL', 'CERRADO');


-- =============================================
-- 2. FORMAS DE PAGO y CATEGORÍAS
-- =============================================
INSERT INTO FormaPago (nombre) VALUES
  ('Debito'), ('Efectivo'), ('Credito'), ('Mercado Pago');

INSERT INTO Categoria (nombre, imagen) VALUES
  ('Hamburguesas', 'Hamburguesas.png'),
  ('Pizzas', 'Pizzas.png'),
  ('Empanadas', 'Empanadas.png'),
  ('Lomitos', 'Lomitos.png'),
  ('Sushi', 'Sushi.png'),
  ('Ensaladas', 'Ensaladas.png'),
  ('Pastas', 'Pastas.png'),
  ('Postres', 'Postres.png'),
  ('Vegano', 'Vegano.png'),
  ('Bebidas', 'Bebidas.png'),
  ('Helados', 'Helados.png'),
  ('Panadería', 'Panadería.png');

INSERT INTO `Pago` (`numero`, `monto`, `estadoId`)
VALUES
    ('PAGO-1001', 12500.50, (SELECT id FROM `Estado` WHERE ambito = 'PAGO' AND nombre = 'PENDIENTE' LIMIT 1)),
    ('PAGO-1002', 8750.00,  (SELECT id FROM `Estado` WHERE ambito = 'PAGO' AND nombre = 'PENDIENTE' LIMIT 1)),
    ('PAGO-1003', 23400.75, (SELECT id FROM `Estado` WHERE ambito = 'PAGO' AND nombre = 'PENDIENTE' LIMIT 1));

INSERT INTO `Usuario` (`mail`, `rol`, `contrasena`)
VALUES
 ('u1@gmail.com', 'COMPRADOR', '123456'),
 ('u2@gmail.com', 'EMPRESA', '123456'),
 ('u3@gmail.com', 'REPARTIDOR', '123456');

INSERT INTO `Posicion` (`coordenadaX`, `coordenadaY`) VALUES
    (-34.603722, -58.381592),
    (-34.609722, -58.382592),
    (-34.610722, -58.383592);

INSERT INTO `Ubicacion` (`calle`, `altura`, `nombre`, `posicionId`) VALUES
    ('Calle Falsa', '123', 'Springfield', 1),
    ('Avenida Siempre Viva', '742', 'Springfield', 2),
    ('Calle Principal', '456', 'Shelbyville', 3);


-- =============================================
-- 5. COMPRADORES, EMPRESAS Y REPARTIDORES
-- =============================================
INSERT INTO `Comprador` (`nombre`, `apellido`, `cuitCuil`, `dni`, `telefono`, `ubicacionId`, `usuarioId`) VALUES
    ('Juan', 'Perez', '20-12345678-9', '12345678', '123456789', 1, 1),
    ('Maria', 'Gomez', '27-87654321-0', '87654321', '987654321', 2, 3),
    ('Carlos', 'Lopez', '20-11111111-2', '11111111', '555555555', 3, 2),
    ('Pedro', 'Gomez', '20-22222222-3', '12738201', '666666666', 3, 4);

INSERT INTO `Empresa` (`nombre`, `cuitCuil`, `usuarioId`) VALUES
    ('Pizzeria La Estrella', '30-12345678-9', 2),   -- usuario u2
    ('Hamburguesería El Sabor', '30-87654321-0', 1), -- usuario u1 (cambiado para que tenga sentido)
    ('Sushi Bar Tokyo', '30-11111111-2', 3);

INSERT INTO `Repartidor` (`nombre`, `apellido`, `cuitCuil`, `dni`, `telefono`, `usuarioId`) VALUES
    ('Luis', 'Martinez', '20-12345678-9', '12345678', '123456789', 1),
    ('Ana', 'Rodriguez', '27-87654321-0', '87654321', '987654321', 2),
    ('Sofia', 'Garcia', '20-11111111-2', '11111111', '555555555', 3);


-- =============================================
-- 6. RUTAS y PAGOS
-- =============================================
INSERT INTO `Ruta` (`origenId`, `destinoId`, `tarifaDistancia`, `ubicacionId`) VALUES
    (1, 2, 50.00, 1),
    (2, 3, 75.00, 2),
    (3, 1, 100.00, 3);

INSERT INTO `Pago` (`numero`, `monto`, `estadoId`) VALUES 
    ('PAGO-1001', 12500.50, (SELECT id FROM `Estado` WHERE ambito = 'PAGO' AND nombre = 'PENDIENTE' LIMIT 1)),
    ('PAGO-1002', 8750.00,  (SELECT id FROM `Estado` WHERE ambito = 'PAGO' AND nombre = 'PENDIENTE' LIMIT 1)),
    ('PAGO-1003', 23400.75, (SELECT id FROM `Estado` WHERE ambito = 'PAGO' AND nombre = 'PENDIENTE' LIMIT 1));


-- =============================================
-- 7. SUCURSALES (CORREGIDO)
-- =============================================
INSERT INTO `Sucursal` (`nombre`, `descripcion`, `imagen`, `empresaId`, `ubicacionId`, `estadoId`) VALUES
('Sucursal Centro - La Estrella', 
 'Sucursal principal de Pizzeria La Estrella', 
 'laestrella.jpg', 
 1, 1, (SELECT id FROM `Estado` WHERE ambito = 'SUCURSAL' AND nombre = 'ABIERTO' LIMIT 1)),

('Sucursal Principal - El Sabor', 
 'Sucursal principal de Hamburguesería El Sabor', 
 'delsabor.jpg', 
 2, 2, (SELECT id FROM `Estado` WHERE ambito = 'SUCURSAL' AND nombre = 'ABIERTO' LIMIT 1)),

('Sucursal Tokyo', 
 'Sucursal principal de Sushi Bar Tokyo', 
 'tokyo.png', 
 3, 3, (SELECT id FROM `Estado` WHERE ambito = 'SUCURSAL' AND nombre = 'ABIERTO' LIMIT 1));


-- =============================================
-- 8. PRODUCTOS
-- =============================================
INSERT INTO `Producto` (`nombre`, `precio`, `descripcion`, `sucursalId`, `estadoId`, `categoriaId`, `tiempoPreparacionEstimado`) 
VALUES
    ('Hamburguesa Clásica', 1500.00, 'Deliciosa hamburguesa con carne de res, queso, lechuga y tomate.', 1, (SELECT id FROM `Estado` WHERE ambito = 'PRODUCTO' AND nombre = 'PUBLICADO' LIMIT 1), 1, 20),
    ('Pizza Pepperoni', 2000.00, 'Pizza con salsa de tomate, queso mozzarella y pepperoni.', 1, (SELECT id FROM `Estado` WHERE ambito = 'PRODUCTO' AND nombre = 'PUBLICADO' LIMIT 1), 2, 25),
    ('Empanada de Carne', 300.00, 'Empanada rellena de carne picada, cebolla y especias.', 2, (SELECT id FROM `Estado` WHERE ambito = 'PRODUCTO' AND nombre = 'PUBLICADO' LIMIT 1), 3, 15),
    ('Ensalada César', 1200.00, 'Ensalada fresca con lechuga, pollo a la parrilla, croutons y aderezo César.', 1, (SELECT id FROM `Estado` WHERE ambito = 'PRODUCTO' AND nombre = 'PUBLICADO' LIMIT 1), 6, 10),
    ('Helado de Chocolate', 500.00, 'Helado cremoso de chocolate con trozos de chocolate.', 2, (SELECT id FROM `Estado` WHERE ambito = 'PRODUCTO' AND nombre = 'PUBLICADO' LIMIT 1), 11, 5),
    ('Pan de Ajo', 400.00, 'Delicioso pan de ajo con mantequilla y perejil.', 3, (SELECT id FROM `Estado` WHERE ambito = 'PRODUCTO' AND nombre = 'PUBLICADO' LIMIT 1), 12, 10);
