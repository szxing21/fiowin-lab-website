import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

export const appRouter = router({
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

  // Admin authentication and page editing
  admin: router({
    login: publicProcedure.input(z.object({ username: z.string(), password: z.string() })).mutation(async ({ input, ctx }) => {
      const adminUsername = process.env.ADMIN_USERNAME || "admin";
      const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
      
      if (input.username === adminUsername && input.password === adminPassword) {
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie("admin_token", "authenticated", {
          ...cookieOptions,
          maxAge: 24 * 60 * 60 * 1000,
        });
        return { success: true };
      }
      throw new Error("Invalid credentials");
    }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie("admin_token", { ...cookieOptions, maxAge: -1 });
      return { success: true };
    }),
    getPage: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
      const { getPageBySlug } = await import("./db");
      return getPageBySlug(input.slug);
    }),
    savePage: publicProcedure.input(z.object({
      slug: z.string(),
      title: z.string(),
      contentHtml: z.string().optional(),
      contentJson: z.string().optional(),
      description: z.string().optional(),
    })).mutation(async ({ input }) => {
      const { upsertPage } = await import("./db");
      return upsertPage(input.slug, input);
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
    pageBySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
      const { getPageBySlug } = await import("./db");
      return getPageBySlug(input.slug);
    }),
  }),
});

export type AppRouter = typeof appRouter;
