import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'src/generated/prisma/client';

export class PrismaClientSingleton {
  private static instance: PrismaClient;

  static getInstance(connectionString: string): PrismaClient {
    if (!PrismaClientSingleton.instance) {
      const adapter = new PrismaPg({ connectionString });

      PrismaClientSingleton.instance = new PrismaClient({
        adapter,
        log: [{ emit: 'event', level: 'error' }],
      });
    }

    return PrismaClientSingleton.instance;
  }
}
