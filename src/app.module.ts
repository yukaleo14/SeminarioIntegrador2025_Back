import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PagoModule } from './pago/pago.module';
import { FormaPagoModule } from './forma-pago/forma-pago.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PagoModule,
    FormaPagoModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
