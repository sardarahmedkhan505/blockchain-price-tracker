// src/price/price.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import Moralis from 'moralis';
import { Price } from './entities/price.entity';
import { EmailService } from '../email/email.service';

@Injectable()
export class PriceService {
  constructor(
    @InjectRepository(Price)
    private priceRepository: Repository<Price>,
    private emailService: EmailService,
  ) {
    Moralis.start({
      apiKey: process.env.MORALIS_API_KEY,
    });
  }

  @Cron('*/5 * * * *') // Every 5 minutes
  async trackPrices() {
    const chains = ['ethereum', 'polygon'];
    
    for (const chain of chains) {
      const response = await Moralis.EvmApi.token.getTokenPrice({
        address: chain === 'ethereum' ? process.env.ETH_ADDRESS : process.env.MATIC_ADDRESS,
        chain: chain,
      });

      const price = new Price();
      price.chain = chain;
      price.price = response.result.usdPrice;
      await this.priceRepository.save(price);

      // Check price increase
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const oldPrice = await this.priceRepository.findOne({
        where: {
          chain: chain,
          timestamp: oneHourAgo,
        },
        order: { timestamp: 'DESC' },
      });

      if (oldPrice) {
        const priceIncrease = ((price.price - oldPrice.price) / oldPrice.price) * 100;
        if (priceIncrease > 3) {
          await this.emailService.sendPriceAlert(
            'hyperhire_assignment@hyperhire.in',
            chain,
            priceIncrease,
            price.price
          );
        }
      }
    }
  }

  async getHourlyPrices() {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return this.priceRepository
      .createQueryBuilder('price')
      .where('price.timestamp >= :twentyFourHoursAgo', { twentyFourHoursAgo })
      .orderBy('price.timestamp', 'DESC')
      .getMany();
  }
}