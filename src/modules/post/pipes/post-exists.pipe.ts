import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class PostExistsPipe implements PipeTransform {
  transform(value: string, _metadata: ArgumentMetadata) {
    try {
      return value;
    } catch (_error) {
      throw new Error('Post does not exist');
    }
  }
}
