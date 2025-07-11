import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.enableCors({
    origin: config.get<string>('CORS_ORIGIN')?.split(',') || [
      'http://localhost:5173',
    ],
    credentials: true,
  });

  const port = config.get<number>('PORT') || 3000;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
