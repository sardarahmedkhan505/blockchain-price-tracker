// src/alert/entities/alert.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Alert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  chain: string;

  @Column('decimal', { precision: 18, scale: 8, nullable: false })
  targetPrice: number;

  @Column({ nullable: false })
  email: string;

  @CreateDateColumn()
  createdAt: Date;
}