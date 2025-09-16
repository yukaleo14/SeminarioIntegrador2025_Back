import { Module } from '@nestjs/common';
import { SucursalService } from './sucursal.service';
import { SucursalController } from './sucursal.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [SucursalController],
  providers: [SucursalService],
  imports: [PrismaModule],
})
export class SucursalModule {}
