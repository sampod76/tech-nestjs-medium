import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'src/generated/prisma/client';
import { softDeleteExtension } from './extensions/soft-delete.extension';

export type ExtendedPrismaClient = PrismaClient &
  ReturnType<PrismaClient['$extends']>;

export class PrismaClientSingleton {
  private static instance: ExtendedPrismaClient | null = null;

  static getInstance(connectionString: string): ExtendedPrismaClient {
    if (!this.instance) {
      const adapter = new PrismaPg({ connectionString });

      const prisma = new PrismaClient({
        adapter,
        log: [{ emit: 'event', level: 'error' }],
      });

      this.instance = prisma.$extends(
        softDeleteExtension,
      ) as ExtendedPrismaClient;
    }

    return this.instance;
  }
}
