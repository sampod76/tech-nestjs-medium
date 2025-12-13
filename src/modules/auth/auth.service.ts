import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { RegisterDto } from './dto/registerUser.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}
  async registerUser(registerUserDto: RegisterDto) {
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
    const tokenTest = this.config.get<string>('PROJECT_NAME');
    console.log('🚀 ~ AuthService ~ login ~ tokenTest:', tokenTest);
    const payload = { userId: result._id, role: result.roll };
    const token = await this.jwtService.signAsync(payload);
    return { access_token: token, role: result.roll };
  }
  async profile(userId: string) {
    const result = await this.userService.user(userId);
    return result;
  }
  users(): { message: string } {
    return {
      message: 'users',
    };
  }
}
