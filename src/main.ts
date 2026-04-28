import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    credentials: true,
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  const PORT = process.env.PORT || 3001;
  await app.listen(PORT, () => {
    console.log(`🚀 Server is running on: http://localhost:${PORT}/api`);
  });
}
bootstrap();
