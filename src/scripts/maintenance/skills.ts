import { spawnSync } from "node:child_process";

const [, , command, ...args] = process.argv;

const commands: Record<string, string[]> = {
    add: ["add", ...args, "--yes", "--agent", "codex"],
    install: ["experimental_install", ...args, "--agent", "codex"],
    list: ["ls", "--json", ...args],
    sync: ["experimental_sync", ...args, "--yes", "--agent", "codex"],
    update: ["update", ...args, "--project", "--yes"],
};

if (!command || !(command in commands)) {
    console.error("Usage: node src/scripts/maintenance/skills.ts <add|install|list|sync|update> [...args]");
    process.exit(1);
}

const result = spawnSync("npx", ["skills", ...commands[command]], {
    stdio: "inherit",
});

if (result.error) {
    console.error(result.error.message);
    process.exit(1);
}

process.exit(result.status ?? 1);
