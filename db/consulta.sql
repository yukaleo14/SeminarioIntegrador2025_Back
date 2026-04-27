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


INSERT INTO FormaPago (nombre) VALUES
  ('Debito'),
  ('Efectivo'),
  ('Credito'),
  ('Mercado Pago');

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
