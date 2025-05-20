#!/bin/bash

# Function to extract the next version number using commit-and-tag-version
# Sets NEW_VERSION to the next version number without the "v" prefix
get_next_version() {
  # Use externally defined verbose variable, default to 'false' if not set
  local is_verbose="${verbose:-false}"

  # Extract the next version from commit-and-tag-version
  local version_output
  version_output=$(npx commit-and-tag-version --dry-run 2>/dev/null | awk '/tagging release/ {print $NF}' | sed 's/^v//')

  # Check if a version was extracted
  if [ -n "$version_output" ]; then
    NEW_VERSION="$version_output"

    # Verbose logging
    if [ "$is_verbose" == "true" ]; then
      echo "Next version extracted: ${NEW_VERSION}"
    fi
  else
    echo "Error: Failed to extract the next version using commit-and-tag-version."
    return 1
  fi
}

# # Example usage
# # Set verbosity
# verbose=true

# # Call the function
# get_next_version

# # Check and use the NEW_VERSION variable
# if [ -n "$NEW_VERSION" ]; then
#   echo "The next version is: ${NEW_VERSION}"
# else
#   echo "No version number could be determined."
# fi
