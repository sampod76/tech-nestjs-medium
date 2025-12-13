import { z } from 'zod';

/**
 * Validation Schema (Create)
 */
export const CreatePostSchema = z.object({
  title: z.string(),
});

/**
 * Request DTO (inferred from schema)
 */
export type CreatePostDto = z.infer<typeof CreatePostSchema>;
