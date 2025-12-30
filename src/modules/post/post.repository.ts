import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

import { CreatePostDto } from './schemas/create-post.schema';
import { Post } from 'src/generated/prisma/client';

@Injectable()
export class PostRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreatePostDto) {
    return this.prisma.client.post.create({
      data: {
        title: data.title,
        author: data.author,
        category: data.category,
        content: data.content,
      },
    });
  }

  findAll() {
    return this.prisma.client.post.findMany({});
  }

  findOne(id: string) {
    return this.prisma.client.post.findUnique({
      where: { id },
    });
  }

  update(id: string, data: any) {
    return this.prisma.client.post.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.client.post.delete({
      where: { id },
    });
  }
}
