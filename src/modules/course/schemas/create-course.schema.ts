import { z } from 'zod';

export const CourseBaseSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  price: z.number().positive(),
  isPublished: z.boolean().optional(),
});

export const CreateCourseSchema = CourseBaseSchema;

export const UpdateCourseSchema = CourseBaseSchema.partial();

export type CreateCourseDto = z.infer<typeof CreateCourseSchema>;
export type UpdateCourseDto = z.infer<typeof UpdateCourseSchema>;
