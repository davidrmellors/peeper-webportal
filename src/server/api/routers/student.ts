import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { Student } from "~/server/db/databaseClasses/Student";
import { DatabaseUtility } from "~/server/db/databaseClasses/DatabaseUtility";

export const studentRouter = createTRPCRouter({
  getAllStudents: publicProcedure
    .query(async () => {
      try {
        const studentsData = await DatabaseUtility.getAllData<Student>('students');
        return studentsData.map(studentData => new Student(studentData));
      } catch (error) {
        console.error("Error fetching students:", error);
        return [];
      }
    }),
});
