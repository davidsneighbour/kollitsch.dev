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
  set -a # export all variables created next
  # shellcheck source=.env
  source "${FILE}"
  set +a # stop exporting
fi

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
    --port "${PORT}" \
    --baseURL http://"${IP}"/ \
    --bind "${IP}"
