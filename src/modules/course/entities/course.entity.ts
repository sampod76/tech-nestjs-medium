/**
 * Domain / Business Entity
 * --------------------------------
 * - Framework independent
 * - No mongoose decorators
 * - No zod
 * - No class-validator
 */

export interface CourseEntity {
  id: string; // mapped from Mongo _id
  title: string;
  description: string;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
}
