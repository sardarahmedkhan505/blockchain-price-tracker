import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const config = new DocumentBuilder()
    .setTitle('Blockchain Price Tracker')
    .setDescription('API for tracking cryptocurrency prices and alerts')
    .setVersion('1.0')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();

// GET /price/hourly - Get hourly prices for the last 24 hours
// POST /alert - Set price alert
// GET /swap/rate - Get ETH to BTC swap rate