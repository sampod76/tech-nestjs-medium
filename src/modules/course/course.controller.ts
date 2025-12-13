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
import { type CreateCourseDto } from './schemas/create-course.schema';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { Roles } from 'src/modules/auth/roles.decorator';
import { Role } from 'src/modules/user/user.types';
import { RolesGuard } from 'src/modules/auth/roles.guard';
import { LoggingInterceptor } from 'src/common/interceptors/logging.interceptor';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}
  @Post()
  @Roles(Role.admin)
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCourseDto: CreateCourseDto) {
    const result = await this.courseService.create(createCourseDto);
    return result;
  }
  @Get()
  @Roles(Role.admin, Role.teacher, Role.student)
  @UseGuards(AuthGuard)
  @UseInterceptors(LoggingInterceptor)
  async findAll() {
    return await this.courseService.findAll();
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
    @Body() updateCourseDto: CreateCourseDto,
  ) {
    return await this.courseService.update(id, updateCourseDto);
  }
  @Delete(':id')
  @Roles(Role.admin)
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string) {
    return await this.courseService.delete(id);
  }
}
