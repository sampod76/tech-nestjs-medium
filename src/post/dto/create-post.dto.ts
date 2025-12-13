export class CreatePostDto {
  title: string;
  content: string;
}

// export interface Post extends CreatePostDto {
//   id: string; // অথবা number — আপনার ডেটাবেস অনুযায়ী
// }

export type IPost = CreatePostDto;
