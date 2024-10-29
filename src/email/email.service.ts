// src/email/email.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendPriceAlert(email: string, chain: string, increase: number, currentPrice: number) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: `Price Alert: ${chain} increased by ${increase.toFixed(2)}%`,
      text: `The price of ${chain} has increased by ${increase.toFixed(2)}% in the last hour. Current price: $${currentPrice.toFixed(2)}`,
    });
  }

  async sendTargetPriceAlert(email: string, chain: string, targetPrice: number, currentPrice: number) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: `Target Price Alert: ${chain} reached ${targetPrice}`,
      text: `${chain} has reached your target price of $${targetPrice}. Current price: $${currentPrice.toFixed(2)}`,
    });
  }
}