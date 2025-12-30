import { Injectable } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}
  async getHello() {
    try {
      const res = await this.prisma.client.user.findMany();
      console.log('🚀 ~ AppService ~ getHello ~ res:', res);
      return 'Hello World!';
    } catch (error) {
      console.log(error);
    }
  }
}
