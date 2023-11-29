import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { LoggerService } from 'src/logger/logger.service';
import { DatabaseConfig, databaseConfig } from '../config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private retries = 0;
  private connected = false;
  private isConnecting = false;

  constructor(
    @Inject(databaseConfig.KEY)
    private readonly databaseConfig: DatabaseConfig,
    private readonly logger: LoggerService,
  ) {
    super();
  }

  async onModuleInit() {
    this.connect();
  }

  async connect() {
    if (this.isConnecting || this.connected) {
      return;
    }
    this.isConnecting = true;
    while (!this.connected) {
      try {
        await this.$connect();
        this.connected = true;
      } catch (err) {
        if (this.retries >= this.databaseConfig.connectionMaxRetries) {
          throw err;
        }
        // Wait for 2 seconds before retrying
        await new Promise((r) => setTimeout(r, 2000));
        this.retries++;
        this.logger.warn(
          `Connection failed. Retrying... Attempt ${this.retries}`,
        );
      }
    }
    this.isConnecting = false;
  }
}
