import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './schemas/create-post.schema';
import { UpdatePostDto } from './schemas/update-post.schema';
import { PostRepository } from './post.repository';
import { Post, Prisma } from 'src/generated/prisma/client';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  create(dto: CreatePostDto): Promise<Post> {
    return this.postRepository.create(dto);
  }

  findAll(query: Partial<Record<string, string>>): Promise<Post[]> {
    return this.postRepository.findAll();
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postRepository.findOne(id);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async update(id: string, dto: UpdatePostDto): Promise<Post> {
    const post = await this.postRepository.findOne(id);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const data: Prisma.PostUpdateInput = {
      title: dto.title,
      content: dto.content,
      category: dto.category,
      author: dto.author,
    };

    return this.postRepository.update(id, data);
  }

  remove(id: string): Promise<Post> {
    return this.postRepository.remove(id);
  }
}
