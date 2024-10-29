// src/swap/swap.service.ts
import { Injectable } from '@nestjs/common';
import Moralis from 'moralis';

@Injectable()
export class SwapService {
  async getSwapRate(ethAmount: number) {
    try {
      // Get ETH price
      const ethPrice = await Moralis.EvmApi.token.getTokenPrice({
        address: process.env.ETH_ADDRESS,
        chain: "0x1", // Ethereum mainnet
      });

      // Get BTC price
      const btcPrice = await Moralis.EvmApi.token.getTokenPrice({
        address: process.env.BTC_ADDRESS,
        chain: "0x1", // Ethereum mainnet
      });

      const ethValue = ethAmount * ethPrice.result.usdPrice;
      const btcAmount = ethValue / btcPrice.result.usdPrice;
      
      const feePercentage = 0.03;
      const feeInEth = ethAmount * feePercentage;
      const feeInUsd = feeInEth * ethPrice.result.usdPrice;

      return {
        ethAmount,
        btcAmount: parseFloat(btcAmount.toFixed(8)),
        fees: {
          eth: parseFloat(feeInEth.toFixed(8)),
          usd: parseFloat(feeInUsd.toFixed(2)),
        }
      };
    } catch (error) {
      throw new Error(`Failed to get swap rate: ${error.message}`);
    }
  }
}
// http://localhost:3000/swap/rate?ethAmount=1