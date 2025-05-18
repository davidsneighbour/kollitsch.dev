#!/bin/bash
# shellcheck shell=bash
# shellcheck disable=SC2016,SC2250

# Generates a TODO list in Markdown format from all files in a folder, ignoring .gitignore paths
# Usage: generate_todo_list <directory> [output_file]

generate_todo_list() {
  local dir="${1:-.}"
  local output_file="${2:-TODO_LIST.md}"
  local gitignore="${dir}/.gitignore"
  local temp_file
  temp_file=$(mktemp)

  if [[ ! -d "${dir}" ]]; then
    echo "✖ Directory '${dir}' does not exist."
    return 1
  fi

  echo "ℹ️ Collecting files..."

  # If .gitignore exists, exclude its paths
  if [[ -f "${gitignore}" ]]; then
    echo "ℹ️ Found .gitignore, filtering out ignored paths."
    git -C "${dir}" ls-files --cached --others --exclude-standard > "${temp_file}"
  else
    echo "ℹ️ No .gitignore found. Including all files."
    find "${dir}" -type f > "${temp_file}"
  fi

  # Sorting: Folders first, then files
  sort -f "${temp_file}" | awk '
  {
    if ($0 ~ /\/$/) {
      print "* [ ] " $0
    } else {
      files[NR] = "* [ ] " $0
    }
  }
  END {
    for (i in files) {
      print files[i]
    }
  }' > "${output_file}"

  echo "✅ TODO list saved to ${output_file}"
  rm -f "${temp_file}"
}

generate_todo_list "$@"
