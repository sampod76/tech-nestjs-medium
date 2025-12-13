import { Injectable } from '@nestjs/common';
import { type CreateCourseDto } from './schemas/create-course.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Course } from './mongoose/course.schema';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/config/app.config';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<Course>,
    private configService: ConfigService<AppConfig>,
  ) {}
  async create(courseDto: CreateCourseDto) {
    const appName = this.configService.get('app', { infer: true });
    console.log('🚀 ~ CourseService ~ create ~ appName:', appName?.env);
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

  async update(id: string, courseDto: CreateCourseDto) {
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
