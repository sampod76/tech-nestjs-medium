import { Injectable } from '@nestjs/common';
import { CourseDto } from './dto/course.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Course } from './schemas/course.schema';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<Course>,
    private configService: ConfigService,
  ) {}
  async create(courseDto: CourseDto) {
    const appName = this.configService.get<string>('APP_NAME', 'default value');
    console.log('🚀 ~ CourseService ~ create ~ appName:', appName);
    const result = await this.courseModel.create(courseDto);
    return result;
  }

  async findAll() {
    const result = await this.courseModel.find({}).exec();
    return result;
  }

  async findOne(id: string) {
    const result = await this.courseModel.findById(id).exec();
    return result;
  }

  async update(id: string, courseDto: CourseDto) {
    const result = await this.courseModel
      .findByIdAndUpdate(id, courseDto, { new: true })
      .exec();
    return result;
  }

  async delete(id: string) {
    const result = await this.courseModel.findByIdAndDelete(id).exec();
    return result;
  }
}
