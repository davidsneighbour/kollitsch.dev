import { createReleaseConfig } from "@dnbhq/release-config";
import type { Config } from "release-it";

type CommitInput = { type?: string; notes?: unknown[] };

const config = createReleaseConfig({
  scopes: {
    minorTypes: ["feat", "content", "prompt", "instructions", "skill"],
  },
  hooks: {
    'before:git:release': [
      'if [ -f CITATION.cff ]; then last_commit=$(git rev-parse HEAD); release_date=$(date +%F); sed -Ei "s/^commit: .*/commit: $last_commit/" CITATION.cff; sed -Ei "s/^version: .*/version: ${version}/" CITATION.cff; sed -Ei "s/^date-released: .*/date-released: $release_date/" CITATION.cff; git add CITATION.cff; fi',
    ],
  },
});

const changelogPlugin = (config.plugins as Record<string, Record<string, unknown>>)[
  "@release-it/conventional-changelog"
];

changelogPlugin.whatBump = function (commits: CommitInput[]) {
  let level: 2 | 1 | 0 | null = null;

  for (const commit of commits) {
    const notes = Array.isArray(commit.notes) ? commit.notes : [];
    const type = typeof commit.type === "string" ? commit.type : "";

    if (notes.length > 0) {
      return { level: 0, reason: "There are BREAKING CHANGES." };
    }

    if (type === "feat" || type === "content") {
      level = 1;
      continue;
    }

    if (
      level === null &&
      ["fix", "build", "chore", "ci", "docs", "perf", "refactor", "revert", "style", "test"].includes(type)
    ) {
      level = 2;
    }
  }

  if (level === null) {
    return false;
  }

  return {
    level,
    reason: level === 1 ? "There are feat/content commits." : "There are patch-level changes.",
  };
};

export default config as Config;
