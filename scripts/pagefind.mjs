import * as pagefind from "pagefind";

/**
 * Pagefind index for search functionality.
 *
 * @todo configurability
 */
async function buildPagefindIndex() {
  const { index } = await pagefind.createIndex({
    rootSelector: "html",
    verbose: true,
    logfile: "logs/pagefind.log",
  });

  if (index) {
    await index.addDirectory({
      path: "public",
    });
    await index.writeFiles({
      outputPath: "public/search",
    });
  }
}

await buildPagefindIndex();

await pagefind.close();

// #!/usr/bin / env node

// import { execSync, spawnSync } from 'child_process';
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import dotenv from 'dotenv';

// // current working directory and file paths
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const CURPATH = process.cwd();

// /**
//  * Check if required tools are available.
//  * Exits the process if any tool is missing.
//  */
// function checkRequiredTools() {
//   const tools = ['hugo', 'git', 'npm'];
//   const missingTools = tools.filter(tool => {
//     try {
//       execSync(`command -v ${tool}`);
//       return false;
//     } catch {
//       return true;
//     }
//   });

//   if (missingTools.length > 0) {
//     console.error(`Missing required tools: ${missingTools.join(', ')}`);
//     process.exit(1);
//   }
// }

// /**
//  * Load environment variables from a `.env` file if it exists.
//  */
// function loadEnvVariables() {
//   const envFile = path.join(CURPATH, '.env');
//   if (fs.existsSync(envFile)) {
//     dotenv.config({ path: envFile });
//   }
// }

// /**
//  * Pagefind index for search functionality.
//  */
// async function buildPagefindIndex() {
//   const { index } = await pagefind.createIndex({
//     rootSelector: "html",
//     verbose: true,
//     logfile: "debug.log"
//   });

//   if (index) {
//     await index.addDirectory({
//       path: "public"
//     });
//     await index.writeFiles({
//       outputPath: "public/search"
//     });
//   }
// }

// /**
//  * Main function to orchestrate the steps.
//  */
// async function main() {
//   checkRequiredTools();
//   loadEnvVariables();
//   await buildPagefindIndex();
// }

// main();
