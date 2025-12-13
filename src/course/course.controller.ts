import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseDto } from './dto/course.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/user/user.types';
import { RolesGuard } from 'src/auth/roles.guard';
import { LoggingInterceptor } from 'src/interceptors/logging.interceptor';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}
  @Post()
  @Roles(Role.admin)
  @UseGuards(AuthGuard, RolesGuard)
  async create(@Body() createCourseDto: CourseDto) {
    return await this.courseService.create(createCourseDto);
  }
  @Get()
  @UseInterceptors(LoggingInterceptor)
  @Roles(Role.admin, Role.teacher, Role.student)
  @UseGuards(AuthGuard)
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
  async update(@Param('id') id: string, @Body() updateCourseDto: CourseDto) {
    return await this.courseService.update(id, updateCourseDto);
  }
  @Delete(':id')
  @Roles(Role.admin)
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string) {
    return await this.courseService.delete(id);
  }
}
