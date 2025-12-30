import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PostRepository } from './post.repository';

@Module({
  exports: [PostService],
  controllers: [PostController],
  providers: [PostRepository, PostService],
})
export class PostModule {}
