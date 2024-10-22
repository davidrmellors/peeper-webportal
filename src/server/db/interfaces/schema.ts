import { z } from "zod";

// Define the Zod schema for Post
export const postSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
});

// Infer the TypeScript type from the Zod schema
export type Post = z.infer<typeof postSchema>;

// Define the schema for the data as it's stored in Firebase
export const firebasePostSchema = postSchema.omit({ id: true });
export type FirebasePost = z.infer<typeof firebasePostSchema>;

// You can add more schemas and types for other models here