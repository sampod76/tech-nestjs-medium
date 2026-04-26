import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { RegisterDto } from './dto/registerUser.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcryptjs';
import { AppConfig } from 'src/config/app.config';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    private readonly configService: ConfigService<AppConfig>,
  ) {}
  async registerUser(registerUserDto: RegisterDto) {
    const existingUser = await this.userService.findByEmail(
      registerUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    const hashedPassword = await this.hashPassword(registerUserDto.password);
    registerUserDto.password = hashedPassword;
    const result = await this.userService.createUser(registerUserDto);
    const payload = { userId: result._id, role: result.roll };
    const token = await this.jwtService.signAsync(payload);
    return { access_token: token, role: result.roll };
  }
  async login(loginDto: LoginDto) {
    const result = await this.userService.findByEmail(loginDto.email);
    if (!result) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await this.comparePassword(
      loginDto.password,
      result.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }
    // const tokenTest = this.config.get<string>('PROJECT_NAME');
    // console.log('🚀 ~ AuthService ~ login ~ tokenTest:', tokenTest);
    const payload = { userId: result._id.toString(), role: result.roll };
    const token = await this.generateJwtToken(payload);
    return { access_token: token, role: result.roll };
  }
  async profile(userId: string) {
    const result = await this.userService.user(userId);
    return result;
  }
  private async hashPassword(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, 12);
    return hash;
  }
  private async comparePassword(password: string, hashedPassword: string) {
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    return isPasswordValid;
  }
  private async generateJwtToken({
    userId,
    role,
  }: {
    userId: string;
    role: string;
  }) {
    const envApp = this.configService.getOrThrow('app', { infer: true });
    const payload = { userId, role };
    const token = await this.jwtService.signAsync(payload, {
      secret: envApp.jwt.access_secret,
      expiresIn: (envApp.jwt.expiresIn as any) || '1d',
    });
    return token;
  }
  users(): { message: string } {
    return {
      message: 'users',
    };
  }
}
