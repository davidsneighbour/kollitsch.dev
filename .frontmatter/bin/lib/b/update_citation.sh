#!/bin/bash

# update version and release date in CITATION.cff
# @param $1 (optional) Version string (e.g., "1.0.0"). If not provided, version is extracted from package.json.
update_citation() {
  # Use externally defined verbose variable, default to 'false' if not set
  local is_verbose="${verbose:-false}"
  local version="${1:-}"
  local file="CITATION.cff"
  local date_released

  # If version is not provided, extract it from package.json
  if [ -z "$version" ]; then
    if [ -f "./package.json" ]; then
      version=$(node -pe 'require("./package.json")["version"]')
      if [ "$is_verbose" == "true" ]; then
        echo "Extracted version from package.json: ${version}"
      fi
    else
      [ "$is_verbose" == "true" ] && echo "Note: package.json not found, and no version provided."
      return 0
    fi
  fi

  # Check if CITATION.cff exists
  if [ ! -f "$file" ]; then
    [ "$is_verbose" == "true" ] && echo "Note: No CITATION.cff found, skipping update."
    return 0
  fi

  # Update version and date in CITATION.cff
  if [ "$is_verbose" == "true" ]; then
    echo "Updating $file with version ${version}"
  fi
  sed -i "s/^version: .*/version: ${version}/" "$file"
  date_released=$(date +%F)
  sed -i "s/date-released: .*/date-released: ${date_released}/" "$file"
  commit_hash=$(git rev-parse --verify HEAD)
  sed -i "s/commit: .*/commit: ${commit_hash}/" "$file"

  # Stage the file for git commit
  git add "$file"

  # Success message
  if [ "$is_verbose" == "true" ]; then
    echo "$file updated with version ${version}, commit hash ${commit_hash}, and release date ${date_released}."
  fi
}
