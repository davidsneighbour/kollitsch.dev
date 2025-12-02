import { experimental_AstroContainer } from "astro/container";
import { beforeAll, describe, expect, it } from "vitest";
import GroupNav from "./GroupNav.astro";
import type { Release } from "@utils/releases";
import { getMinorGroups } from "@utils/releases";

let container: InstanceType<typeof experimental_AstroContainer>;

beforeAll(async () => {
  container = await experimental_AstroContainer.create();
});

describe("GroupNav", () => {
  it("lists minor groups with the current selection and latest fallback", async () => {
    const releases: Release[] = [
      {
        tag: "v2.1.1",
        name: "Release 2.1.1",
        year: 2024,
        publishedAt: "2024-04-01T00:00:00.000Z",
        descriptionHTML: "<p>Minor 1</p>",
      },
      {
        tag: "v2.2.0",
        name: "Release 2.2.0",
        year: 2024,
        publishedAt: "2024-05-01T00:00:00.000Z",
        descriptionHTML: "<p>Minor 2</p>",
      },
      {
        tag: "v1.9.0",
        name: "Release 1.9.0",
        year: 2023,
        publishedAt: "2023-09-01T00:00:00.000Z",
        descriptionHTML: "<p>Minor 3</p>",
      },
    ];

    const currentGroup = "v2.2";
    const html = await container.renderToString(GroupNav, {
      props: { all: releases, currentGroup },
    });
    const dom = new DOMParser().parseFromString(String(html), "text/html");
    const options = Array.from(dom.querySelectorAll("option"));

    const expectedGroups = getMinorGroups(releases);
    expect(options.some((option) => option.textContent === "Latest")).toBe(true);
    expect(options.map((option) => option.textContent)).toEqual([
      "Latest",
      ...expectedGroups,
    ]);
    const selected = options.find((option) => option.selected);
    expect(selected?.textContent).toBe(currentGroup);
  });
});
