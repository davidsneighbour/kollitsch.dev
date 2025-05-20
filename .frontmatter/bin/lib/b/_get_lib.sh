#!/bin/bash

# Function to source all library files in the same directory as this script
get_lib() {
  # Get the directory of this script
  local lib_dir
  lib_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

  # Use externally defined verbose variable, default to 'false' if not set
  local is_verbose="${verbose:-false}"

  # Check if the library directory exists
  if [ -d "${lib_dir}" ]; then
    # Optionally display the library path being loaded
    if [ "${is_verbose}" == "true" ]; then
      echo "Loading library files from: ${lib_dir}"
    fi

    # Loop through and source all .sh files in the library directory
    for lib_file in "${lib_dir}"/*.sh; do
      # Exclude this script from being sourced
      if [ "${lib_file}" != "${BASH_SOURCE[0]}" ] && [ -f "${lib_file}" ]; then
        if [ "${is_verbose}" == "true" ]; then
          echo "Sourcing: ${lib_file}"
        fi
        # shellcheck source=/dev/null
        source "${lib_file}"
      fi
    done
  else
    echo "Library directory not found: ${lib_dir}" >&2
    return 1
  fi
}

get_lib
