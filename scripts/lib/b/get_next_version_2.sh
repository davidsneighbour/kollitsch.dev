#!/bin/bash

get_next_version2() {
  local increment_type="$1"
  local RE='[^0-9]*\([0-9]*\)[.]\([0-9]*\)[.]\([0-9]*\)\([0-9A-Za-z-]*\)'

  if [ -z "$increment_type" ]; then
    increment_type="patch"
  fi

  local base=$(node -pe 'require("./package.json")["version"]')

  local MAJOR=$(echo $base | sed -e "s#$RE#\1#")
  local MINOR=$(echo $base | sed -e "s#$RE#\2#")
  local PATCH=$(echo $base | sed -e "s#$RE#\3#")

  case "$increment_type" in
  major)
    ((MAJOR += 1))
    ((MINOR = 0))
    ((PATCH = 0))
    ;;
  minor)
    ((MINOR += 1))
    ((PATCH = 0))
    ;;
  patch)
    ((PATCH += 1))
    ;;
  esac

  local NEXT_VERSION="$MAJOR.$MINOR.$PATCH"
  echo "$NEXT_VERSION"
}
