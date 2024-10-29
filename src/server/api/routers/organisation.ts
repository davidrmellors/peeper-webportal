import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { Organisation } from "~/server/db/databaseClasses/Organisation";
import {z} from 'zod';

export const organisationRouter = createTRPCRouter({
  getAllOrganisations: publicProcedure
    .query(async () => {
      return await Organisation.getAllOrganisations();
    }),

  addOrganisation: publicProcedure
  .input(z.object({
    org: z.object({
      org_id: z.string(),
      orgName: z.string(),
      orgAddress: z.object({
        streetAddress: z.string(), // Added property
        suburb: z.string(),        // Added property
        province: z.string(),      // Added property
        postalCode: z.string(),    // Added property
        city: z.string(),          // Added missing property
      }),
      orgEmail: z.string(),
      orgPhoneNo: z.string(),
      orgLatitude: z.number(),
      orgLongitude: z.number(),
    }),
  }))
  .mutation(async ({ input }) => {
    return await Organisation.save(input.org); // Pass the org property
  })
});
