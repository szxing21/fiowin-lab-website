import { describe, expect, it, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      cookie: (name: string, value: string, options: any) => {
        console.log(`Cookie set: ${name}=${value}`);
      },
      clearCookie: (name: string, options: any) => {
        console.log(`Cookie cleared: ${name}`);
      },
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("admin.login", () => {
  it("should authenticate with correct credentials", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const adminUsername = process.env.ADMIN_USERNAME || "admin";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    const result = await caller.admin.login({
      username: adminUsername,
      password: adminPassword,
    });

    expect(result).toEqual({ success: true });
  });

  it("should reject invalid credentials", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.admin.login({
        username: "wronguser",
        password: "wrongpass",
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});

describe("admin.savePage", () => {
  it("should save page content", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.savePage({
      slug: "test-page",
      title: "Test Page",
      contentHtml: "<p>Test content</p>",
      description: "Test description",
    });

    expect(result).toBeDefined();
  });
});

describe("admin.getPage", () => {
  it("should retrieve saved page content", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // First save a page
    await caller.admin.savePage({
      slug: "retrieve-test",
      title: "Retrieve Test",
      contentHtml: "<p>Retrieve test content</p>",
    });

    // Then retrieve it
    const page = await caller.admin.getPage({ slug: "retrieve-test" });

    expect(page).toBeDefined();
    expect(page?.title).toBe("Retrieve Test");
    expect(page?.contentHtml).toContain("Retrieve test content");
  });
});
