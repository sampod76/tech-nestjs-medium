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
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../user/user.types';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import {
  PostQueryFilter,
  PostQueryFilterSchema,
} from './schemas/query-filter.schema';
import { LoggingInterceptor } from 'src/common/interceptors/logging.interceptor';
import { CurrentUser } from '../auth/decorators/currentUser.decorator';
import { AuthPayload } from '../auth/auth.types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @Roles(Role.admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(LoggingInterceptor)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new ZodValidationPipe(CreatePostSchema)) createPostDto: CreatePostDto,
    @CurrentUser() user: AuthPayload,
  ) {
    const res = await this.postService.create(createPostDto);

    return res;
  }

  @Get()
  @Roles(Role.admin, Role.teacher, Role.student)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(LoggingInterceptor)
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query(new ZodValidationPipe(PostQueryFilterSchema))
    query: PostQueryFilter,
    @CurrentUser() user: AuthPayload, //or @Req() req: Request
  ) {
    console.log('🚀 ~ PostController ~ findAll ~ user:', user);
    const res = await this.postService.findAll(query);
    return res;
  }

  @Get(':id')
  @Roles(Role.admin, Role.teacher, Role.student)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthPayload,
  ) {
    const res = await this.postService.findOne(id);
    return res;
  }

  @Patch(':id')
  @Roles(Role.admin, Role.teacher, Role.student)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(UpdatePostSchema)) updatePostDto: UpdatePostDto,
    @CurrentUser() user: AuthPayload,
  ) {
    const res = await this.postService.update(id, updatePostDto);
    return res;
  }

  @Delete(':id')
  @Roles(Role.admin, Role.teacher, Role.student)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthPayload,
  ) {
    await this.postService.remove(id);
    return null;
  }
}
