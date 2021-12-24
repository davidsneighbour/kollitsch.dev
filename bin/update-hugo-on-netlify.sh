#!/bin/bash

REQUIRED_TOOLS=(
  cat
)

for TOOL in "${REQUIRED_TOOLS[@]}"; do
  if ! command -v "${TOOL}" >/dev/null; then
    echo "${TOOL} is required... "
    exit 1
  fi
done

cat << EOF
[build]
publish = "./public"

[context.production]
command = "./bin/netlify-build.sh"

[context.production.environment]
HUGO_VERSION = "${1/v/""}"
HUGO_ENV = "production"
EOF
