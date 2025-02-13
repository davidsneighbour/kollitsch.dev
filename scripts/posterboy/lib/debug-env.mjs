import fs from "fs";
import { homedir } from "os";
import path from "path";
import dotenv from "dotenv";

const userHomeDir = homedir();
const GLOBAL_ENV_PATH = path.join(userHomeDir, ".env");
const LOCAL_ENV_PATH = path.resolve(".env");

function loadEnvFile(filePath) {
  if (fs.existsSync(filePath)) {
    return dotenv.parse(fs.readFileSync(filePath));
  }
  return {};
}

const globalEnv = loadEnvFile(GLOBAL_ENV_PATH); // ~/.env
const localEnv = loadEnvFile(LOCAL_ENV_PATH); // ./env in the current directory

const sources = {
  global: globalEnv,
  local: localEnv,
};

process.env = { ...globalEnv, ...process.env, ...localEnv };

/**
 * Debugs where an environment variable is set by tracing through global, local, and runtime sources.
 * @param {string} variableName - The name of the environment variable to trace.
 * @param {object} sources - An object containing all potential sources of environment variables.
 */
function debugEnvVariable(variableName, sources) {
  const result = {};
  for (const [sourceName, sourceEnv] of Object.entries(sources)) {
    if (sourceEnv.hasOwnProperty(variableName)) {
      result[sourceName] = sourceEnv[variableName];
    }
  }

  if (variableName in process.env) {
    result["runtime"] = process.env[variableName];
  }

  console.log(`Tracing variable "${variableName}":`, result);
}

// Debug specific variables
debugEnvVariable("TUMBLR_CONSUMER_KEY", sources);
debugEnvVariable("TUMBLR_CONSUMER_SECRET", sources);
