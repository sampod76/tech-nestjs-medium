import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class PostExistsPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    try {
      return value;
    } catch (error) {
      throw new Error('Post does not exist');
    }
  }
}
