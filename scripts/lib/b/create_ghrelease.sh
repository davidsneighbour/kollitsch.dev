#!/bin/bash

# create a GitHub release
# Uses the GITHUB_SECRET and GITHUB_REPOSLUG environment variables
# @param $1 (optional) Version string (e.g., "1.0.0"). If not provided, extracts the version from package.json.
create_ghrelease() {
  # Use externally defined verbose variable, default to 'false' if not set
  local is_verbose="${verbose:-false}"
  local version="${1:-}"
  local tagname

  # Extract version from package.json if not provided
  if [ -z "$version" ]; then
    if [ -f "./package.json" ]; then
      version=$(node -pe 'require("./package.json")["version"]')
      if [ -z "$version" ]; then
        echo "Error: Could not extract version from package.json."
        return 1
      fi
      [ "$is_verbose" == "true" ] && echo "Extracted version from package.json: ${version}"
    else
      echo "Error: package.json not found, and no version provided."
      return 1
    fi
  fi

  # Construct the tag name
  tagname="v${version}"

  # Ensure required environment variables are set
  : "${GITHUB_SECRET:?Environment variable GITHUB_SECRET is not set.}"
  : "${GITHUB_REPOSLUG:?Environment variable GITHUB_REPOSLUG is not set.}"

  # GitHub repository URL
  local github_repo="https://github.com/${GITHUB_REPOSLUG}"

  # Log information in verbose mode
  if [ "$is_verbose" == "true" ]; then
    echo "Creating a GitHub release:"
    echo "  Repository: ${GITHUB_REPOSLUG}"
    echo "  Tag name: ${tagname}"
  fi

  # Make the API call to create the release
  local release_response
  release_response=$(curl \
    -s \
    -X POST \
    -H "Accept: application/vnd.github+json" \
    -H "Authorization: token ${GITHUB_SECRET}" \
    "https://api.github.com/repos/${GITHUB_REPOSLUG}/releases" \
    -d "{ \
        \"tag_name\":\"${tagname}\", \
        \"name\":\"${tagname}\", \
        \"body\":\"Release ${tagname}\", \
        \"generate_release_notes\":true, \
        \"discussion_category_name\":\"Releases\" \
    }")

  # Check if the API call succeeded
  if [[ $? -ne 0 ]]; then
    echo "Error: Failed to create release on GitHub."
    return 1
  fi

  # Save response to a file
  echo "$release_response" >release.json
  if [ "$is_verbose" == "true" ]; then
    echo "GitHub release response saved to release.json."
  fi

  # Extract the URL of the created release
  local release_url="${github_repo}/releases/edit/${tagname}"

  # Open the release for editing, if possible
  if command -v xdg-open >/dev/null; then
    if [ "$is_verbose" == "true" ]; then
      echo "Opening release URL in browser: ${release_url}"
    fi
    xdg-open "${release_url}" &>/dev/null || {
      echo "Warning: Failed to open browser for release editing."
      echo "Manual action required: Open ${release_url} to edit the release."
    }
  else
    echo "Manual action required: Open ${release_url} to edit the release."
  fi

  # Success message
  if [ "$is_verbose" == "true" ]; then
    echo "Release ${tagname} created successfully for repository ${GITHUB_REPOSLUG}."
  fi
}
