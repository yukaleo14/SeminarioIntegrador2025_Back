// seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed completo...');

  // =============================================
  // 1. ESTADOS
  // =============================================
  await prisma.estado.createMany({
    skipDuplicates: true,
    data: [
      // PEDIDO
      { ambito: 'PEDIDO', nombre: 'CREADO' },
      { ambito: 'PEDIDO', nombre: 'ENPREPARACION' },
      { ambito: 'PEDIDO', nombre: 'TOMADO' },
      { ambito: 'PEDIDO', nombre: 'ENRUTA' },
      { ambito: 'PEDIDO', nombre: 'ENTREGADO' },
      { ambito: 'PEDIDO', nombre: 'CANCELADO' },
      { ambito: 'PEDIDO', nombre: 'DEMORADO' },
      { ambito: 'PEDIDO', nombre: 'PENDIENTE' },
      // PRODUCTO
      { ambito: 'PRODUCTO', nombre: 'CREADO' },
      { ambito: 'PRODUCTO', nombre: 'PUBLICADO' },
      { ambito: 'PRODUCTO', nombre: 'CANCELADO' },
      { ambito: 'PRODUCTO', nombre: 'PENDIENTE' },
      // PAGO
      { ambito: 'PAGO', nombre: 'CREADO' },
      { ambito: 'PAGO', nombre: 'PENDIENTE' },
      { ambito: 'PAGO', nombre: 'CANCELADO' },
      // SUCURSAL
      { ambito: 'SUCURSAL', nombre: 'ABIERTO' },
      { ambito: 'SUCURSAL', nombre: 'CERRADO' },
    ],
  });

  // =============================================
  // 2. FORMAS DE PAGO y CATEGORÍAS
  // =============================================
  await prisma.formaPago.createMany({ skipDuplicates: true, data: [
    { nombre: 'Debito' }, { nombre: 'Efectivo' }, { nombre: 'Credito' }, { nombre: 'Mercado Pago' }
  ]});

  await prisma.categoria.createMany({ skipDuplicates: true, data: [
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
  ]});

  // =============================================
  // 3. USUARIOS
  // =============================================
  await prisma.usuario.createMany({
    skipDuplicates: true,
    data: [
      { mail: 'u1@gmail.com', rol: 'COMPRADOR', contrasena: '$2b$10$EjemploHashAquiNoUsarEnProduccion' },
      { mail: 'u2@gmail.com', rol: 'EMPRESA',   contrasena: '$2b$14$EjemploHashAquiNoUsarEnProduccion' },
      { mail: 'u3@gmail.com', rol: 'REPARTIDOR',contrasena: '$2b$11$EjemploHashAquiNoUsarEnProduccion' },
      { mail: 'u5@gmail.com', rol: 'COMPRADOR', contrasena: '$2b$10$EjemploHashAquiNoUsarEnProduccion' },
    ],
  });

  const userComprador1 = await prisma.usuario.findUnique({ where: { mail: 'u1@gmail.com' } });
  const userEmpresa    = await prisma.usuario.findUnique({ where: { mail: 'u2@gmail.com' } });
  const userRepartidor = await prisma.usuario.findUnique({ where: { mail: 'u3@gmail.com' } });
  const userComprador2 = await prisma.usuario.findUnique({ where: { mail: 'u5@gmail.com' } });

  // =============================================
  // 4. POSICIONES y UBICACIONES
  // =============================================
  const pos1 = await prisma.posicion.create({ data: { coordenadaX: -34.603722, coordenadaY: -58.381592 } });
  const pos2 = await prisma.posicion.create({ data: { coordenadaX: -34.609722, coordenadaY: -58.382592 } });
  const pos3 = await prisma.posicion.create({ data: { coordenadaX: -34.610722, coordenadaY: -58.383592 } });

  const ubi1 = await prisma.ubicacion.create({ data: { calle: 'Calle Falsa', altura: '123', nombre: 'Springfield', posicionId: pos1.id } });
  const ubi2 = await prisma.ubicacion.create({ data: { calle: 'Avenida Siempre Viva', altura: '742', nombre: 'Springfield', posicionId: pos2.id } });
  const ubi3 = await prisma.ubicacion.create({ data: { calle: 'Calle Principal', altura: '456', nombre: 'Shelbyville', posicionId: pos3.id } });

  // =============================================
  // 5. COMPRADORES, EMPRESAS Y REPARTIDORES
  // =============================================
  await prisma.comprador.createMany({
    skipDuplicates: true,
    data: [
      { nombre: 'Juan', apellido: 'Perez', cuitCuil: '20-12345678-9', dni: '12345678', telefono: '123456789', ubicacionId: ubi1.id, usuarioId: userComprador1!.id },
      { nombre: 'Maria', apellido: 'Gomez', cuitCuil: '27-87654321-0', dni: '87654321', telefono: '987654321', ubicacionId: ubi2.id, usuarioId: userComprador2!.id },
    ],
  });

  await prisma.empresa.createMany({
    skipDuplicates: true,
    data: [
      { nombre: 'Pizzeria La Estrella', cuitCuil: '30-12345678-9', usuarioId: userEmpresa!.id },
      { nombre: 'Hamburguesería El Sabor', cuitCuil: '30-87654321-0', usuarioId: userComprador1!.id }, // ejemplo
    ],
  });

  await prisma.repartidor.createMany({
    skipDuplicates: true,
    data: [
      { nombre: 'Luis', apellido: 'Martinez', cuitCuil: '20-12345678-9', dni: '12345678', telefono: '123456789', usuarioId: userRepartidor!.id },
    ],
  });

  // Obtener entidades para usar sus IDs
  const empresa1 = await prisma.empresa.findFirst({ where: { nombre: 'Pizzeria La Estrella' } });
  const comprador1 = await prisma.comprador.findFirst({ where: { nombre: 'Juan' } });
  const repartidor1 = await prisma.repartidor.findFirst({ where: { nombre: 'Luis' } });

  // =============================================
  // 6. SUCURSALES + PRODUCTOS
  // =============================================
  const estadoAbierto = await prisma.estado.findFirst({ where: { ambito: 'SUCURSAL', nombre: 'ABIERTO' } });
  const estadoPublicado = await prisma.estado.findFirst({ where: { ambito: 'PRODUCTO', nombre: 'PUBLICADO' } });

  const sucursal1 = await prisma.sucursal.create({
    data: {
      nombre: 'Sucursal Centro - La Estrella',
      descripcion: 'Sucursal principal de Pizzeria La Estrella',
      imagen: 'laestrella.jpg',
      empresaId: empresa1!.id,
      ubicacionId: ubi1.id,
      estadoId: estadoAbierto!.id,
    }
  });

  // Productos
  const prod1 = await prisma.producto.create({
    data: { nombre: 'Hamburguesa Clásica', precio: 1500, descripcion: '...', sucursalId: sucursal1.id, estadoId: estadoPublicado!.id, categoriaId: 1, tiempoPreparacionEstimado: 20 }
  });
  const prod2 = await prisma.producto.create({
    data: { nombre: 'Pizza Pepperoni', precio: 2000, descripcion: '...', sucursalId: sucursal1.id, estadoId: estadoPublicado!.id, categoriaId: 2, tiempoPreparacionEstimado: 25 }
  });
  const prod3 = await prisma.producto.create({
    data: { nombre: 'Empanada de Carne', precio: 300, descripcion: '...', sucursalId: sucursal1.id, estadoId: estadoPublicado!.id, categoriaId: 3, tiempoPreparacionEstimado: 15 }
  });

  // =============================================
  // 7. RUTAS (preparadas para OpenStreetMap)
  // =============================================
  const ruta1 = await prisma.ruta.create({
    data: {
      origenId: ubi1.id,
      destinoId: ubi2.id,
      tarifaDistancia: 65.50,
      ubicacionId: ubi1.id,           // según tu esquema actual
    }
  });

  const ruta2 = await prisma.ruta.create({
    data: {
      origenId: ubi2.id,
      destinoId: ubi3.id,
      tarifaDistancia: 95.00,
      ubicacionId: ubi2.id,
    }
  });

  // =============================================
  // 8. PAGOS
  // =============================================
  const estadoPagoPendiente = await prisma.estado.findFirst({ where: { ambito: 'PAGO', nombre: 'PENDIENTE' } });

  const pago1 = await prisma.pago.create({
    data: { numero: 'PAGO-1001', monto: 4250.00, estadoId: estadoPagoPendiente!.id }
  });
  const pago2 = await prisma.pago.create({
    data: { numero: 'PAGO-1002', monto: 2800.50, estadoId: estadoPagoPendiente!.id }
  });

  // =============================================
  // 9. PEDIDOS + DETALLES
  // =============================================
  const estadoPedidoCreado = await prisma.estado.findFirst({ where: { ambito: 'PEDIDO', nombre: 'CREADO' } });

  const pedido1 = await prisma.pedido.create({
    data: {
      numero: 'PED-00001',
      horaLlegadaEstimada: new Date(Date.now() + 1000 * 60 * 45), // 45 minutos
      montoTotal: 4250,
      tiempoPreparacionEstimado: 35,
      tiempoRepartoEstimado: 25,
      compradorId: comprador1!.id,
      repartidorId: repartidor1!.id,
      empresaId: empresa1!.id,
      rutaId: ruta1.id,
      pagoId: pago1.id,
      estadoId: estadoPedidoCreado!.id,
    }
  });

  // Detalles del pedido
  await prisma.detalleDePedido.createMany({
    data: [
      { cantidad: 2, montoSubtotal: 3000, pedidoId: pedido1.id, productoId: prod1.id },
      { cantidad: 1, montoSubtotal: 2000, pedidoId: pedido1.id, productoId: prod2.id },
      { cantidad: 1, montoSubtotal: 300,  pedidoId: pedido1.id, productoId: prod3.id },
    ]
  });

  console.log('✅ Seed completo ejecutado con éxito!');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });