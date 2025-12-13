import { IsNotEmpty, IsNumber } from 'class-validator';

export class CourseDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}
