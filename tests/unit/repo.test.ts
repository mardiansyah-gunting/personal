import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { expect, test } from "vitest";

test("build output of the old Astro site is ignored and not tracked", () => {
  const ignore = readFileSync(".gitignore", "utf8").split("\n");
  expect(ignore).toEqual(expect.arrayContaining(["dist/", ".astro/"]));
  expect(execSync("git ls-files dist .astro", { encoding: "utf8" }).trim()).toBe("");
});
