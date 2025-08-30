import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); // Agregar globalmente el class Validator

  const config = new DocumentBuilder()
    .setTitle('Seminario Integrador 2025')
    .setDescription('Trabajo integrador Fuber Delivery')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('openapi', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
