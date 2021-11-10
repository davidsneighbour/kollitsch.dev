#!/usr/bin/env bash

REQUIRED_TOOLS=(
  hugo
  npm
  export
)

for TOOL in "${REQUIRED_TOOLS[@]}"; do
  if ! command -v "${TOOL}" >/dev/null; then
    echo "${TOOL} is required... "
    exit 1
  fi
done

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
    --buildDrafts --buildExpired --buildFuture \
    --watch \
    --enableGitInfo \
    --forceSyncStatic \
    --log true --logFile hugo.log \
    --verbose \
    --verboseLog \
    --debug \
    --meminterval 5s \
    --memstats hugo_memory.log \
    --print-mem \
    --bind 192.168.1.201 \
    --port 1313 \
    --baseURL http://192.168.1.201
