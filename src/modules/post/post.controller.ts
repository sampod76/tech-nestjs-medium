import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PostService } from './post.service';
import {
  CreatePostSchema,
  type CreatePostDto,
} from './schemas/create-post.schema';
import {
  UpdatePostSchema,
  type UpdatePostDto,
} from './schemas/update-post.schema';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { PostEntity } from './entities/post.entity';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../user/user.types';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { OffsetPaginationSchema } from 'src/common/pagination/pagination.schema';
import { OffsetPagination } from 'src/common/pagination/pagination.types';
import {
  PostQueryFilter,
  PostQueryFilterSchema,
} from './schemas/query-filter.schema';
import { LoggingInterceptor } from 'src/common/interceptors/logging.interceptor';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @Roles(Role.admin)
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(LoggingInterceptor)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new ZodValidationPipe(CreatePostSchema)) createPostDto: CreatePostDto,
  ) {
    const res = await this.postService.create(createPostDto);

    return res;
  }

  @Get()
  @Roles(Role.admin, Role.teacher, Role.student)
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(LoggingInterceptor)
  async findAll(
    @Query(new ZodValidationPipe(PostQueryFilterSchema))
    query: PostQueryFilter,
  ) {
    const res = await this.postService.findAll(query);

    return res;
  }

  @Get(':id')
  @Roles(Role.admin, Role.teacher, Role.student)
  @UseGuards(AuthGuard, RolesGuard)
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const res = await this.postService.findOne(id);
    return res;
  }

  @Patch(':id')
  @Roles(Role.admin, Role.teacher, Role.student)
  @UseGuards(AuthGuard, RolesGuard)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(UpdatePostSchema)) updatePostDto: UpdatePostDto,
  ) {
    const res = await this.postService.update(id, updatePostDto);
    return res;
  }

  @Delete(':id')
  @Roles(Role.admin, Role.teacher, Role.student)
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const res = await this.postService.remove(id);
    return null;
  }
}
