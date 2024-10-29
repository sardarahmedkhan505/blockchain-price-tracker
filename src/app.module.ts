// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceModule } from './price/price.module';
import { AlertModule } from './alert/alert.module';
import { EmailModule } from './email/email.module';
import { SwapModule } from './swap/swap.module';
import  AppDataSource  from '../ormconfig';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(AppDataSource.options),
    ScheduleModule.forRoot(),
    PriceModule,
    AlertModule,
    EmailModule,
    SwapModule,
  ],
})
export class AppModule {}

// http://localhost:3000/api/price-tracker/current-prices working very fine