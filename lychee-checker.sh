#!/bin/bash

# lychee-checker.sh
# Run lychee per file and show broken links grouped by file

print_help() {
  echo "Usage: $(basename "$0") [--dir <directory>] [--ext <ext1,ext2,...>] [--verbose] [--help]"
  echo
  echo "Options:"
  echo "  --dir       Directory to scan (default: content/)"
  echo "  --ext       File extensions to check (comma-separated, default: md,mdx)"
  echo "  --verbose   Show lychee output even when there are no broken links"
  echo "  --help      Show this help message"
}

main() {
  local dir="content"
  local extensions="md,mdx"
  local verbose=false

  while [[ $# -gt 0 ]]; do
    case "$1" in
    --dir)
      dir="$2"
      shift 2
      ;;
    --ext)
      extensions="$2"
      shift 2
      ;;
    --verbose)
      verbose=true
      shift
      ;;
    --help)
      print_help
      exit 0
      ;;
    *)
      echo "Unknown parameter: $1"
      print_help
      exit 1
      ;;
    esac
  done

  IFS=',' read -r -a ext_array <<<"$extensions"

  echo "Scanning directory: ${dir}"
  echo "Checking extensions: ${extensions}"
  echo

  # Build correct `find` expression
  find_expr=()
  find_expr+=('(')
  for ext in "${ext_array[@]}"; do
    find_expr+=(-name "*.${ext}" -o)
  done
  unset 'find_expr[${#find_expr[@]}-1]' # remove trailing -o
  find_expr+=(')')

  while IFS= read -r -d '' file; do
    echo "🔍 Checking: ${file}"
    output=$(lychee --no-progress --no-color "$file" 2>&1)
    if echo "$output" | grep -q "✗"; then
      echo "❌ Broken links in: $file"
      echo "$output" | grep "✗"
      echo
    elif [[ "${verbose}" == true ]]; then
      echo "✅ OK: $file"
    fi
  done < <(find "$dir" -type f "${find_expr[@]}" -print0)
}

main "$@"
