import { z } from 'zod';

/**
 * Validation Schema (Create)
 */
export const CreatePostSchema = z.object({
  title: z.string(),
  content: z.string(),
  category: z.string(),
  author: z.string(),
});

/**
 * Request DTO (inferred from schema)
 */
export type CreatePostDto = z.infer<typeof CreatePostSchema>;
