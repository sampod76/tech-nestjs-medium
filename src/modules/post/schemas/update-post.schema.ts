import z from 'zod';
import { CreatePostSchema } from './create-post.schema';

/**
 * Validation Schema (Update)
 * Create schema থেকেই partial করা
 */
export const UpdatePostSchema = CreatePostSchema.partial();

/**
 * Request DTO (Update)
 */
export type UpdatePostDto = z.infer<typeof UpdatePostSchema>;
