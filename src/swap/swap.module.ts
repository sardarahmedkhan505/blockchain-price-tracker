// src/swap/swap.module.ts
import { Module } from '@nestjs/common';
import { SwapService } from './swap.service';
import { SwapController } from './swap.controller';

@Module({
  controllers: [SwapController],
  providers: [SwapService],
  exports: [SwapService]
})
export class SwapModule {}