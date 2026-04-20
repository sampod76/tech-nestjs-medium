import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

import { CreatePostDto } from './schemas/create-post.schema';
import { Prisma } from 'src/generated/prisma/client';
import { PostQueryFilter } from './schemas/query-filter.schema';
import {
  buildOffsetMeta,
  buildOffsetPagination,
} from 'src/common/pagination/offset-pagination';

@Injectable()
export class PostRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.PostCreateInput) {
    // return this.prisma.client.post.create({
    //   data: {
    //     title: data.title,
    //     author: data.author,
    //     category: data.category,
    //     content: data.content,
    //   },
    // }); // ❌ repository-তে dto দিও না ✅ service-এ map করে repository-তে পাঠাও
    return this.prisma.client.post.create({
      data,
    });
  }

  async findAll(
    where: Prisma.PostWhereInput,
    pagination: {
      skip: number;
      limit: number;
      sortBy: string;
      sortOrder: 'asc' | 'desc';
    },
  ) {
    const [total, data] = await this.prisma.client.$transaction([
      this.prisma.client.post.count({
        where: {
          ...where,
          deletedAt: null,
        },
      }),
      this.prisma.client.post.findMany({
        where,
        skip: pagination.skip,
        take: pagination.limit,
        orderBy: {
          [pagination.sortBy]: pagination.sortOrder,
        },
      }),
    ]);

    return { total, data };
  }

  findUnique(id: string) {
    return this.prisma.client.post.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: Prisma.PostUpdateInput) {
    return this.prisma.client.post.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.client.post.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  restore(id: string) {
    return this.prisma.client.post.update({
      where: { id },
      data: { deletedAt: null },
    });
  }
}
