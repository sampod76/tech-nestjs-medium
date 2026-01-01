import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  PrismaClientSingleton,
  ExtendedPrismaClient,
} from './prisma-client.singleton';
import { AppConfig } from 'src/config/app.config';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly prisma: ExtendedPrismaClient;

  constructor(private readonly configService: ConfigService<AppConfig>) {
    const envApp = this.configService.getOrThrow('app', { infer: true });

    this.prisma = PrismaClientSingleton.getInstance(
      envApp.database.postgresUrl,
    );
  }

  async onModuleInit() {
    await this.prisma.$connect();
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }

  get client(): ExtendedPrismaClient {
    return this.prisma;
  }
}
