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
import { PedidoService } from '../pedido/pedido.service';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:4200'], // ← tu Angular
    credentials: true,
  },
  namespace: '/pedidos', // opcional pero recomendado
})
export class PedidoGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server!: Server;

  constructor(private readonly pedidoService: PedidoService) {}

  // Cuando el cliente (empresa) se conecta
  handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);
    // Aquí puedes agregar autenticación JWT más adelante
  }

  @SubscribeMessage('joinPedidoRoom')
  handleJoinPedidoRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { pedidoId: string | number },
  ) {
    const room = `pedido-${data.pedidoId}`;
    client.join(room);
    console.log(
      `Cliente ${client.id} se unió al seguimiento del pedido: ${room}`,
    );
  }

  @SubscribeMessage('actualizarGps')
  handleActualizarGps(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: { pedidoId: string | number; lat: number; lng: number },
  ) {
    const room = `pedido-${data.pedidoId}`;
    this.server
      .to(room)
      .emit('posicionActualizada', { lat: data.lat, lng: data.lng });
    console.log(`Actualización GPS para ${room}: (${data.lat}, ${data.lng})`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
  }

  // La empresa se une a su sala privada
  @SubscribeMessage('joinCompanyRoom')
  async handleJoinCompanyRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() sucursalId: string | number, // Angular te enviará el id
  ) {
    try {
      const id = Number(sucursalId);

      if (isNaN(id)) {
        client.emit('error', { message: 'ID de sucursal inválido' });
        return;
      }

      // 1. Unir al cliente a la sala privada
      const room = `company-${id}`;
      client.join(room);

      console.log(`Cliente ${client.id} se unió a la sala: ${room}`);

      // 2. Obtener los pedidos de esa sucursal
      const pedidos = await this.pedidoService.findBySucursal(id);

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
  // Método público para que el PedidoService pueda notificar a todos en la sala
  notifyNewPedido(sucursalId: number, pedido: any) {
    const room = `company-${sucursalId}`;
    this.server.to(room).emit('nuevoPedido', pedido); // nombre consistente
  }

  notifyPedidoActualizado(sucursalId: number, pedido: any) {
    const room = `company-${sucursalId}`;
    this.server.to(room).emit('pedidoActualizado', pedido);
  }
}
