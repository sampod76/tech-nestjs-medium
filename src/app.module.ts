import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

// import { jwtConstants } from './auth/constants';
import { CourseModule } from './modules/course/course.module';
import { AppConfig, appConfig } from './config/app.config';
import { PostModule } from './modules/post/post.module';

import { CategoryModule } from './modules/category/category.module';

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

    AuthModule,
    UserModule,
    CourseModule,
    PostModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
