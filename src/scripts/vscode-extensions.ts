import { execSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const args = process.argv.slice(2);
const fix = args.includes('--fix');

const workspaceRoot = process.cwd();
const extensionsJsonPath = resolve(workspaceRoot, '.vscode/extensions.json');

function getList(command: string): string[] {
  try {
    const output = execSync(command, { encoding: 'utf8' });
    return output
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

function getEnabledExtensions(): string[] {
  return getList('code --list-extensions --show-versions')
    .filter((line) => !line.includes('[Disabled]'))
    .map((line) => line.split('@')[0]);
}

function getInstalledExtensions(): string[] {
  return getList('code --list-extensions');
}

function loadRecommendations(): {
  recommendations: string[];
  unwantedRecommendations?: string[];
} {
  if (!existsSync(extensionsJsonPath)) {
    return { recommendations: [] };
  }

  try {
    const raw = readFileSync(extensionsJsonPath, 'utf8');
    const json = JSON.parse(raw);
    return {
      recommendations: Array.isArray(json.recommendations)
        ? json.recommendations
        : [],
      unwantedRecommendations: Array.isArray(json.unwantedRecommendations)
        ? json.unwantedRecommendations
        : [],
    };
  } catch {
    return { recommendations: [] };
  }
}

function writeRecommendations(
  recommendations: string[],
  unwanted: string[] = [],
) {
  const output = {
    recommendations: [...new Set(recommendations)].sort(),
    unwantedRecommendations: unwanted,
  };

  writeFileSync(extensionsJsonPath, JSON.stringify(output, null, 2));
}

function main() {
  const enabled = getEnabledExtensions();
  const installed = getInstalledExtensions();
  const { recommendations, unwantedRecommendations } = loadRecommendations();

  const enabledNotRecommended = enabled.filter(
    (ext) => !recommendations.includes(ext),
  );
  const recommendedButDisabled = recommendations.filter(
    (ext) => !enabled.includes(ext),
  );
  const disabled = installed.filter((ext) => !enabled.includes(ext));

  console.log('\n🧩 Enabled extensions (not in recommendations):');
  if (enabledNotRecommended.length) {
    console.log(enabledNotRecommended.join('\n'));
  } else {
    console.log('✔ All enabled extensions are recommended.');
  }

  console.log('\n🗑  Recommended extensions (not installed or disabled):');
  if (recommendedButDisabled.length) {
    console.log(recommendedButDisabled.join('\n'));
  } else {
    console.log('✔ All recommended extensions are enabled.');
  }

  console.log('\n💤 Disabled extensions (installed but not enabled):');
  if (disabled.length) {
    console.log(disabled.join('\n'));
  } else {
    console.log('✔ No disabled extensions found.');
  }

  if (fix) {
    const updatedRecommendations = [
      ...new Set([...recommendations, ...enabled]),
    ];
    writeRecommendations(updatedRecommendations, unwantedRecommendations ?? []);
    console.log('\n✅ Workspace recommendations updated.');
  }
}

main();
