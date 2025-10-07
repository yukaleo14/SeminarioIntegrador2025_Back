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


INSERT INTO FormaPago (nombre) VALUES
  ('Debito'),
  ('Credito'),
  ('Mercado Pago');

INSERT INTO Categoria (nombre) VALUES
  ('Bebidas'),
  ('Snacks'),
  ('Lácteos'),
  ('Carnes'),
  ('Frutas'),
  ('Verduras'),
  ('Panificados'),
  ('Dulces'),
  ('Congelados'),
  ('Comidas Preparadas');
