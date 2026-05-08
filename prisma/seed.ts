import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // =============================================
  // 1. ESTADOS
  // =============================================
  await prisma.estado.createMany({
    skipDuplicates: true,
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
  });

  // =============================================
  // 2. FORMAS DE PAGO y CATEGORÍAS
  // =============================================
  await prisma.formaPago.createMany({
    skipDuplicates: true,
    data: [
      { nombre: 'Debito' },
      { nombre: 'Efectivo' },
      { nombre: 'Credito' },
      { nombre: 'Mercado Pago' },
    ],
  });

  await prisma.categoria.createMany({
    skipDuplicates: true,
    data: [
      { nombre: 'Hamburguesas', imagen: 'Hamburguesas.png' },
      { nombre: 'Pizzas',       imagen: 'Pizzas.png' },
      { nombre: 'Empanadas',    imagen: 'Empanadas.png' },
      { nombre: 'Lomitos',      imagen: 'Lomitos.png' },
      { nombre: 'Sushi',        imagen: 'Sushi.png' },
      { nombre: 'Ensaladas',    imagen: 'Ensaladas.png' },
      { nombre: 'Pastas',       imagen: 'Pastas.png' },
      { nombre: 'Postres',      imagen: 'Postres.png' },
      { nombre: 'Vegano',       imagen: 'Vegano.png' },
      { nombre: 'Bebidas',      imagen: 'Bebidas.png' },
      { nombre: 'Helados',      imagen: 'Helados.png' },
      { nombre: 'Panadería',    imagen: 'Panaderia.png' },
    ],
  });

  // Resolver IDs de categoría y estado dinámicamente
  const [
    catHamburguesas, catPizzas, catEmpanadas, catLomitos,
    catEnsaladas, catPastas, catPostres, catBebidas,
  ] = await Promise.all([
    prisma.categoria.findFirst({ where: { nombre: 'Hamburguesas' } }),
    prisma.categoria.findFirst({ where: { nombre: 'Pizzas' } }),
    prisma.categoria.findFirst({ where: { nombre: 'Empanadas' } }),
    prisma.categoria.findFirst({ where: { nombre: 'Lomitos' } }),
    prisma.categoria.findFirst({ where: { nombre: 'Ensaladas' } }),
    prisma.categoria.findFirst({ where: { nombre: 'Pastas' } }),
    prisma.categoria.findFirst({ where: { nombre: 'Postres' } }),
    prisma.categoria.findFirst({ where: { nombre: 'Bebidas' } }),
  ]);

  const [estadoAbierto, estadoPublicado, estadoPedidoCreado, estadoPagoPendiente] =
    await Promise.all([
      prisma.estado.findFirst({ where: { ambito: 'SUCURSAL', nombre: 'ABIERTO' } }),
      prisma.estado.findFirst({ where: { ambito: 'PRODUCTO', nombre: 'PUBLICADO' } }),
      prisma.estado.findFirst({ where: { ambito: 'PEDIDO',   nombre: 'CREADO' } }),
      prisma.estado.findFirst({ where: { ambito: 'PAGO',     nombre: 'PENDIENTE' } }),
    ]);

  // =============================================
  // 3. USUARIOS  (contraseña: test1234)
  // =============================================
  const passHash = await bcrypt.hash('test1234', 10);

  await prisma.usuario.createMany({
    skipDuplicates: true,
    data: [
      { mail: 'comprador1@test.com',  rol: 'COMPRADOR',   contrasena: passHash },
      { mail: 'comprador2@test.com',  rol: 'COMPRADOR',   contrasena: passHash },
      { mail: 'empresa1@test.com',    rol: 'EMPRESA',     contrasena: passHash },
      { mail: 'empresa2@test.com',    rol: 'EMPRESA',     contrasena: passHash },
      { mail: 'repartidor1@test.com', rol: 'REPARTIDOR',  contrasena: passHash },
    ],
  });

  const [uComprador1, uComprador2, uEmpresa1, uEmpresa2, uRepartidor] = await Promise.all([
    prisma.usuario.findUnique({ where: { mail: 'comprador1@test.com' } }),
    prisma.usuario.findUnique({ where: { mail: 'comprador2@test.com' } }),
    prisma.usuario.findUnique({ where: { mail: 'empresa1@test.com' } }),
    prisma.usuario.findUnique({ where: { mail: 'empresa2@test.com' } }),
    prisma.usuario.findUnique({ where: { mail: 'repartidor1@test.com' } }),
  ]);

  // =============================================
  // 4. POSICIONES y UBICACIONES
  // =============================================
  const posiciones = await Promise.all([
    prisma.posicion.create({ data: { coordenadaX: -34.6037, coordenadaY: -58.3816 } }), // Centro
    prisma.posicion.create({ data: { coordenadaX: -34.5883, coordenadaY: -58.4267 } }), // Palermo
    prisma.posicion.create({ data: { coordenadaX: -34.6197, coordenadaY: -58.4391 } }), // Caballito
    prisma.posicion.create({ data: { coordenadaX: -34.5621, coordenadaY: -58.4577 } }), // Belgrano
    prisma.posicion.create({ data: { coordenadaX: -34.6438, coordenadaY: -58.3780 } }), // Boedo
    prisma.posicion.create({ data: { coordenadaX: -34.6218, coordenadaY: -58.3730 } }), // San Telmo
  ]);

  const ubicaciones = await Promise.all([
    prisma.ubicacion.create({ data: { calle: 'Av. Corrientes',    altura: '1234', nombre: 'Centro',   posicionId: posiciones[0].id } }),
    prisma.ubicacion.create({ data: { calle: 'Av. Santa Fe',      altura: '2500', nombre: 'Palermo',  posicionId: posiciones[1].id } }),
    prisma.ubicacion.create({ data: { calle: 'Av. Rivadavia',     altura: '3000', nombre: 'Caballito',posicionId: posiciones[2].id } }),
    prisma.ubicacion.create({ data: { calle: 'Av. Cabildo',       altura: '1500', nombre: 'Belgrano', posicionId: posiciones[3].id } }),
    prisma.ubicacion.create({ data: { calle: 'Av. Boedo',         altura: '800',  nombre: 'Boedo',    posicionId: posiciones[4].id } }),
    prisma.ubicacion.create({ data: { calle: 'Av. Independencia', altura: '600',  nombre: 'San Telmo',posicionId: posiciones[5].id } }),
  ]);

  // =============================================
  // 5. COMPRADORES, EMPRESAS Y REPARTIDOR
  // =============================================
  await prisma.comprador.createMany({
    skipDuplicates: true,
    data: [
      { nombre: 'Juan',  apellido: 'Perez', cuitCuil: '20-12345678-9', dni: '12345678', telefono: '1134567890', ubicacionId: ubicaciones[4].id, usuarioId: uComprador1!.id },
      { nombre: 'Maria', apellido: 'Gomez', cuitCuil: '27-87654321-0', dni: '87654321', telefono: '1198765432', ubicacionId: ubicaciones[5].id, usuarioId: uComprador2!.id },
    ],
  });

  await prisma.empresa.createMany({
    skipDuplicates: true,
    data: [
      { nombre: 'Pizzeria La Estrella', cuitCuil: '30-11111111-1', usuarioId: uEmpresa1!.id },
      { nombre: 'El Sabor Burgers',     cuitCuil: '30-22222222-2', usuarioId: uEmpresa2!.id },
    ],
  });

  await prisma.repartidor.createMany({
    skipDuplicates: true,
    data: [
      { nombre: 'Luis', apellido: 'Martinez', cuitCuil: '20-33333333-3', dni: '33333333', telefono: '1155556666', usuarioId: uRepartidor!.id },
    ],
  });

  const [empresa1, empresa2, comprador1, repartidor1] = await Promise.all([
    prisma.empresa.findFirst({ where: { nombre: 'Pizzeria La Estrella' } }),
    prisma.empresa.findFirst({ where: { nombre: 'El Sabor Burgers' } }),
    prisma.comprador.findFirst({ where: { nombre: 'Juan' } }),
    prisma.repartidor.findFirst({ where: { nombre: 'Luis' } }),
  ]);

  // =============================================
  // 6. SUCURSALES
  // =============================================
  const [suc1, suc2] = await Promise.all([
    prisma.sucursal.create({
      data: {
        nombre: 'La Estrella - Centro',
        descripcion: 'Pizzería artesanal en el corazón de la ciudad',
        empresaId: empresa1!.id,
        ubicacionId: ubicaciones[0].id,
        estadoId: estadoAbierto!.id,
      },
    }),
    prisma.sucursal.create({
      data: {
        nombre: 'El Sabor - Caballito',
        descripcion: 'Las mejores hamburguesas artesanales de Caballito',
        empresaId: empresa2!.id,
        ubicacionId: ubicaciones[2].id,
        estadoId: estadoAbierto!.id,
      },
    }),
  ]);

  // =============================================
  // 7. PRODUCTOS
  // =============================================
  await prisma.producto.createMany({
    data: [
      // --- La Estrella - Centro: Pizzas, Empanadas, Postres, Bebidas ---
      { nombre: 'Pizza Mozzarella',       precio: 1800, descripcion: 'Salsa de tomate, mozzarella y albahaca fresca',             sucursalId: suc1.id, estadoId: estadoPublicado!.id, categoriaId: catPizzas!.id,       tiempoPreparacionEstimado: 20 },
      { nombre: 'Pizza Pepperoni',        precio: 2100, descripcion: 'Salsa de tomate, mozzarella y pepperoni importado',          sucursalId: suc1.id, estadoId: estadoPublicado!.id, categoriaId: catPizzas!.id,       tiempoPreparacionEstimado: 22 },
      { nombre: 'Pizza Napolitana',       precio: 2000, descripcion: 'Salsa de tomate, mozzarella, rodajas de tomate y orégano',   sucursalId: suc1.id, estadoId: estadoPublicado!.id, categoriaId: catPizzas!.id,       tiempoPreparacionEstimado: 20 },
      { nombre: 'Empanada de Carne',      precio: 400,  descripcion: 'Relleno de carne picada, cebolla y especias',                sucursalId: suc1.id, estadoId: estadoPublicado!.id, categoriaId: catEmpanadas!.id,    tiempoPreparacionEstimado: 15 },
      { nombre: 'Empanada Jamón y Queso', precio: 380,  descripcion: 'Relleno de jamón cocido y queso cremoso',                   sucursalId: suc1.id, estadoId: estadoPublicado!.id, categoriaId: catEmpanadas!.id,    tiempoPreparacionEstimado: 15 },
      { nombre: 'Empanada de Verdura',    precio: 360,  descripcion: 'Espinaca, ricota y huevo duro',                             sucursalId: suc1.id, estadoId: estadoPublicado!.id, categoriaId: catEmpanadas!.id,    tiempoPreparacionEstimado: 15 },
      { nombre: 'Tiramisú',               precio: 950,  descripcion: 'Postre italiano con café y mascarpone',                     sucursalId: suc1.id, estadoId: estadoPublicado!.id, categoriaId: catPostres!.id,      tiempoPreparacionEstimado: 5  },
      { nombre: 'Brownie con helado',     precio: 850,  descripcion: 'Brownie tibio con una bola de helado de vainilla',          sucursalId: suc1.id, estadoId: estadoPublicado!.id, categoriaId: catPostres!.id,      tiempoPreparacionEstimado: 5  },
      { nombre: 'Agua Mineral 500ml',     precio: 350,  descripcion: 'Agua mineral sin gas',                                      sucursalId: suc1.id, estadoId: estadoPublicado!.id, categoriaId: catBebidas!.id,      tiempoPreparacionEstimado: 2  },
      { nombre: 'Gaseosa 500ml',          precio: 400,  descripcion: 'Lata de gaseosa a elección',                                sucursalId: suc1.id, estadoId: estadoPublicado!.id, categoriaId: catBebidas!.id,      tiempoPreparacionEstimado: 2  },

      // --- La Estrella - Centro (continuación): Pizzas extra, Pastas ---
      { nombre: 'Pizza 4 Quesos',         precio: 2300, descripcion: 'Mozzarella, provolone, roquefort y parmesano',              sucursalId: suc1.id, estadoId: estadoPublicado!.id, categoriaId: catPizzas!.id,       tiempoPreparacionEstimado: 25 },
      { nombre: 'Pizza Fugazzeta',         precio: 1900, descripcion: 'Cebolla caramelizada y mozzarella generosa',               sucursalId: suc1.id, estadoId: estadoPublicado!.id, categoriaId: catPizzas!.id,       tiempoPreparacionEstimado: 22 },
      { nombre: 'Pizza Calabresa',         precio: 2050, descripcion: 'Longaniza calabresa, aceitunas negras y cebolla',          sucursalId: suc1.id, estadoId: estadoPublicado!.id, categoriaId: catPizzas!.id,       tiempoPreparacionEstimado: 22 },
      { nombre: 'Tallarines al pesto',     precio: 1600, descripcion: 'Pasta fresca con salsa pesto de albahaca y parmesano',     sucursalId: suc1.id, estadoId: estadoPublicado!.id, categoriaId: catPastas!.id,       tiempoPreparacionEstimado: 18 },
      { nombre: 'Ñoquis de papa',          precio: 1500, descripcion: 'Ñoquis caseros con salsa pomodoro',                        sucursalId: suc1.id, estadoId: estadoPublicado!.id, categoriaId: catPastas!.id,       tiempoPreparacionEstimado: 20 },
      { nombre: 'Fetuccini a la crema',    precio: 1750, descripcion: 'Pasta ancha con crema, champignones y jamón',              sucursalId: suc1.id, estadoId: estadoPublicado!.id, categoriaId: catPastas!.id,       tiempoPreparacionEstimado: 20 },
      { nombre: 'Jugo de naranja natural', precio: 450,  descripcion: 'Naranja exprimida al momento',                            sucursalId: suc1.id, estadoId: estadoPublicado!.id, categoriaId: catBebidas!.id,      tiempoPreparacionEstimado: 5  },
      { nombre: 'Agua con gas 500ml',      precio: 360,  descripcion: 'Agua mineral con gas',                                    sucursalId: suc1.id, estadoId: estadoPublicado!.id, categoriaId: catBebidas!.id,      tiempoPreparacionEstimado: 2  },

      // --- El Sabor - Caballito: Hamburguesas, Lomitos, Bebidas ---
      { nombre: 'Hamburguesa Clásica',    precio: 1500, descripcion: 'Medallón 150g, lechuga, tomate y cebolla',                 sucursalId: suc2.id, estadoId: estadoPublicado!.id, categoriaId: catHamburguesas!.id, tiempoPreparacionEstimado: 15 },
      { nombre: 'Hamburguesa Doble',      precio: 2200, descripcion: 'Doble medallón 300g con cheddar fundido',                  sucursalId: suc2.id, estadoId: estadoPublicado!.id, categoriaId: catHamburguesas!.id, tiempoPreparacionEstimado: 18 },
      { nombre: 'Hamburguesa BBQ',        precio: 1900, descripcion: 'Medallón con salsa BBQ, bacon y aros de cebolla',          sucursalId: suc2.id, estadoId: estadoPublicado!.id, categoriaId: catHamburguesas!.id, tiempoPreparacionEstimado: 18 },
      { nombre: 'Lomito Simple',          precio: 1700, descripcion: 'Lomo de cerdo, lechuga, tomate y mayonesa',                sucursalId: suc2.id, estadoId: estadoPublicado!.id, categoriaId: catLomitos!.id,      tiempoPreparacionEstimado: 15 },
      { nombre: 'Lomito Completo',        precio: 2000, descripcion: 'Lomo de cerdo con jamón, queso y huevo frito',             sucursalId: suc2.id, estadoId: estadoPublicado!.id, categoriaId: catLomitos!.id,      tiempoPreparacionEstimado: 18 },
      { nombre: 'Lomito Especial',        precio: 2300, descripcion: 'Lomo de cerdo, panceta, queso brie y mermelada de cebolla', sucursalId: suc2.id, estadoId: estadoPublicado!.id, categoriaId: catLomitos!.id,     tiempoPreparacionEstimado: 20 },
      { nombre: 'Coca-Cola 500ml',        precio: 400,  descripcion: 'Coca-Cola clásica en botella',                             sucursalId: suc2.id, estadoId: estadoPublicado!.id, categoriaId: catBebidas!.id,      tiempoPreparacionEstimado: 2  },
      { nombre: 'Hamburguesa Crispy',     precio: 1800, descripcion: 'Pollo crocante con mayonesa de ajo y pickles',             sucursalId: suc2.id, estadoId: estadoPublicado!.id, categoriaId: catHamburguesas!.id, tiempoPreparacionEstimado: 20 },
      { nombre: 'Hamburguesa Veggie',     precio: 1700, descripcion: 'Medallón de garbanzos y espinaca, 100% vegetal',           sucursalId: suc2.id, estadoId: estadoPublicado!.id, categoriaId: catHamburguesas!.id, tiempoPreparacionEstimado: 18 },
      { nombre: 'Hamburguesa Pulled Pork',precio: 2100, descripcion: 'Cerdo desmenuzado al horno con coleslaw y salsa ranch',    sucursalId: suc2.id, estadoId: estadoPublicado!.id, categoriaId: catHamburguesas!.id, tiempoPreparacionEstimado: 20 },
      { nombre: 'Ensalada César',         precio: 1200, descripcion: 'Lechuga romana, pollo grillado, parmesano y crutones',     sucursalId: suc2.id, estadoId: estadoPublicado!.id, categoriaId: catEnsaladas!.id,    tiempoPreparacionEstimado: 10 },
      { nombre: 'Ensalada Griega',        precio: 1100, descripcion: 'Tomate, pepino, aceitunas negras y queso feta',            sucursalId: suc2.id, estadoId: estadoPublicado!.id, categoriaId: catEnsaladas!.id,    tiempoPreparacionEstimado: 8  },
      { nombre: 'Limonada natural',       precio: 420,  descripcion: 'Limón exprimido, agua gasificada y menta fresca',          sucursalId: suc2.id, estadoId: estadoPublicado!.id, categoriaId: catBebidas!.id,      tiempoPreparacionEstimado: 5  },
    ],
  });

  // =============================================
  // 8. RUTA, PAGO Y PEDIDO DE EJEMPLO
  // =============================================
  const ruta1 = await prisma.ruta.create({
    data: {
      origenId: ubicaciones[0].id,
      destinoId: ubicaciones[4].id,
      tarifaDistancia: 65.50,
      ubicacionId: ubicaciones[0].id,
    },
  });

  const pago1 = await prisma.pago.create({
    data: { numero: 'PAGO-1001', monto: 5700, estadoId: estadoPagoPendiente!.id },
  });

  const prod1 = await prisma.producto.findFirst({ where: { nombre: 'Pizza Mozzarella' } });
  const prod2 = await prisma.producto.findFirst({ where: { nombre: 'Empanada de Carne' } });
  const prod3 = await prisma.producto.findFirst({ where: { nombre: 'Gaseosa 500ml' } });

  const pedido1 = await prisma.pedido.create({
    data: {
      numero: 'PED-00001',
      horaLlegadaEstimada: new Date(Date.now() + 1000 * 60 * 45),
      montoTotal: 5700,
      tiempoPreparacionEstimado: 35,
      tiempoRepartoEstimado: 25,
      compradorId: comprador1!.id,
      repartidorId: repartidor1!.id,
      empresaId: empresa1!.id,
      rutaId: ruta1.id,
      pagoId: pago1.id,
      estadoId: estadoPedidoCreado!.id,
    },
  });

  await prisma.detalleDePedido.createMany({
    data: [
      { cantidad: 2, montoSubtotal: 3600, pedidoId: pedido1.id, productoId: prod1!.id },
      { cantidad: 3, montoSubtotal: 1200, pedidoId: pedido1.id, productoId: prod2!.id },
      { cantidad: 2, montoSubtotal:  800, pedidoId: pedido1.id, productoId: prod3!.id },
    ],
  });

  console.log('✅ Seed ejecutado con éxito!');
  console.log('');
  console.log('   Usuarios de prueba (contraseña: test1234)');
  console.log('   ─────────────────────────────────────────');
  console.log('   comprador1@test.com   (comprador)');
  console.log('   comprador2@test.com   (comprador)');
  console.log('   empresa1@test.com     (Pizzeria La Estrella)');
  console.log('   empresa2@test.com     (El Sabor Burgers)');
  console.log('   repartidor1@test.com  (repartidor)');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
