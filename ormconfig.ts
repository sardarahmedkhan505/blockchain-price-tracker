import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Alert } from './src/alert/entities/alert.entity';
import { Price } from './src/price/entities/price.entity';
import { join } from 'path';

config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'blockchain_tracker',
  entities: [Alert, Price],
  migrations: [join(__dirname, 'src', 'migrations', '*.{ts,js}')],
  synchronize: false,
  logging: true,
});

export default AppDataSource;