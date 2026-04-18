import { Injectable } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async getHello(): Promise<string> {
    try {
      const res = await this.prisma.client.user.findMany();
      console.log('🚀 ~ AppService ~ getHello ~ res:', res);
    } catch (error) {
      console.log(error);
    }

    return 'Hello World!';
  }
}
