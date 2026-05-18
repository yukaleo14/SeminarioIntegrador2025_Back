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
import { JwtService } from '@nestjs/jwt';
import { PedidoService } from '../pedido/pedido.service';

interface PedidoSocketUser {
  id: number;
  mail: string;
  rol: 'COMPRADOR' | 'REPARTIDOR' | 'EMPRESA';
  iat: number;
  exp: number;
}

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:4200'], // ← tu Angular
    credentials: true,
  },
  namespace: '/pedidos', // opcional pero recomendado
})
export class PedidoGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server!: Server;

  constructor(
    private readonly pedidoService: PedidoService,
    private readonly jwtService: JwtService,
  ) {}

  // Cuando el cliente (empresa, comprador o repartidor) se conecta
  handleConnection(client: Socket) {
    const token: string =
      client.handshake.auth?.token || client.handshake.query?.token;

    if (!token) {
      client.emit('error', { message: 'Token requerido' });
      client.disconnect();
      return;
    }

    try {
      const payload: PedidoSocketUser = this.jwtService.verify(token);
      client.data.user = payload;
      console.log(`Cliente conectado: ${client.id} (user ${payload.id})`);
    } catch (e) {
      client.emit('error', { message: 'Token inválido o expirado' });
      client.disconnect();
      console.log('Error verificando token en PedidoGateway:', e);
    }
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
    const companyRoom = `company-${sucursalId}`;
    this.server.to(companyRoom).emit('pedidoActualizado', pedido);

    if (pedido?.id) {
      const pedidoRoom = `pedido-${pedido.id}`;
      this.server.to(pedidoRoom).emit('pedidoActualizado', pedido);
    }
  }
}
