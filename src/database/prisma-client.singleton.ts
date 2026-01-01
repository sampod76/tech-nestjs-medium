import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from 'src/generated/prisma/client';
import { softDeleteExtension } from './extensions/soft-delete.extension';

export type ExtendedPrismaClient = ReturnType<PrismaClient['$extends']>;

export class PrismaClientSingleton {
  private static instance: ExtendedPrismaClient;

  static getInstance(connectionString: string): ExtendedPrismaClient {
    if (!PrismaClientSingleton.instance) {
      const adapter = new PrismaPg({ connectionString });

      PrismaClientSingleton.instance = new PrismaClient({
        adapter,
        log: [{ emit: 'event', level: 'error' }],
      }).$extends(softDeleteExtension);
    }

    return PrismaClientSingleton.instance;
  }
}
