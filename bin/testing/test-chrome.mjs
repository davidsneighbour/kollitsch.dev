import { exec } from "child_process";
import cypress from 'cypress';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import config from './config.json' assert { type: 'json' };
import { createLogger, transports, format } from 'winston';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const logfile = path.join(__dirname, 'lastrun.log');
if (fs.existsSync(logfile)) {
  fs.unlink(logfile, (error) => {
    console.log(`Error removing lastrun.log`);
    throw error;
  });
};

// Setup logger
const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',  // Configurable log level
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: path.join(__dirname, 'error.log'), tailable: true, lazy: true, level: 'error' }),
    new transports.File({ filename: logfile, tailable: true, lazy: true, level: 'info' }),
  ]
});

const { releases, cypressConfigPath } = config;

const executeCommand = async (command) => {
  // TODO: Validate command string
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        const errorMsg = `Execution error: ${stderr || error.message}`;
        logger.error(`Error executing command: ${error.message}`);
        logger.error(`Stderr: ${stderr}`);
        reject(new Error(errorMsg));
        return;
      }
      logger.info(`Done: ${stdout}`);
      resolve(stdout || stderr);
    });
  });
};

const runTests = async (browser) => {
  try {
    await cypress.run({
      browser: browser,
      configFile: cypressConfigPath
    });
    return true;  // Indicate success
  } catch (error) {
    logger.error(`Error running tests: ${error.message}`);
    throw error;
  }
};

const processRelease = async (release) => {
  try {
    logger.info(`Downloading Chrome ${release}...`);
    const process = `npx @puppeteer/browsers install chrome@${release}`;
    const result = await executeCommand(process);  // Changed let to const

    const browserVersion = result.substring(0, result.indexOf(' '));
    logger.info(`Running Tests with ${browserVersion}...`);
    const browser = path.join('.', 'chrome', `linux-${browserVersion}`, 'chrome-linux64', 'chrome');  // Using path module
    return await runTests(browser);  // Return success indicator
  } catch (error) {
    logger.error(`Error processing ${release} release: ${error.message}`);
    throw error;
  }
};

export const main = async () => {
  try {
    const results = await Promise.all(releases.map(release => processRelease(release)));
    // TODO: Process results if necessary
  } catch (error) {
    logger.error(`Error: ${error.message}`);
  }
};

main();
