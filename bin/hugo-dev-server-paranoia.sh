#!/usr/bin/env bash

REQUIRED_TOOLS=(
  hugo
  npm
)

for TOOL in "${REQUIRED_TOOLS[@]}"; do
  if ! command -v "${TOOL}" >/dev/null; then
    echo "${TOOL} is required... "
    exit 1
  fi
done

# cleanup hugo loggin
npm run clean:hugo

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
