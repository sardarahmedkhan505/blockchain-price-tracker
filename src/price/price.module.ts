// src/price/price.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceService } from './price.service';
import { PriceController } from './price.controller';
import { Price } from './entities/price.entity';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Price]),
    EmailModule
  ],
  controllers: [PriceController],
  providers: [PriceService],
  exports: [PriceService]
})
export class PriceModule {}