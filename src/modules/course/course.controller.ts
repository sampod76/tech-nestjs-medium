import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CourseService } from './course.service';
import {
  UpdateCourseSchema,
  type CreateCourseDto,
} from './schemas/create-course.schema';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { Roles } from 'src/modules/auth/roles.decorator';
import { Role } from 'src/modules/user/user.types';
import { RolesGuard } from 'src/modules/auth/roles.guard';
import { LoggingInterceptor } from 'src/common/interceptors/logging.interceptor';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { ApiListData } from 'src/common/http/http-response';
import { Course } from './mongoose/course.schema';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}
  @Post()
  @Roles(Role.admin)
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCourseDto: CreateCourseDto) {
    const course = await this.courseService.create(createCourseDto);
    return course;
  }

  @Get()
  @Roles(Role.admin, Role.teacher, Role.student)
  @UseGuards(AuthGuard)
  @UseInterceptors(LoggingInterceptor)
  async findAll(): Promise<ApiListData<Course>> {
    const courses = await this.courseService.findAll();
    return {
      items: courses,
      meta: {
        total: courses.length,
        page: 1,
        limit: 20,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
    };
  }
  @Get(':id')
  @Roles(Role.admin, Role.teacher, Role.student)
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: string) {
    return await this.courseService.findOne(id);
  }
  @Patch(':id')
  @UseGuards(AuthGuard)
  @Roles(Role.admin)
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateCourseSchema))
    updateCourseDto: Partial<CreateCourseDto>,
  ) {
    return await this.courseService.update(id, updateCourseDto);
  }
  @Delete(':id')
  @Roles(Role.admin)
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT) // 204 when delete success then not return any response data jast return 204
  remove(@Param('id') id: string) {
    return this.courseService.delete(id);
  }
}
