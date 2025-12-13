import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RegisterDto } from 'src/modules/auth/dto/registerUser.dto';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async createUser(registerUserDto: RegisterDto) {
    try {
      const result = await this.userModel.create(registerUserDto);
      return result;
    } catch (error: unknown) {
      const e = error as { code: number };
      if (e?.code === 11000) {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }
  async users() {
    const result = await this.userModel.find({}).exec();
    return result;
  }
  async user(id: string) {
    const result = await this.userModel.findById(id).exec();
    return result;
  }
  findByEmail(email: string) {
    const result = this.userModel.findOne({ email }).exec();
    return result;
  }
  async updateUser(id: string, registerUserDto: RegisterDto) {
    const result = await this.userModel
      .findByIdAndUpdate(id, registerUserDto, { new: true })
      .exec();
    return result;
  }
}
