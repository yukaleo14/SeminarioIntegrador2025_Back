import { Module } from '@nestjs/common';
import { FormaPagoService } from './forma-pago.service';
import { FormaPagoController } from './forma-pago.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FormaPagoController],
  providers: [FormaPagoService],
})
export class FormaPagoModule {}
