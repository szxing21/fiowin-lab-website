import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createTestContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("lab.members", () => {
  it("should return all members from the database", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const members = await caller.lab.members();

    expect(Array.isArray(members)).toBe(true);
    // Should have at least the seeded members
    expect(members.length).toBeGreaterThan(0);
    
    // Check structure of first member
    if (members.length > 0) {
      const member = members[0];
      expect(member).toHaveProperty("id");
      expect(member).toHaveProperty("nameEn");
      expect(member).toHaveProperty("nameCn");
      expect(member).toHaveProperty("role");
    }
  });
});

describe("lab.publications", () => {
  it("should return all publications from the database", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const publications = await caller.lab.publications();

    expect(Array.isArray(publications)).toBe(true);
    
    // Check structure if publications exist
    if (publications.length > 0) {
      const pub = publications[0];
      expect(pub).toHaveProperty("id");
      expect(pub).toHaveProperty("title");
      expect(pub).toHaveProperty("year");
    }
  });
});

describe("lab.featuredPublications", () => {
  it("should return only featured publications", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const featuredPubs = await caller.lab.featuredPublications();

    expect(Array.isArray(featuredPubs)).toBe(true);
    
    // All returned publications should be featured
    featuredPubs.forEach((pub) => {
      expect(pub.featured).toBe(1);
    });
  });
});

describe("lab.news", () => {
  it("should return all news from the database", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const news = await caller.lab.news();

    expect(Array.isArray(news)).toBe(true);
    
    // Check structure if news exist
    if (news.length > 0) {
      const item = news[0];
      expect(item).toHaveProperty("id");
      expect(item).toHaveProperty("title");
      expect(item).toHaveProperty("publishedAt");
    }
  });
});

describe("lab.featuredNews", () => {
  it("should return only featured news with limit", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const featuredNews = await caller.lab.featuredNews();

    expect(Array.isArray(featuredNews)).toBe(true);
    
    // Should not exceed limit of 6
    expect(featuredNews.length).toBeLessThanOrEqual(6);
    
    // All returned news should be featured
    featuredNews.forEach((item) => {
      expect(item.featured).toBe(1);
    });
  });
});

describe("lab.conferences", () => {
  it("should return all conferences from the database", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const conferences = await caller.lab.conferences();

    expect(Array.isArray(conferences)).toBe(true);
    
    // Check structure if conferences exist
    if (conferences.length > 0) {
      const conf = conferences[0];
      expect(conf).toHaveProperty("id");
      expect(conf).toHaveProperty("name");
      expect(conf).toHaveProperty("year");
      expect(conf).toHaveProperty("startDate");
    }
  });
});

describe("lab.researchAreas", () => {
  it("should return all research areas from the database", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const areas = await caller.lab.researchAreas();

    expect(Array.isArray(areas)).toBe(true);
    
    // Check structure if areas exist
    if (areas.length > 0) {
      const area = areas[0];
      expect(area).toHaveProperty("id");
      expect(area).toHaveProperty("nameEn");
      expect(area).toHaveProperty("nameCn");
    }
  });
});
