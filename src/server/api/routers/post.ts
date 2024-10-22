import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { DatabaseUtility } from "~/server/db/databaseClasses/DatabaseUtility";
import { postSchema, firebasePostSchema, type Post, type FirebasePost } from "~/server/db/interfaces/schema";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: publicProcedure
    .input(firebasePostSchema.pick({ name: true }))
    .mutation(async ({ input }) => {
      const newPost: FirebasePost = {
        name: input.name,
        createdAt: new Date().toISOString(),
      };
      await DatabaseUtility.setData('posts/' + Date.now(), newPost);
    }),
  
  getLatest: publicProcedure.query(async () => {
    const posts = await DatabaseUtility.getAllData<FirebasePost>('posts');
    if (posts.length === 0) {
      return null;
    }
  
    const latestPost = posts.reduce((latest, current) => 
      latest.createdAt > current.createdAt ? latest : current
    );

    const post: Post = {
      id: latestPost.createdAt, // Using createdAt as id for simplicity
      ...latestPost,
    };
    return postSchema.parse(post);
  }),
});
