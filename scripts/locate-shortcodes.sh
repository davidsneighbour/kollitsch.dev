#!/bin/bash

# usage:
#   ./find-shortcode-usage.sh --shortcodes-folder=<folder> --content-folder=<folder>
#   ./find-shortcode-usage.sh --content-folder=<folder> --shortcode=<shortcode>
#   ./find-shortcode-usage.sh --help

show_help() {
  echo "Usage:"
  echo "  ${FUNCNAME[0]} --shortcodes-folder=<folder> --content-folder=<folder>"
  echo "  ${FUNCNAME[0]} --content-folder=<folder> --shortcode=<shortcode>"
  echo
  echo "Options:"
  echo "  --shortcodes-folder  Folder containing Hugo shortcodes (e.g., layouts/shortcodes)"
  echo "  --content-folder     Folder containing Hugo content (e.g., content/)"
  echo "  --shortcode          Single shortcode name to search for in content (e.g., foobar)"
  echo "  --help               Show this help message"
}

list_shortcodes_and_usage() {
  local shortcodes_folder="${1}"
  local content_folder="${2}"

  local shortcode_names
  mapfile -t shortcode_names < <(find "${shortcodes_folder}" -maxdepth 1 -type f -name '*.html' -exec basename {} .html \;)

  echo "=== Task 1: Files using any shortcode ==="
  local used_files=()
  for shortcode in "${shortcode_names[@]}"; do
    mapfile -t matches < <(grep -rl "{{< *${shortcode}\b" "${content_folder}")
    used_files+=("${matches[@]}")
  done

  printf "%s\n" "${used_files[@]}" | sort -u

  echo
  echo "=== Task 2: Unused shortcodes ==="
  for shortcode in "${shortcode_names[@]}"; do
    if ! grep -qr "{{< *${shortcode}\b" "${content_folder}"; then
      echo "${shortcode}"
    fi
  done
}

search_single_shortcode() {
  local content_folder="${1}"
  local shortcode="${2}"

  echo "=== Files using shortcode '${shortcode}' ==="
  grep -rl "{{< *${shortcode}\b" "${content_folder}" || echo "No files found using shortcode '${shortcode}'"
}

main() {
  local shortcodes_folder=""
  local content_folder=""
  local single_shortcode=""

  for arg in "$@"; do
    case "${arg}" in
    --shortcodes-folder=*)
      shortcodes_folder="${arg#*=}"
      ;;
    --content-folder=*)
      content_folder="${arg#*=}"
      ;;
    --shortcode=*)
      single_shortcode="${arg#*=}"
      ;;
    --help)
      show_help
      exit 0
      ;;
    *)
      echo "Unknown argument: ${arg}"
      show_help
      exit 1
      ;;
    esac
  done

  if [[ -n "${single_shortcode}" && -n "${content_folder}" ]]; then
    search_single_shortcode "${content_folder}" "${single_shortcode}"
    exit 0
  fi

  if [[ -n "${shortcodes_folder}" && -n "${content_folder}" ]]; then
    list_shortcodes_and_usage "${shortcodes_folder}" "${content_folder}"
    exit 0
  fi

  show_help
  exit 1
}

main "$@"
