#!/usr/bin/env bash

REQUIRED_TOOLS=(
  git
)

for TOOL in "${REQUIRED_TOOLS[@]}"; do
  if ! command -v "${TOOL}" >/dev/null; then
    echo "${TOOL} is required... "
    exit 1
  fi
done

git add data/dnb/build/
git commit --amend --no-edit

git push --follow-tags origin main
git push --tags
