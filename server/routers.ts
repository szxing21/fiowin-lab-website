import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Laboratory data routers
  lab: router({
    members: publicProcedure.query(async () => {
      const { getAllMembers } = await import("./db");
      return getAllMembers();
    }),
    memberById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      const { getMemberById } = await import("./db");
      return getMemberById(input.id);
    }),
    publicationsByMember: publicProcedure.input(z.object({ memberName: z.string() })).query(async ({ input }) => {
      const { getPublicationsByMember } = await import("./db");
      return getPublicationsByMember(input.memberName);
    }),
    publications: publicProcedure.query(async () => {
      const { getAllPublications } = await import("./db");
      return getAllPublications();
    }),
    featuredPublications: publicProcedure.query(async () => {
      const { getFeaturedPublications } = await import("./db");
      return getFeaturedPublications();
    }),
    news: publicProcedure.query(async () => {
      const { getAllNews } = await import("./db");
      return getAllNews();
    }),
    featuredNews: publicProcedure.query(async () => {
      const { getFeaturedNews } = await import("./db");
      return getFeaturedNews();
    }),
    conferences: publicProcedure.query(async () => {
      const { getAllConferences } = await import("./db");
      return getAllConferences();
    }),
    researchAreas: publicProcedure.query(async () => {
      const { getAllResearchAreas } = await import("./db");
      return getAllResearchAreas();
    }),
  }),
});

export type AppRouter = typeof appRouter;
