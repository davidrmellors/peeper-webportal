import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { postSchema, firebasePostSchema, type Post, type FirebasePost } from "~/server/db/schema";

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
      const postsRef = db.ref('posts');
      const newPost: FirebasePost = {
        name: input.name,
        createdAt: new Date().toISOString(),
      };
      await postsRef.push(newPost);
    }),
  
  getLatest: publicProcedure.query(async () => {
    const postsRef = db.ref('posts');
    const snapshot = await postsRef.orderByChild('createdAt').limitToLast(1).once('value');
    
    if (!snapshot.exists()) {
      return null;
    }
  
    const [id, post] = Object.entries(snapshot.val())[0] as [string, FirebasePost];
    const latestPost: Post = {
      id,
      ...post,
    };
    return postSchema.parse(latestPost);
  }),
});