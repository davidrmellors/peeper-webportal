import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { Student } from "~/server/db/databaseClasses/Student";
import { DatabaseUtility } from "~/server/db/databaseClasses/DatabaseUtility";
import { Organisation } from "~/server/db/databaseClasses/Organisation";
import * as XLSX from "xlsx";
import { generateExcelWorkbook } from "~/utils/excelConverter";

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

    generateExcelReport: publicProcedure
    .input(z.array(z.string()))
    .mutation(async ({ input: studentIds }) => {
      // Fetch all selected students
      const students = await Promise.all(
        studentIds.map(async (id) => {
          const studentData = await DatabaseUtility.getData<Student>(`students/${id}`);
          return studentData ? new Student(studentData) : null;
        })
      );

      // Fetch all organisations (we need this for the org names and addresses)
      const organisations = await Organisation.getAllOrganisations();

      // Filter out any null values
      const validStudents = students.filter((s): s is Student => s !== null);

      // Generate the workbook
      const workbook = await generateExcelWorkbook(validStudents, organisations);

      // Convert to buffer
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      // Convert buffer to base64
      return Buffer.from(buffer as Buffer).toString('base64');
    }),
});
