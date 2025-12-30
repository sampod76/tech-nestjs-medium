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

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @Roles(Role.admin)
  @UseGuards(AuthGuard, RolesGuard)
  async create(
    @Body(new ZodValidationPipe(CreatePostSchema)) createPostDto: CreatePostDto,
  ) {
    const res = await this.postService.create(createPostDto);

    return res;
  }

  @Get()
  async findAll(@Query('search') search?: string) {
    const query: Partial<Record<string, string>> = {
      search,
    };

    const res = await this.postService.findAll(query);
    return res;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const res = await this.postService.findOne(id);
    return res;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdatePostSchema)) updatePostDto: UpdatePostDto,
  ) {
    const res = await this.postService.update(id, updatePostDto);
    return res;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const res = await this.postService.remove(id);
    return res;
  }
}
