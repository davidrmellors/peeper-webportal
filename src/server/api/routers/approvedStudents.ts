import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { ApprovedStudents } from "~/server/db/databaseClasses/ApprovedStudents";
import {z} from 'zod';

export const approvedStudentsRouter = createTRPCRouter({
    fetchAllApprovedStudents: publicProcedure
    .query(async () => {
      return await ApprovedStudents.fetchAll();
    }),
    
    addApprovedStudents: publicProcedure
    .input(z.object({ approvedStudents: z.array(z.string()) })) // Input schema
    .mutation(async ({ input }) => {
      try {
        // Log the input for debugging
        console.log('Adding approved students:', input.approvedStudents);
        
        // Save the approved students
        await ApprovedStudents.save(input.approvedStudents);
        
        return { success: true }; // Return a success response
      } catch (error) {
        console.error('Error saving approved students:', error);
        throw new Error('Failed to save approved students'); // Throw an error if saving fails
      }
    })
});
