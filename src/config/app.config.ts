/* eslint-disable @typescript-eslint/no-unsafe-call */
// src/config/app.config.ts
import { ConfigService } from '@nestjs/config';
import { EnvSchema } from './env.schema';

export const appConfig = () => {
  const parsed = EnvSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error('❌ ENV ERROR');

    parsed?.error?.issues?.forEach((e) => {
      console.error(`- ${e.path.join('.')}: ${e.message}`);
    });

    process.exit(1);
  }

  const env = parsed.data;

  return {
    app: {
      env: env.NODE_ENV,
      database: {
        host: env.DATABASE_HOST,
        port: env.DATABASE_PORT,
        name: env.DATABASE_NAME,
        user: env.DATABASE_USER,
        password: env.DATABASE_PASSWORD,
        mongodbUrl: env.MONGODB_URL,
        postgresUrl: env.DATABASE_URL,
      },
      jwt: {
        access_secret: env.JWT_SECRET,
        refresh_secret: env.JWT_REFRESH_SECRET,
        expiresIn: env.JWT_EXPIRES_IN,
      },
    },
  };
};

export type AppConfig = ReturnType<typeof appConfig>;

/* export const appConfig = () => {
  const configObject = {
    env: process.env.NODE_ENV || 'development',
    database: {
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT,
      name: process.env.DATABASE_NAME,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
    },
    jwt: {
      access_secret: process.env.JWT_SECRET,
      refresh_secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
  };

  
  return configObject;
};

export type AppConfig = ReturnType<typeof appConfig>;
 */
