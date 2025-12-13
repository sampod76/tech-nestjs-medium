import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true, //extra field remove
  //     forbidNonWhitelisted: true, //extra field এলে error
  //     transform: true, //Request data DTO type-এ convert করে example: string to number
  //     skipUndefinedProperties: true,
  //     skipNullProperties: true,
  //   }),
  // );
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.setGlobalPrefix('api/v1');
  await app.listen(process.env.PORT ?? 5050);
}

void bootstrap();
