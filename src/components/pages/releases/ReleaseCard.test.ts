import { experimental_AstroContainer } from "astro/container";
import { describe, expect, it, beforeAll } from "vitest";
import ReleaseCard from "./ReleaseCard.astro";
import type { Release } from "@utils/releases";

let container: InstanceType<typeof experimental_AstroContainer>;

beforeAll(async () => {
  container = await experimental_AstroContainer.create();
});

describe("ReleaseCard", () => {
  it("renders release details and HTML description", async () => {
    const release: Release = {
      tag: "v1.2.3",
      name: "Test Release",
      year: 2024,
      publishedAt: "2024-01-02T00:00:00.000Z",
      descriptionHTML: "<p>Details about the release</p>",
    };

    const html = await container.renderToString(ReleaseCard, { props: { release } });
    const dom = new DOMParser().parseFromString(String(html), "text/html");

    expect(dom.querySelector("h2")?.textContent).toBe(release.name);
    expect(dom.querySelector(".text-sm")?.textContent).toBe(
      new Date(release.publishedAt).toUTCString(),
    );
    expect(dom.querySelector("p")?.textContent).toBe("Details about the release");
  });
});
