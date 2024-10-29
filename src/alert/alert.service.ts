// src/alert/alert.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alert } from './entities/alert.entity';
import { CreateAlertDto } from './dto/create-alert.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class AlertService {
  constructor(
    @InjectRepository(Alert)
    private alertRepository: Repository<Alert>,
    private emailService: EmailService,
  ) {}

  async create(createAlertDto: CreateAlertDto) {
    const alert = new Alert();
    alert.chain = createAlertDto.chain;
    alert.targetPrice = createAlertDto.targetPrice;
    alert.email = createAlertDto.email;
    return this.alertRepository.save(alert);
  }

  async checkAlerts(chain: string, currentPrice: number) {
    const alerts = await this.alertRepository.find({
      where: { chain },
    });

    for (const alert of alerts) {
      if (currentPrice >= alert.targetPrice) {
        await this.emailService.sendTargetPriceAlert(
          alert.email,
          alert.chain,
          alert.targetPrice,
          currentPrice
        );
        await this.alertRepository.remove(alert);
      }
    }
  }
}