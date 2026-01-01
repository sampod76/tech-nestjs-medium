import { z } from 'zod';
import { OffsetPaginationSchema } from 'src/common/pagination/pagination.schema';

export const PostQueryFilterSchema = OffsetPaginationSchema.extend({
  search: z.string().trim().min(1).max(100).optional(),
  price: z.coerce.number().int().positive().optional(),
}).strip();

export type PostQueryFilter = z.infer<typeof PostQueryFilterSchema>;
export type IPostQueryFilter = z.infer<typeof PostQueryFilterSchema>;
