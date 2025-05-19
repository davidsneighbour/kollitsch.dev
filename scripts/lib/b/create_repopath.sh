#!/bin/bash

# build a GitHub repository string "username/reponame"
# Uses the GITHUB_USER environment variable for the username
# @returns The GitHub repository string in the GITHUB_REPOSLUG variable
create_repopath() {
  # Use externally defined verbose variable, default to 'false' if not set
  local is_verbose="${verbose:-false}"

  # Ensure GITHUB_USER is set
  if [ -z "$GITHUB_USER" ]; then
    echo "Error: GITHUB_USER environment variable is not set."
    return 1
  fi

  # Get the root folder name of the git repository
  local repo_root
  repo_root="$(git rev-parse --show-toplevel 2>/dev/null)"
  if [ -z "$repo_root" ]; then
    echo "Error: This is not a git repository."
    return 1
  fi

  # Extract the repository name from the root folder
  local repo_name
  repo_name="$(basename "$repo_root")"

  # Combine GITHUB_USER and repo_name into the desired format
  GITHUB_REPOSLUG="${GITHUB_USER}/${repo_name}"

  # Handle success or failure based on verbose flag
  if [ $? -eq 0 ]; then
    if [ "$is_verbose" == "true" ]; then
      echo "GitHub repository string: $GITHUB_REPOSLUG"
    fi
  else
    echo "Failed to build GitHub repository string."
    return 1
  fi
}
