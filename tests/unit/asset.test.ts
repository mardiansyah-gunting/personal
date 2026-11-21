import { afterEach, expect, test, vi } from "vitest";
import { asset } from "@/lib/asset";

afterEach(() => vi.unstubAllEnvs());

test("prefixes base path", () => {
  vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/personal");
  expect(asset("/images/logos/bps.png")).toBe("/personal/images/logos/bps.png");
});

test("no base path in tests by default", () => {
  vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "");
  expect(asset("/profile.jpg")).toBe("/profile.jpg");
});

test("rejects relative paths", () => expect(() => asset("images/x.png")).toThrow("asset path must start with /"));
