import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
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

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(CreatePostSchema)) createPostDto: CreatePostDto,
  ) {
    return this.postService.create(createPostDto);
  }

  @Get()
  findAll(@Query('search') search?: string): PostEntity[] {
    const query: Partial<Record<string, string>> = {
      search,
    };
    return this.postService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdatePostSchema)) updatePostDto: UpdatePostDto,
  ) {
    return this.postService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}
