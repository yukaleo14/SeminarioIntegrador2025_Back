import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { PedidoService } from '../pedido/pedido.service';
import { IRegister } from '../strategy/interfaces/IRegister.interface';
import { StrategyFactory } from '../strategy/strategy.factory';
import { PrismaService } from '../prisma/prisma.service';

interface user {
  id: number;
  mail: string;
  rol: 'COMPRADOR' | 'REPARTIDOR' | 'EMPRESA';
  iat: number;
  exp: number;
}

@Injectable()
export class ChatService {
  estrategia!: IRegister;

  constructor(
    private readonly jwtService: JwtService,
    private readonly pedidoSvc: PedidoService,
    private readonly prisma: PrismaService,
    private strFactory: StrategyFactory,
  ) {}

  async handleDisconnect(client: Socket, server: Server) {
    const rooms = client.rooms;

    for (const room of rooms) {
      if (room.startsWith('pedido-')) {
        const sockets = await server.in(room).fetchSockets();
        const users = sockets.map((s) => s.data.user);
        server.to(room).emit('usersInRoom', users);
      }
    }
  }

  handleConnection(client: Socket) {
    const token: string =
      client.handshake.auth?.token || client.handshake.query?.token;

    if (!token) {
      client.disconnect();
      return;
    }

    try {
      const payload: user = this.jwtService.verify(token);
      client.data.user = payload;
    } catch (e) {
      client.disconnect();
      client.emit('error', { message: 'Invalid or expired token' });
      console.log('Error: ', e);
    }
  }

  async handleJoinRoom(
    { pedidoId }: { pedidoId: number },
    client: Socket,
    server: Server,
  ) {
    const user: user = client.data.user;
    if (user.rol === 'EMPRESA') {
      client.emit('error', {
        message: 'Las empresas no pueden unirse a salas de chat',
      });
      return;
    }

    const pedido = await this.pedidoSvc.findOne(pedidoId);
    if (!pedido) {
      client.emit('error', { message: 'Pedido no encontrado' });
      return;
    }

    this.estrategia = this.strFactory.getStrategy(user.rol.toString());
    const idPersona: any = await this.estrategia.getPersonByUserId(user.id);
    const hasAccess = await this.pedidoSvc.findUserPedidoByUserId(
      idPersona,
      user.rol,
    );
    if (!hasAccess) {
      client.emit('error', { message: 'No tienes acceso a este pedido' });
      return;
    }

    const roomName = `pedido-${pedidoId}`;
    await client.join(roomName);

    // Enviar historial de mensajes al cliente que se acaba de unir
    const historial = await this.prisma.mensajeChat.findMany({
      where: { pedidoId },
      orderBy: { timestamp: 'asc' },
      include: {
        remitente: { select: { id: true, mail: true, rol: true } },
      },
    });
    client.emit('chatHistorial', historial);

    const sockets = await server.in(roomName).fetchSockets();
    const users = sockets.map((s) => s.data.user);
    server.to(roomName).emit('usersInRoom', users);
  }

  async handleMessage(
    data: { pedidoId: number; message: string },
    client: Socket,
    server: Server,
  ) {
    const user: user = client.data.user;
    this.estrategia = this.strFactory.getStrategy(user.rol.toString());
    const persona: any = await this.estrategia.buscarNombre(user.id);

    // Persistir el mensaje en la base de datos
    const mensajeGuardado = await this.prisma.mensajeChat.create({
      data: {
        contenido: data.message,
        pedidoId: data.pedidoId,
        remitenteId: user.id,
      },
    });

    const roomName = `pedido-${data.pedidoId}`;
    server.to(roomName).emit('newMessage', {
      id: mensajeGuardado.id,
      message: data.message,
      sender: {
        id: user.id,
        nombre: persona.nombre,
      },
      timestamp: mensajeGuardado.timestamp,
    });
  }
}
