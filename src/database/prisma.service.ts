import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PrismaClientSingleton } from './prisma-client.singleton';
import { AppConfig } from 'src/config/app.config';
import { PrismaClient } from 'src/generated/prisma/client';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly prisma: PrismaClient;

  constructor(private readonly configService: ConfigService<AppConfig>) {
    const envApp = this.configService.getOrThrow('app', {
      infer: true,
    });

    // Singleton instance
    this.prisma = PrismaClientSingleton.getInstance(
      envApp.database.postgresUrl,
    );
  }

  async onModuleInit() {
    await this.prisma.$connect();
    console.log('connecting successful');
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
    console.log('connecting disconnected');
  }

  get client(): PrismaClient {
    return this.prisma;
  }
}
