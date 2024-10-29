// src/alert/dto/create-alert.dto.ts
import { IsString, IsNumber, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAlertDto {
  @ApiProperty({ example: 'ethereum', description: 'The blockchain name' })
  @IsString()
  chain: string;

  @ApiProperty({ example: 2000, description: 'Target price for alert' })
  @IsNumber()
  targetPrice: number;

  @ApiProperty({ example: 'user@example.com', description: 'Email to send alert to' })
  @IsEmail()
  email: string;
}