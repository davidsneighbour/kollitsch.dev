#!/bin/bash

# load and export environment variables from .env files
# @param $1 (optional) verbosity flag: 'true' for verbose output, 'false' (default) for silent mode
load_env() {
  local verbose="${1:-false}" # Default to non-verbose output if not specified
  local cur_path
  cur_path="$(pwd -P)"

  # Array of .env file paths in order of loading (home first, then local)
  local env_files=("$HOME/.env" "$cur_path/.env")

  for env_file in "${env_files[@]}"; do
    if [ -f "$env_file" ]; then
      if [ "$verbose" == "true" ]; then
        echo "Exporting environment variables from $env_file"
      fi
      set -a
      # shellcheck source=/dev/null
      source "$env_file"
      set +a
    else
      if [ "$verbose" == "true" ]; then
        echo "No $env_file file found, skipping."
      fi
    fi
  done

  # If '--help' was passed, show usage instructions
  if [ "$1" == "--help" ]; then
    echo "Usage: load_env [verbose]"
    echo "  Loads environment variables from .env files in the home directory and current project directory."
    echo "  Global variables from the home .env file are loaded first, then overridden by the local .env file."
    echo "  Parameters:"
    echo "    verbose - Set to 'true' for detailed output, or 'false' (default) for silent mode."
  fi
}

# Example usage (uncomment the line below to auto-run in a script):
# Default (silent): `load_env`
# Verbose mode: `load_env true`
# Show usage: `load_env --help`
