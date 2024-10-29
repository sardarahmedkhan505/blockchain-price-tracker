// src/modules/price-tracker/price-tracker.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PriceTrackerService {
  async getEthPrice(): Promise<number> {
    const response = await axios.get(`https://api.moralis.io/eth/price`);
    return response.data.usdPrice;
  }

  async getPolygonPrice(): Promise<number> {
    const response = await axios.get(`https://api.moralis.io/polygon/price`);
    return response.data.usdPrice;
  }
}
