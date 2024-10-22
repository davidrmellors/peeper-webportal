import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { Organisation } from "~/server/db/databaseClasses/Organisation";

export const organisationRouter = createTRPCRouter({
  getAllOrganisations: publicProcedure
    .query(async () => {
      return await Organisation.getAllOrganisations();
    }),
});