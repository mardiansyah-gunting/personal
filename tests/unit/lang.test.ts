import { afterEach, expect, test, vi } from "vitest";
import { hrefFor, pathFor, redirectScript } from "@/lib/lang";

afterEach(() => vi.unstubAllEnvs());

test("each language has its own path", () => {
  expect([pathFor("en"), pathFor("id"), pathFor("zh")]).toEqual(["/", "/id/", "/zh/"]);
});

test("hrefs include the base path", () => {
  vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/personal");
  expect(hrefFor("zh")).toBe("/personal/zh/");
  expect(hrefFor("en")).toBe("/personal/");
});

/** Runs the inline script against a fake browser and returns where it navigated. */
function run(saved: string | null, pathname: string, hash = "") {
  let went: string | null = null;
  const localStorage = { getItem: () => saved };
  const location = { pathname, hash, replace: (u: string) => (went = u) };
  new Function("localStorage", "location", redirectScript("/personal"))(localStorage, location);
  return went;
}

test("a saved non-English choice redirects the English page, keeping the deep link", () => {
  expect(run("id", "/personal/", "#/work/tree-monitoring")).toBe("/personal/id/#/work/tree-monitoring");
  expect(run("zh", "/personal/")).toBe("/personal/zh/");
});

test("no redirect for English, no choice, other pages, or junk values", () => {
  expect(run("en", "/personal/")).toBeNull();
  expect(run(null, "/personal/")).toBeNull();
  expect(run("id", "/personal/id/")).toBeNull();
  expect(run("<script>", "/personal/")).toBeNull();
});
