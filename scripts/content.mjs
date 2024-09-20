// @see https://github.com/natemoo-re/clack/tree/main/packages/prompt
import {
  intro,
  outro,
  select,
  spinner,
  isCancel,
  cancel,
  text,
} from '@clack/prompts';

// see https://github.com/unjs/consola
import { consola, createConsola } from "consola";

import { exec as exec } from 'node:child_process';
import fs from 'node:fs';
import toml from 'toml';
import path from 'node:path';

import { fileURLToPath } from 'node:url';

// Read TOML config file
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const configPath = path.resolve(__dirname, 'content.toml');
let config;
try {
  const configFile = fs.readFileSync(configPath, 'utf8');
  config = toml.parse(configFile);
} catch (err) {
  consola.error(`Error reading TOML config file: ${err}`);
  process.exit(0);
}

async function prepareSlug(title) {
  const slug_pre = title.replace(/\s+/g, '-').toLowerCase();
  const slug = slug_pre.replace(/[^a-zA-Z0-9\-]/g, '');
  return slug;
}

/**
 * Increments a counter in a JSON file.
 * @param {string} filename - The path to the JSON file.
 * @returns {Promise<number>} - A promise that resolves with the incremented counter value.
 */
async function incrementCounter(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        reject(err);
        return;
      }
      let jsonData = JSON.parse(data);
      let number = jsonData.latest;
      let increment = number + 1;
      jsonData.latest = increment;
      fs.writeFile(filename, JSON.stringify(jsonData, null, 2), (err) => {
        if (err) {
          consola.error(err);
          reject(err);
          return;
        }
        resolve(increment);
      });
    });
  });
}

// Function to handle file reading errors
function handleFileReadError(err, filename) {
  consola.error(`Error reading file '${filename}': ${err}`);
  cancel(`An error occurred while reading file '${filename}': ${err}`);
  process.exit(0);
}

// Function to handle file write errors
function handleFileWriteError(err, filename) {
  consola.error(`Error writing to file '${filename}': ${err}`);
  cancel(`An error occurred while writing to file '${filename}': ${err}`);
  process.exit(0);
}

// Function to handle command execution errors
function handleCommandExecutionError(err, command) {
  consola.error(`Error executing command '${command}': ${err}`);
  cancel(`An error occurred while executing command '${command}': ${err}`);
  process.exit(0);
}

// Validate title or slug input
function validateTitleOrSlug(value, errorMessage) {
  if (!value.trim()) {
    return errorMessage;
  }
  // You can add more validation rules here if needed
}

async function main() {

  let command, command2, title, slug, post;
  const date = new Date();
  const year = date.getFullYear();
  const spin = spinner();

  intro('Create content:');

  const quitOption = [{ value: "quit", label: "Quit" }];

  // Merge the config.contentOptions array with the quitOption array
  const mergedOptions = [...config.contentOptions, ...quitOption];

  const contentType = await select({
    message: 'Pick a content type.',
    options: mergedOptions
  });

  if (isCancel(contentType)) {
    cancel('Operation cancelled');
    return process.exit(0);
  };

  switch (contentType) {

    case 'quit':

      outro('Operation cancelled');
      return process.exit(0);

    default:

      const itemContentOptions = config.contentOptions.find(
        (/** @type {{ value: any; }} */ option) => option.value === contentType
      );

      const {
        kind,
        path: contentPath,
        customSlug = true,
        counter = false,
        labels = {
          title: 'Post Slug (special characters will be removed):',
          titleError: 'Slug is required, doh!',
        },
      } = itemContentOptions;

      if (customSlug) {
        title = await text({
          message: labels.title,
          validate(value) {
            if (value.length === 0) return labels.titleError;
          }
        });
        slug = await prepareSlug(title);
      }

      let postPath = contentPath.replace('${year}', year).replace('${slug}', slug);

      if (counter) {
        const counterInt = await incrementCounter(counter);
        postPath = postPath.replace('${counter}', counterInt);
      }

      command = `hugo new --kind ${kind} ${postPath}`;
      command2 = `code content/${postPath}/index.md`;

      break;

  }

  spin.start('Creating content files...');

  await /** @type {Promise<void>} */(new Promise((resolve, _reject) => {
    exec(command, function (error, _stdout, stderr) {
      if (error) {
        consola.error(error);
        cancel(`An error occured: ${error}`);
        process.exit(0);
      }
      if (stderr) {
        consola.error(stderr);
        cancel(`An error occured: ${stderr}`);
        process.exit(0);
      }
      resolve();
    });
  }));

  spin.stop('Content created. Opening in VS Code...');

  await /** @type {Promise<void>} */(new Promise((resolve, _reject) => {
    exec(command2, function (error, _stdout, stderr) {
      if (error) {
        consola.error(error);
        cancel(`An error occured: ${error}`);
        process.exit(0);
      }
      if (stderr) {
        consola.error(stderr);
        cancel(`An error occured: ${stderr}`);
        process.exit(0);
      }
      resolve();
    });
  }));

  outro('All done :]');
  process.exit(1);

}

main().catch(consola.error);
