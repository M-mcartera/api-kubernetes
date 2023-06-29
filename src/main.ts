import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  console.log(process.env.SENGRID_SECURE_KEY);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
