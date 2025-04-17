import Mocha from 'mocha';
import { glob } from 'glob';
import * as path from 'path';

export async function run(): Promise<void> {
  const mocha = new Mocha({ ui: 'tdd', timeout: 10000 });
  const testsRoot = path.resolve(__dirname);

  // Find all compiled test files in this suite directory
  const files = await glob('**/*.test.js', { cwd: testsRoot });
  for (const file of files) {
    mocha.addFile(path.resolve(testsRoot, file));
  }

  // Run Mocha programmatically and await completion
  await new Promise<void>((resolve, reject) => {
    try {
      mocha.run((failures: number) => {
        failures ? reject(new Error(`${failures} tests failed.`)) : resolve();
      });
    } catch (err) {
      reject(err);
    }
  });
}
