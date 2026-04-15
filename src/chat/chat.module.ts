import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { AuthModule } from '../auth/auth.module';
import { PedidoModule } from '../pedido/pedido.module';
import { StrategyModule } from '../strategy/strategy.module';

@Module({
  providers: [ChatGateway, ChatService],
  imports: [AuthModule, PedidoModule, StrategyModule],
})
export class ChatModule {}
