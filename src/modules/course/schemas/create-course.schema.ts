import { z } from 'zod';

/**
 * Validation Schema (Create Course)
 */
export const CreateCourseSchema = z
  .object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    price: z.coerce.number().min(0, 'Price must be a positive number'),
  })
  .strict();

/**
 * Request DTO (inferred from schema)
 */
export type CreateCourseDto = z.infer<typeof CreateCourseSchema>;
