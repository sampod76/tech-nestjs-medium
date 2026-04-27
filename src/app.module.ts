import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// import { jwtConstants } from './auth/constants';
import { AppConfig, appConfig } from './config/app.config';

import { PrismaModule } from './database/prisma.module';

import { AuditLogModule } from './modules/audit-log/audit-log.module';

import { FilesModule } from './modules/files/files.module';

@Module({
  imports: [
    ConfigModule.forRoot<AppConfig>({
      isGlobal: true,
      envFilePath: '.env',
      load: [appConfig],
      cache: true, // প্রথমবার resolve করে config memory-তে cache রাখে (fast + immutable)
      expandVariables: false, // ENV variable interpolation বন্ধ রাখে (explicit + secure) example: ${PORT}
    }),

    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '356d' },
    }),

    MongooseModule.forRoot(
      process.env.MONGODB_URL ?? 'mongodb://localhost:27017/test',
    ),

    PrismaModule,

    AuditLogModule,
    FilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
