import { expect, test } from "vitest";
import { toGroups, toUnits, type Unit } from "@/lib/richText";

const text = (g: Unit[]) => g.map((u) => (u.kind === "word" ? u.text : u.kind === "link" ? u.seg.text : "")).join("");

test("Chinese text gets break opportunities between words", () => {
  const groups = toGroups(toUnits(["我的工作落在运营、技术与战略的交汇处——连接团队，并清除那些悄悄拖慢业务的重复性工作。"])).filter((g) => g[0].kind !== "space");
  expect(groups.length).toBeGreaterThan(8);
  for (const g of groups) expect(text(g).length, text(g)).toBeLessThanOrEqual(8);
});

test("Chinese punctuation never starts a group", () => {
  const groups = toGroups(toUnits(["构建", { text: "他们真正需要的工具", href: "#projects" }, "，并清除那些重复性工作。"]));
  for (const g of groups) expect(text(g)).not.toMatch(/^[，。、：；！？）]/);
  expect(groups.some((g) => text(g) === "他们真正需要的工具，")).toBe(true);
});

test("English links stay glued to trailing punctuation", () => {
  const groups = toGroups(toUnits(["I run ", { text: "Northwind", href: "#" }, ", a small studio."]));
  expect(groups.map(text)).toContain("Northwind,");
  expect(groups.map(text)).toContain("studio.");
});

test("a list of links joined by Chinese punctuation can wrap between links", () => {
  const groups = toGroups(
    toUnits(["打造工具与教学材料：", { text: "工作流自动化", project: "a" }, "、", { text: "Tree Monitoring", project: "b" }, "、", { text: "CAD Converter", project: "c" }, "。"]),
  );
  expect(groups.map(text)).toEqual(expect.arrayContaining(["工作流自动化、", "Tree Monitoring、", "CAD Converter。"]));
});
