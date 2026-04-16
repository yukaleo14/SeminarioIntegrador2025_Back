import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {

  // Skip seed if data already exists (makes it safe to run on every restart)
  const existingEstados = await prisma.estado.count();
  if (existingEstados > 0) {
    console.log('Seed ya ejecutado, saltando...');
    return;
  }

  // =============================================
  // 1. ESTADOS
  // =============================================
  await prisma.estado.createMany({
    data: [
      { ambito: 'PEDIDO', nombre: 'CREADO' },
      { ambito: 'PEDIDO', nombre: 'ENPREPARACION' },
      { ambito: 'PEDIDO', nombre: 'TOMADO' },
      { ambito: 'PEDIDO', nombre: 'ENRUTA' },
      { ambito: 'PEDIDO', nombre: 'ENTREGADO' },
      { ambito: 'PEDIDO', nombre: 'CANCELADO' },
      { ambito: 'PEDIDO', nombre: 'DEMORADO' },
      { ambito: 'PEDIDO', nombre: 'PENDIENTE' },

      { ambito: 'PRODUCTO', nombre: 'CREADO' },
      { ambito: 'PRODUCTO', nombre: 'PUBLICADO' },
      { ambito: 'PRODUCTO', nombre: 'CANCELADO' },
      { ambito: 'PRODUCTO', nombre: 'PENDIENTE' },

      { ambito: 'PAGO', nombre: 'CREADO' },
      { ambito: 'PAGO', nombre: 'PENDIENTE' },
      { ambito: 'PAGO', nombre: 'CANCELADO' },

      { ambito: 'SUCURSAL', nombre: 'ABIERTO' },
      { ambito: 'SUCURSAL', nombre: 'CERRADO' },
    ],
    skipDuplicates: true,
  });

  const estadoPagoPendiente = await prisma.estado.findFirst({
    where: { ambito: 'PAGO', nombre: 'PENDIENTE' },
  });

  const estadoSucursalAbierto = await prisma.estado.findFirst({
    where: { ambito: 'SUCURSAL', nombre: 'ABIERTO' },
  });

  const estadoProductoPublicado = await prisma.estado.findFirst({
    where: { ambito: 'PRODUCTO', nombre: 'PUBLICADO' },
  });

  // =============================================
  // 2. FORMAS DE PAGO y CATEGORÍAS
  // =============================================
  await prisma.formaPago.createMany({
    data: [
      { nombre: 'Debito' },
      { nombre: 'Efectivo' },
      { nombre: 'Credito' },
      { nombre: 'Mercado Pago' },
    ],
    skipDuplicates: true,
  });

  await prisma.categoria.createMany({
    data: [
      { nombre: 'Hamburguesas', imagen: 'Hamburguesas.png' },
      { nombre: 'Pizzas', imagen: 'Pizzas.png' },
      { nombre: 'Empanadas', imagen: 'Empanadas.png' },
      { nombre: 'Lomitos', imagen: 'Lomitos.png' },
      { nombre: 'Sushi', imagen: 'Sushi.png' },
      { nombre: 'Ensaladas', imagen: 'Ensaladas.png' },
      { nombre: 'Pastas', imagen: 'Pastas.png' },
      { nombre: 'Postres', imagen: 'Postres.png' },
      { nombre: 'Vegano', imagen: 'Vegano.png' },
      { nombre: 'Bebidas', imagen: 'Bebidas.png' },
      { nombre: 'Helados', imagen: 'Helados.png' },
      { nombre: 'Panadería', imagen: 'Panaderia.png' },
    ],
    skipDuplicates: true,
  });

  // =============================================
  // 3. USUARIOS
  // =============================================
  await prisma.usuario.createMany({
    data: [
      { mail: 'u1@gmail.com', rol: 'COMPRADOR', contrasena: 'hash' },
      { mail: 'u2@gmail.com', rol: 'EMPRESA', contrasena: 'hash' },
      { mail: 'u3@gmail.com', rol: 'REPARTIDOR', contrasena: 'hash' },
      { mail: 'u5@gmail.com', rol: 'COMPRADOR', contrasena: 'hash' },
    ],
    skipDuplicates: true,
  });

  // =============================================
  // 4. POSICIONES y UBICACIONES
  // =============================================
  const pos1 = await prisma.posicion.create({ data: { coordenadaX: -34.603722, coordenadaY: -58.381592 } });
  const pos2 = await prisma.posicion.create({ data: { coordenadaX: -34.609722, coordenadaY: -58.382592 } });
  const pos3 = await prisma.posicion.create({ data: { coordenadaX: -34.610722, coordenadaY: -58.383592 } });

  const ub1 = await prisma.ubicacion.create({ data: { calle: 'Calle Falsa', altura: '123', nombre: 'Springfield', posicionId: pos1.id } });
  const ub2 = await prisma.ubicacion.create({ data: { calle: 'Avenida Siempre Viva', altura: '742', nombre: 'Springfield', posicionId: pos2.id } });
  const ub3 = await prisma.ubicacion.create({ data: { calle: 'Calle Principal', altura: '456', nombre: 'Shelbyville', posicionId: pos3.id } });

  // =============================================
  // 5. ENTIDADES
  // =============================================
  await prisma.comprador.createMany({
    data: [
      { nombre: 'Juan', apellido: 'Perez', cuitCuil: '20-12345678-9', dni: '12345678', telefono: '123456789', ubicacionId: ub1.id, usuarioId: 1 },
      { nombre: 'Maria', apellido: 'Gomez', cuitCuil: '27-87654321-0', dni: '87654321', telefono: '987654321', ubicacionId: ub2.id, usuarioId: 3 },
      { nombre: 'Carlos', apellido: 'Lopez', cuitCuil: '20-11111111-2', dni: '11111111', telefono: '555555555', ubicacionId: ub3.id, usuarioId: 2 },
      { nombre: 'Pedro', apellido: 'Gomez', cuitCuil: '20-22222222-3', dni: '12738201', telefono: '666666666', ubicacionId: ub3.id, usuarioId: 4 },
    ],
    skipDuplicates: true,
  });

  await prisma.empresa.createMany({
    data: [
      { nombre: 'Pizzeria La Estrella', cuitCuil: '30-12345678-9', usuarioId: 2 },
      { nombre: 'Hamburguesería El Sabor', cuitCuil: '30-87654321-0', usuarioId: 1 },
      { nombre: 'Sushi Bar Tokyo', cuitCuil: '30-11111111-2', usuarioId: 3 },
    ],
    skipDuplicates: true,
  });

  // =============================================
  // 6. PAGOS
  // =============================================
  await prisma.pago.createMany({
    data: [
      { numero: 'PAGO-1001', monto: 12500.5, estadoId: estadoPagoPendiente!.id },
      { numero: 'PAGO-1002', monto: 8750, estadoId: estadoPagoPendiente!.id },
      { numero: 'PAGO-1003', monto: 23400.75, estadoId: estadoPagoPendiente!.id },
    ],
    skipDuplicates: true,
  });

  // =============================================
  // 7. SUCURSALES
  // =============================================
  const suc1 = await prisma.sucursal.create({
    data: {
      nombre: 'Sucursal Centro - La Estrella',
      descripcion: 'Sucursal principal',
      imagen: 'laestrella.jpg',
      empresaId: 1,
      ubicacionId: ub1.id,
      estadoId: estadoSucursalAbierto!.id,
    },
  });

  const suc2 = await prisma.sucursal.create({
    data: {
      nombre: 'Sucursal Principal - El Sabor',
      descripcion: 'Sucursal principal',
      imagen: 'delsabor.jpg',
      empresaId: 2,
      ubicacionId: ub2.id,
      estadoId: estadoSucursalAbierto!.id,
    },
  });

  // =============================================
  // 8. PRODUCTOS
  // =============================================
  await prisma.producto.createMany({
    data: [
      {
        nombre: 'Hamburguesa Clásica',
        precio: 1500,
        descripcion: '...',
        sucursalId: suc1.id,
        estadoId: estadoProductoPublicado!.id,
        categoriaId: 1,
        tiempoPreparacionEstimado: 20,
      },
      {
        nombre: 'Pizza Pepperoni',
        precio: 2000,
        descripcion: '...',
        sucursalId: suc1.id,
        estadoId: estadoProductoPublicado!.id,
        categoriaId: 2,
        tiempoPreparacionEstimado: 25,
      },
      {
        nombre: 'Empanada de Carne',
        precio: 300,
        descripcion: '...',
        sucursalId: suc2.id,
        estadoId: estadoProductoPublicado!.id,
        categoriaId: 3,
        tiempoPreparacionEstimado: 15,
      },
    ],
  });

  console.log('Seed completo');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());