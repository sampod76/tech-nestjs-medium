import { HttpStatus, Injectable } from '@nestjs/common';
import { type CreateCourseDto } from './schemas/create-course.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Course } from './mongoose/course.schema';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/config/app.config';
import { AppException } from 'src/common/errors/app-exception';
import { ErrorCodes } from 'src/common/errors/error-codes';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<Course>,
    private configService: ConfigService<AppConfig>,
  ) {}
  async create(courseDto: CreateCourseDto) {
    const appName = this.configService.get('app', { infer: true });

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

  async update(id: string, courseDto: Partial<CreateCourseDto>) {
    console.log('🚀 ~ CourseService ~ update ~ courseDto:', courseDto);
    const findExist = await this.courseModel.findById(id).exec();
    if (!findExist) {
      throw new AppException(
        ErrorCodes.NOT_FOUND,
        'Course not found',
        HttpStatus.NOT_FOUND,
        { courseId: id },
      );
    }
    const result = await this.courseModel
      .findByIdAndUpdate(id, courseDto, { new: true })
      .exec();
    return result;
  }

  async delete(id: string) {
    const findExist = await this.courseModel.findById(id).exec();
    if (!findExist) {
      throw new AppException(
        ErrorCodes.NOT_FOUND,
        'Course not found',
        HttpStatus.NOT_FOUND,
        { courseId: id },
      );
    }
    const result = await this.courseModel.findByIdAndDelete(id).exec();
    return null;
  }
}
