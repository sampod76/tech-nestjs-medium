export interface PostEntity {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  createdAt?: Date;
  updatedAt?: Date;
}
