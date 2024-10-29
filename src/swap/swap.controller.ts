// src/swap/swap.controller.ts
import { Controller, Get, Query, ParseFloatPipe, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { SwapService } from './swap.service';

@ApiTags('swap')
@Controller('swap')
export class SwapController {
  constructor(private readonly swapService: SwapService) {}

  @Get('rate')
  @ApiOperation({ summary: 'Get ETH to BTC swap rate' })
  @ApiResponse({
    status: 200,
    description: 'Returns swap rate with fees',
    schema: {
      type: 'object',
      properties: {
        ethAmount: { type: 'number' },
        btcAmount: { type: 'number' },
        fees: {
          type: 'object',
          properties: {
            eth: { type: 'number' },
            usd: { type: 'number' }
          }
        },
        prices: {
          type: 'object',
          properties: {
            eth: { type: 'number' },
            btc: { type: 'number' }
          }
        }
      }
    }
  })
  @ApiQuery({
    name: 'ethAmount',
    type: Number,
    description: 'Amount of ETH to swap',
    required: true
  })
  async getSwapRate(@Query('ethAmount', new ParseFloatPipe({ 
    exceptionFactory: () => new HttpException('Invalid ETH amount', HttpStatus.BAD_REQUEST) 
  })) ethAmount: number) {
    if (ethAmount <= 0) {
      throw new HttpException('ETH amount must be greater than 0', HttpStatus.BAD_REQUEST);
    }
    return this.swapService.getSwapRate(ethAmount);
  }
}