// src/price/price.service.ts
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import Moralis from 'moralis';
import { Price } from './entities/price.entity';
import { EmailService } from '../email/email.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PriceService {
  private readonly logger = new Logger(PriceService.name);

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
    const chains = [
      { name: 'ethereum', chainId: '0x1', address: process.env.ETH_ADDRESS },
      { name: 'polygon', chainId: '0x89', address: process.env.MATIC_ADDRESS }
    ];
    
    for (const chain of chains) {
      try {
        const response = await Moralis.EvmApi.token.getTokenPrice({
          address: chain.address,
          chain: chain.chainId,
        });

        const price = new Price();
        price.chain = chain.name;
        price.price = response.result.usdPrice;
        await this.priceRepository.save(price);

        this.logger.log(`Saved ${chain.name} price: $${price.price}`);

        // Check price increase over the last hour
        const oneHourAgo = new Date();
        oneHourAgo.setHours(oneHourAgo.getHours() - 1);

        const oldPrice = await this.priceRepository.findOne({
          where: {
            chain: chain.name,
            timestamp: MoreThanOrEqual(oneHourAgo)
          },
          order: {
            timestamp: 'ASC'
          }
        });

        if (oldPrice) {
          const priceIncrease = ((price.price - oldPrice.price) / oldPrice.price) * 100;
          
          if (priceIncrease > 3) {
            await this.emailService.sendPriceAlert(
              'hyperhire_assignment@hyperhire.in',
              chain.name,
              priceIncrease,
              price.price
            );
            this.logger.log(`Sent alert email for ${chain.name} - Price increase: ${priceIncrease.toFixed(2)}%`);
          }
        }
      } catch (error) {
        this.logger.error(`Error tracking ${chain.name} price: ${error.message}`);
      }
    }
  }

  async getHourlyPrices() {
    try {
      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

      // Get prices grouped by hour for the last 24 hours
      const hourlyPrices = await this.priceRepository
        .createQueryBuilder('price')
        .select('chain')
        .addSelect('DATE_TRUNC(\'hour\', timestamp) as hour')
        .addSelect('AVG(price)', 'price')
        .where('timestamp >= :twentyFourHoursAgo', { twentyFourHoursAgo })
        .groupBy('chain')
        .addGroupBy('DATE_TRUNC(\'hour\', timestamp)')
        .orderBy('hour', 'DESC')
        .getRawMany();

      return hourlyPrices.map(price => ({
        chain: price.chain,
        hour: price.hour,
        price: parseFloat(price.price)
      }));
    } catch (error) {
      this.logger.error(`Error getting hourly prices: ${error.message}`);
      throw error;
    }
  }
}

