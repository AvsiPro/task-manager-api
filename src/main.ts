import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Aqui é onde você resolve o problema de CORS:
  app.enableCors({
    origin: 'http://localhost:5173', // libera só seu frontend
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
