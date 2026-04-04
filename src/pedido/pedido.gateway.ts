import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PedidoService } from './pedido.service';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:4200', // ← tu Angular
    credentials: true,
  },
  namespace: 'pedidos', // opcional pero recomendado
})
export class PedidoGateway implements OnGatewayConnection, OnGatewayDisconnect {
@WebSocketServer() server!: Server;

constructor(private readonly pedidoService: PedidoService) {}

  // Cuando el cliente (empresa) se conecta
handleConnection(client: Socket) {
console.log(`Cliente conectado: ${client.id}`);
    // Aquí puedes agregar autenticación JWT más adelante
  }

  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
  }

  // La empresa se une a su sala privada
  @SubscribeMessage('joinCompanyRoom')
  async handleJoinCompanyRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() companyId: string | number,   // Angular te enviará el id
  ) {
    try {
      const sucursalId = Number(companyId);

      if (isNaN(sucursalId)) {
        client.emit('error', { message: 'ID de sucursal inválido' });
        return;
      }

      // 1. Unir al cliente a la sala privada
      const room = `company-${sucursalId}`;
      client.join(room);

      console.log(`Cliente ${client.id} se unió a la sala: ${room}`);

      // 2. Obtener los pedidos de esa sucursal
      const pedidos = await this.pedidoService.findBySucursal(sucursalId);

      // 3. Enviar SOLO a este cliente (no a toda la sala)
      client.emit('pedidosList', pedidos);

    } catch (error) {
      console.error('Error al obtener pedidos en WebSocket:', error);
      client.emit('error', { 
        message: 'Error al cargar los pedidos',
        details: error instanceof Error ? error.message : String(error),
      });
    }
  }

}