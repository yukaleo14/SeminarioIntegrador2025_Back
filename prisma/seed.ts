// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// async function main() {
//   await prisma.estado.createMany({
//     skipDuplicates: true,
//     data: [
//       { ambito: 'PEDIDO', nombre: 'CREADO' },
//       { ambito: 'PEDIDO', nombre: 'ENPREPARACION' },
//       { ambito: 'PEDIDO', nombre: 'TOMADO' },
//       { ambito: 'PEDIDO', nombre: 'ENRUTA' },
//       { ambito: 'PEDIDO', nombre: 'ENTREGADO' },
//       { ambito: 'PEDIDO', nombre: 'CANCELADO' },
//       { ambito: 'PEDIDO', nombre: 'DEMORADO' },
//       { ambito: 'PEDIDO', nombre: 'PENDIENTE' },
//       { ambito: 'PRODUCTO', nombre: 'CREADO' },
//       { ambito: 'PRODUCTO', nombre: 'PUBLICADO' },
//       { ambito: 'PRODUCTO', nombre: 'CANCELADO' },
//       { ambito: 'PRODUCTO', nombre: 'PENDIENTE' },
//       { ambito: 'PAGO', nombre: 'CREADO' },
//       { ambito: 'PAGO', nombre: 'PENDIENTE' },
//       { ambito: 'PAGO', nombre: 'CANCELADO' },
//       { ambito: 'SUCURSAL', nombre: 'ABIERTO' },
//       { ambito: 'SUCURSAL', nombre: 'CERRADO' },
//     ],
//   });

//   await prisma.formaPago.createMany({
//     skipDuplicates: true,
//     data: [
//       { nombre: 'Debito' },
//       { nombre: 'Efectivo' },
//       { nombre: 'Credito' },
//       { nombre: 'Mercado Pago' },
//     ],
//   });

//   await prisma.categoria.createMany({
//     skipDuplicates: true,
//     data: [
//       { nombre: 'Hamburguesas', imagen: 'Hamburguesas.png' },
//       { nombre: 'Pizzas', imagen: 'Pizzas.png' },
//       { nombre: 'Empanadas', imagen: 'Empanadas.png' },
//       { nombre: 'Lomitos', imagen: 'Lomitos.png' },
//       { nombre: 'Sushi', imagen: 'Sushi.png' },
//       { nombre: 'Ensaladas', imagen: 'Ensaladas.png' },
//       { nombre: 'Pastas', imagen: 'Pastas.png' },
//       { nombre: 'Postres', imagen: 'Postres.png' },
//       { nombre: 'Vegano', imagen: 'Vegano.png' },
//       { nombre: 'Bebidas', imagen: 'Bebidas.png' },
//       { nombre: 'Helados', imagen: 'Helados.png' },
//       { nombre: 'Panadería', imagen: 'Panadería.png' },
//     ],
//   });

//   console.log('Seed completed.');
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(() => prisma.$disconnect());
