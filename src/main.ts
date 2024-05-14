import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import mongo from './dataBase/mongo';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  mongo.once('open', () => {
    console.log('Conexión exitosa a MongoDB');
  });
  
  mongo.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
  await app.listen(3000);
}
bootstrap();
