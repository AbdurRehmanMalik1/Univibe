import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
<<<<<<< HEAD
  await app.listen(3000);
  console.log('Application is running on: http://localhost:3000');
=======

  //middle ware to allow request from port 5000 which is our flutter application
  app.enableCors({
    origin: 'http://localhost:5000', // Replace with your frontend URL if different
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
  });

  await app.listen(process.env.PORT ?? 3000);
>>>>>>> d8a48692864b4ea0d4632ce8bb44c206644fa312
}
bootstrap();
