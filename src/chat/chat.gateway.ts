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
import { IRegister } from '../strategy/interfaces/IRegister.interface';
import { StrategyFactory } from '../strategy/strategy.factory';

interface Mensaje {
  cliente: string;
  data: string;
}

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:4200',
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  public estrategia: IRegister;

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
    private readonly pedidoSvc: PedidoService,
    private strFactory: StrategyFactory,
  ) {}
  handleDisconnect(client: Socket) {
    console.log('Cliente desconectado', client.id);
  }
  handleConnection(client: Socket) {
    console.log('Cliente conectado', client.id);
    // const token = client.handshake.auth.token;
    const token = client.handshake.auth?.token || client.handshake.query?.token;

    if (!token) {
      client.disconnect();
      return;
    }

    try {
      const payload = this.jwtService.verify(token);

      client.data.user = payload; // 🔥 GUARDÁS EL USUARIO
    } catch (e) {
      client.disconnect();
    }
    console.log('cliente: ', client.data.user);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() { pedidoId }: { pedidoId: number },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('Entro a la sala', pedidoId);
    const user = client.data.user;
    // validar acceso
    const pedido = await this.pedidoSvc.findOne(pedidoId);

    await client.join(`pedido-${pedidoId}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { pedidoId: number; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    const user: any = client.data.user;
    this.estrategia = this.strFactory.getStrategy(user.rol!.toString());
    const persona = await this.estrategia.buscarNombre(user.id);

    this.server.to(`pedido-${data.pedidoId}`).emit('newMessage', {
      message: data.message,
      sender: {
        id: user.id,
        nombre: persona.nombre,
      },
      timestamp: new Date(),
    });
  }
}
