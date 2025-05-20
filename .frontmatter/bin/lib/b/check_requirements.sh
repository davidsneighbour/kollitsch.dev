#!/bin/bash

# check for required tools
# @param $1 Array of required tool names
check_requirements() {
  local tools=("$@") # Accepts an array of tool names as arguments

  # Show a message if no tools are specified
  if [ ${#tools[@]} -eq 0 ]; then
    echo "Note: No tools specified for checking."
    return 0
  fi

  for tool in "${tools[@]}"; do
    if ! command -v "${tool}" >/dev/null 2>&1; then
      echo "Error: ${tool} is required but not installed or not in PATH."
      exit 1
    fi
  done
}

# Example usage
#
# REQUIRED_TOOLS=(
#   curl
#   sed
#   git
# )
# check_requirements "${REQUIRED_TOOLS[@]}"
