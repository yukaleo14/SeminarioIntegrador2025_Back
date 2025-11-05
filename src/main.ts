import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); // Agregar globalmente el class Validator

  app.enableCors({
    origin: [
      'http://localhost:4200',
      'http://localhost:3000',
      'https://localhost:4200',
      'https://localhost:3000',
    ], // dominios permitidos
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // permite cookies o cabeceras de autenticación
  });

  const config = new DocumentBuilder()
    .setTitle('Seminario Integrador 2025')
    .setDescription('Trabajo integrador Fuber Delivery')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
      name: 'Authorization',
      description: 'Ingrese el token JWT',
    })
    .addSecurityRequirements('bearer')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('openapi', app, document);

  const jwtAuthGuard = app.get(JwtAuthGuard);
  app.useGlobalGuards(jwtAuthGuard);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
