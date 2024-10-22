import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { Student } from "~/server/db/databaseClasses/Student";

export const studentRouter = createTRPCRouter({
  getAllStudents: publicProcedure
    .query(async () => {
      // Implement the logic to fetch all students
      // This is a placeholder, you'll need to implement the actual fetching logic
      return [];
    }),
});