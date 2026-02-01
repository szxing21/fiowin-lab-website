import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type CookieCall = {
  name: string;
  value: string;
  options: Record<string, unknown>;
};

function createAdminContext(): { ctx: TrpcContext; setCookies: CookieCall[] } {
  const setCookies: CookieCall[] = [];

  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      cookie: (name: string, value: string, options: Record<string, unknown>) => {
        setCookies.push({ name, value, options });
      },
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx, setCookies };
}

describe("admin.login", () => {
  it("successfully logs in with correct credentials", async () => {
    const { ctx, setCookies } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.login({
      username: process.env.ADMIN_USERNAME || "LabAdmin",
      password: process.env.ADMIN_PASSWORD || "FiowinLab2021",
    });

    expect(result).toEqual({ success: true });
    expect(setCookies).toHaveLength(1);
    expect(setCookies[0]?.name).toBe("admin_token");
    expect(setCookies[0]?.value).toBe("authenticated");
  });

  it("fails with incorrect credentials", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.admin.login({
        username: "wronguser",
        password: "wrongpass",
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect((error as Error).message).toBe("Invalid credentials");
    }
  });
});
