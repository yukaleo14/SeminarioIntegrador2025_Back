import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { PedidoService } from 'src/pedido/pedido.service';
import { IRegister } from 'src/strategy/interfaces/IRegister.interface';
import { StrategyFactory } from 'src/strategy/strategy.factory';

interface user {
    id: number;
    mail: string;
    rol: 'COMPRADOR' | 'REPARTIDOR';
    iat: number;
    exp: number;
}

@Injectable()
export class ChatService {
    estrategia!: IRegister;

    constructor(
        private readonly jwtService: JwtService,
        private readonly pedidoSvc: PedidoService,
        private strFactory: StrategyFactory,
    ) { }

    async handleDisconnect(client: Socket, server: Server) {
        const rooms = client.rooms; // incluye su socketId + rooms

        for (const room of rooms) {
            if (room.startsWith('pedido-')) {
                const sockets = await server.in(room).fetchSockets();
                const users = sockets.map((s) => s.data.user);
                server.to(room).emit('usersInRoom', users);
            }
        }
    }

    handleConnection(client: Socket) {
        console.log('Cliente conectado', client.id);
        // const token = client.handshake.auth.token;
        const token: string = client.handshake.auth?.token || client.handshake.query?.token;

        if (!token) {
            client.disconnect();
            return;
        }

        try {
            const payload: user = this.jwtService.verify(token);
            client.data.user = payload; // 🔥 GUARDÁS EL USUARIO>
        } catch (e) {
            client.disconnect();
            client.emit('error', { message: 'Invalid or expired token' });
            console.log('Error: ', e);
        }
        console.log('cliente: ', client.data.user);
    }

    async handleJoinRoom({ pedidoId }: { pedidoId: number }, client: Socket, server: Server) {
        const user: user = client.data.user;
        const pedido = await this.pedidoSvc.findOne(pedidoId);
        const roomName = `pedido-${pedidoId}`;
        await client.join(roomName);
        const sockets = await server.in(roomName).fetchSockets();
        const users = sockets.map((s) => s.data.user);
        server.to(roomName).emit('usersInRoom', users);
    }

    async handleMessage(data: { pedidoId: number; message: string }, client: Socket, server: Server) {
        const user: user = client.data.user;
        this.estrategia = this.strFactory.getStrategy(user.rol.toString());
        const persona: any = await this.estrategia.buscarNombre(user.id);

        const roomName = `pedido-${data.pedidoId}`;
        server.to(roomName).emit('newMessage', {
            message: data.message,
            sender: {
                id: user.id,
                nombre: persona.nombre,
            },
            timestamp: new Date(),
        });
    }
}