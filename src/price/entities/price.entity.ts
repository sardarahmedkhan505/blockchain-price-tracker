// src/price/entities/price.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity()
@Index(['chain', 'timestamp'])
export class Price {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  chain: string;

  @Column('decimal', { precision: 18, scale: 8, nullable: false })
  price: number;

  @CreateDateColumn()
  timestamp: Date;
}