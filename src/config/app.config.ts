export const appConfig = () => {
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

  //   const validated = plainToInstance(AppConfigValidation, configObject, {
  //     enableImplicitConversion: true,
  //   });

  //   const errors = validateSync(validated, {
  //     skipMissingProperties: false, // missing হলে error দেখাবে
  //   });

  //   if (errors.length > 0) {
  //     const msg = formatErrors(errors);

  //     console.error('❌ ENV Validation Error:\n' + msg);
  //     throw new Error('❌ Environment variables are invalid. Please fix them.');
  //   }

  return configObject;
};

export type AppConfig = ReturnType<typeof appConfig>;
