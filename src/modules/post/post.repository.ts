import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

import { CreatePostDto } from './schemas/create-post.schema';
import { Post, Prisma } from 'src/generated/prisma/client';
import { PostQueryFilter } from './schemas/query-filter.schema';
import {
  buildOffsetMeta,
  buildOffsetPagination,
} from 'src/common/pagination/offset-pagination';

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

  async findAll(query: PostQueryFilter) {
    // 1️⃣ pagination build (safe + whitelist)
    const paginationData = {
      page: query.page,
      limit: query.limit,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    };
    const pagination = buildOffsetPagination(paginationData, ['createdAt']);

    // 2️⃣ where clause (filters)
    const where: Prisma.PostWhereInput = {};

    // 3️⃣ transactional query
    const [total, data] = await this.prisma.client.$transaction([
      this.prisma.client.post.count({ where }),
      this.prisma.client.post.findMany({
        where,
        skip: pagination.skip,
        take: pagination.limit,
        orderBy: {
          [pagination.sortBy]: pagination.sortOrder,
        },
      }),
    ]);

    // 4️⃣ meta build
    const meta = buildOffsetMeta(total, pagination.page, pagination.limit);

    // 5️⃣ standard response
    return {
      meta,
      items: data,
    };
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
