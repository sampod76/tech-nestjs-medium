import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CourseDocument = HydratedDocument<Course>;

@Schema({
  collection: 'courses',
  timestamps: true,
  versionKey: false,
  _id: true,
  // virtuals: true,
})
export class Course {
  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  title: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  description: string;

  @Prop({
    type: Number,
    required: true,
    min: 0,
  })
  price: number;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
