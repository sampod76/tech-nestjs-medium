import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

class DatabaseConfig {
  @IsString()
  host: string;

  @Type(() => Number)
  @IsNumber()
  port: number;

  @IsString()
  name: string;

  @IsString()
  user: string;

  @IsString()
  password: string;
}

class JwtConfig {
  @IsString()
  @IsNotEmpty()
  access_secret: string;

  @IsString()
  @IsNotEmpty()
  refresh_secret: string;

  @IsString()
  @IsOptional()
  expiresIn: string;
}

export class AppConfigValidation {
  @IsString()
  env: string;

  @Type(() => DatabaseConfig)
  database: DatabaseConfig;

  @Type(() => JwtConfig)
  jwt: JwtConfig;
}
