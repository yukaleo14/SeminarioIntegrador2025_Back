import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';
@WebSocketGateway({
  cors: {
    origin: 'http://localhost:4200',
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly chatService: ChatService,
  ) { }

  async handleDisconnect(client: Socket) {
    await this.chatService.handleDisconnect(client, this.server);
  }

  handleConnection(client: Socket) {
    this.chatService.handleConnection(client);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() { pedidoId }: { pedidoId: number },
    @ConnectedSocket() client: Socket,
  ) {
    this.chatService.handleJoinRoom({ pedidoId }, client, this.server);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { pedidoId: number; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.chatService.handleMessage(data, client, this.server);
  }
}
