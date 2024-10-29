// src/price/price.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PriceService } from './price.service';

@ApiTags('prices')
@Controller('price')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Get('hourly')
  @ApiOperation({ summary: 'Get hourly prices for the last 24 hours' })
  @ApiResponse({ status: 200, description: 'Returns hourly prices' })
  getHourlyPrices() {
    return this.priceService.getHourlyPrices();
  }
}
