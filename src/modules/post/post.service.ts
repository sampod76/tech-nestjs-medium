import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './schemas/create-post.schema';
import { UpdatePostDto } from './schemas/update-post.schema';
import { PostRepository } from './post.repository';
import { Post, Prisma, User } from 'src/generated/prisma/client';
import { PostQueryFilter } from './schemas/query-filter.schema';
import { ApiListData } from 'src/common/http/http-response';
import {
  buildOffsetMeta,
  buildOffsetPagination,
} from 'src/common/pagination/offset-pagination';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    // private readonly UserService: UserService,
  ) {}
  //
  private mapUpdatePostDto(dto: UpdatePostDto): Prisma.PostUpdateInput {
    return {
      title: dto.title ?? undefined,
      content: dto.content ?? undefined,
      category: dto.category ?? undefined,
      //! not use Spread | Hidden Bug in Spread Version => 0,"", false will be removed/ignored
      // ...(dto.title && { title: dto.title }), // title:"" will be removed/ignored
    };
  }
  private mapCreatePostDto(dto: CreatePostDto): Prisma.PostCreateInput {
    return {
      title: dto.title,
      content: dto.content,
      category: dto.category,
      author: dto.author,
    };
  }

  create(dto: CreatePostDto): Promise<Post> {
    // return this.postRepository.create({
    //   title: dto.title,
    //   content: dto.content,
    //   category: dto.category,
    //   author: dto.author,
    // });
    return this.postRepository.create(this.mapCreatePostDto(dto)); // best and clean
  }

  async findAll(query: PostQueryFilter) {
    // 1️⃣ pagination তৈরি
    const pagination = buildOffsetPagination(
      {
        page: query.page,
        limit: query.limit,
        sortBy: query.sortBy,
        sortOrder: query.sortOrder,
      },
      ['createdAt'],
    );

    // 2️⃣ filter তৈরি
    const where: Prisma.PostWhereInput = {};

    // 3️⃣ repo call
    const { total, data } = await this.postRepository.findAll(
      where,
      pagination,
    );

    // 4️⃣ meta তৈরি
    const meta = buildOffsetMeta(total, pagination.page, pagination.limit);

    return {
      meta,
      items: data,
    };
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postRepository.findUnique(id);

    if (!post || post.deletedAt) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async update(id: string, dto: UpdatePostDto): Promise<Post> {
    // const post = await this.postRepository.findOne(id);
    // if (!post) {
    //   throw new NotFoundException('Post not found');
    // }
    await this.findOne(id);
    return this.postRepository.update(id, this.mapUpdatePostDto(dto));
  }

  async remove(id: string): Promise<Post> {
    await this.findOne(id);
    return this.postRepository.remove(id);
  }
}
