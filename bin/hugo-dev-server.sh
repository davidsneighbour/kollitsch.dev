#!/usr/bin/env bash

# shellcheck shell=bash
REQUIRED_TOOLS=(
  hugo
  npm
  export
  trap
)

for TOOL in "${REQUIRED_TOOLS[@]}"; do
  if ! command -v "${TOOL}" >/dev/null; then
    echo "${TOOL} is required... "
    exit 1
  fi
done

trap "{ echo 'Terminated with Ctrl+C'; }" SIGINT

FILE=.env
if [ -f "$FILE" ]; then
  echo "exporting .env"
  set -a
  # shellcheck source=/dev/null
  source "${FILE}"
  set +a
fi

# cleanup hugo logging
npm run clean:hugo

# update modules
hugo mod get -u ./...

# starting hugo server
hugo server \
    --gc \
    --environment development \
    --disableFastRender \
    --i18n-warnings \
    --navigateToChanged \
    --templateMetrics \
    --templateMetricsHints \
    --path-warnings \
    --poll 1s \
    --cleanDestinationDir \
    --renderToDisk \
    --buildFuture \
    --watch \
    --enableGitInfo \
    --forceSyncStatic \
    --log true --logFile hugo.log \
    --verbose \
    --verboseLog \
    --port "${PORT}" \
    --baseURL http://"${IP}"/ \
    --bind "${IP}"

# TODO --buildDrafts --buildExpired on request
