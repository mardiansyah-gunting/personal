import { expect, test } from "vitest";
import { verbatimSuite } from "./content-suite";

verbatimSuite("en");

test("only AKAR DMRV carries the production-confidential note, as on the old site", async () => {
  const { getSite } = await import("@/content");
  for (const lang of ["en", "id", "zh"] as const) {
    expect(getSite(lang).projects.filter((p) => p.confidential).map((p) => p.slug)).toEqual(["akar-dmrv"]);
  }
});
