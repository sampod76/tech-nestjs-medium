import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './schemas/create-post.schema';
import { UpdatePostDto } from './schemas/update-post.schema';
import { PostEntity } from './entities/post.entity';

@Injectable()
export class PostService {
  create(createPostDto: CreatePostDto) {
    return 'This action adds a new post';
  }

  findAll({ search }: { search?: string }): PostEntity[] {
    return [] as PostEntity[];
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
