import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { requestIdMiddleware } from './common/middlewares/request-id.middleware';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

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
  // 
  app.use(requestIdMiddleware);
  app.setGlobalPrefix('api/v1');
  app.useGlobalFilters(
    new PrismaExceptionFilter(),
    new GlobalExceptionFilter(),
  );
  app.useGlobalInterceptors(new ResponseInterceptor());
  const port = process.env.PORT || 5050;
  app
    .listen(port, '0.0.0.0')
    .then(() =>
      console.log(`🚀 Server running at http://localhost:${port}/api/v1`),
    )
    .catch((error) => {
      console.log('🚀 ~ bootstrap ~ error:', error);
    });
}

void bootstrap();
