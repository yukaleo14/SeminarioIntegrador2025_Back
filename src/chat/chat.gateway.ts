import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WsException,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { PedidoService } from '../pedido/pedido.service';

interface Mensaje {
  cliente: string;
  data: string;
}

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
    private readonly pedidoSvc: PedidoService,
  ) {}
  handleDisconnect(client: Socket) {
    console.log('Cliente desconectado', client.id);
  }
  handleConnection(client: Socket) {
    console.log('Cliente conectado: ', client.id);
    const token = client.handshake.auth.token;

    if (!token) {
      client.disconnect();
      return;
    }

    try {
      const payload = this.jwtService.verify(token);

      client.data.user = payload; // 🔥 GUARDÁS EL USUARIO
    } catch (e) {
      client.disconnect();
      console.error(e);
    }
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() { pedidoId }: { pedidoId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const user = client.data.user;

    // validar acceso
    const pedido = await this.pedidoSvc.findOne(pedidoId);

    if (
      pedido.comprador.id !== user.userId &&
      pedido.repartidor.id !== user.userId
    ) {
      throw new WsException('No autorizado');
    }

    client.join(`pedido-${pedidoId}`);
  }

  @SubscribeMessage('sendMessage')
  handleMessage(
    @MessageBody() data: { pedidoId: number; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    const user = client.data.user;

    this.server.to(`pedido-${data.pedidoId}`).emit('newMessage', {
      message: data.message,
      sender: user.userId,
    });
  }

  @SubscribeMessage('events')
  postMensaje(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    const msj: Mensaje = {
      cliente: client.id,
      data,
    };
    // this.server.emit('msj', msj);
    client.broadcast.emit('msj', msj);
  }
}
