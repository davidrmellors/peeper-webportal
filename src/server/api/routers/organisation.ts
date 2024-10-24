import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { Organisation } from "~/server/db/databaseClasses/Organisation";
import { OrgRequest } from "~/server/db/databaseClasses/OrgRequest";
import { Student } from "~/server/db/databaseClasses/Student";
import { sendApprovalEmail } from "~/server/utils/sendgrid";
import { ApprovalStatus } from "~/server/db/interfaces/enums";

export const organisationRouter = createTRPCRouter({
  getAllOrganisations: publicProcedure
    .query(async () => {
      return await Organisation.getAllOrganisations();
    }),

  approveOrgRequest: publicProcedure
    .input(z.object({ requestId: z.string() }))
    .mutation(async ({ input }) => {
      const orgRequest = await OrgRequest.fetchById(input.requestId);
      if (!orgRequest) {
        throw new Error("Organization request not found");
      }

      // Update the request status
      orgRequest.approvalStatus = ApprovalStatus.Approved;
      await orgRequest.save();

      // Fetch the student's email
      const student = await Student.fetchById(orgRequest.studentID);
      if (!student) {
        throw new Error("Student not found");
      }

      try {
        // Attempt to send approval email
        await sendApprovalEmail(student.email, orgRequest.name);
      } catch (error) {
        console.error("Failed to send approval email:", error);
        // Continue with the approval process even if email sending fails
      }

      return { success: true };
    }),

  getPendingRequests: publicProcedure
    .query(async () => {
      const pendingRequests = await OrgRequest.fetchByApprovalStatus(ApprovalStatus.Pending);

      if (!pendingRequests || pendingRequests.length === 0) {
        return []; // Return an empty array if no pending requests or if null
      }

      return pendingRequests;
    }),

  denyOrgRequest: publicProcedure
    .input(z.object({ requestId: z.string() }))
    .mutation(async ({ input }) => {
      const orgRequest = await OrgRequest.fetchById(input.requestId);
      if (!orgRequest) {
        throw new Error("Organization request not found");
      }

      orgRequest.approvalStatus = ApprovalStatus.Denied;
      await orgRequest.save();
    }),
});

