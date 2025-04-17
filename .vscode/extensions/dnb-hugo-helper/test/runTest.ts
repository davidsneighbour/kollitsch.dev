import * as path from 'path';
import * as os from 'os';
import { runTests } from 'vscode-test';

async function main() {
  try {
    const extensionDevelopmentPath = path.resolve(__dirname, '../../');
    const extensionTestsPath = path.resolve(__dirname, './suite/index');
    // Use a temp folder for user data so tests can run even if you have VS Code open
    const userDataDir = path.join(os.tmpdir(), 'vscode-dnb-hugo-helper-test-user-data');

    await runTests({
      extensionDevelopmentPath,
      extensionTestsPath,
      launchArgs: [
        '--disable-extensions',
        `--user-data-dir=${userDataDir}`,
        '--skip-release-version-check'
      ]
    });
  } catch (err) {
    console.error('❌ Error running tests', err);
    process.exit(1);
  }
}

main();
