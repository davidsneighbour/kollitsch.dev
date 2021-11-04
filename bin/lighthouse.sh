#!/usr/bin/env bash

REQUIRED_TOOLS=(
  npm
  lighthouse
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

lighthouse \
  --budget-path=tests/lighthouse/budget.json \
  --config-path=tests/lighthouse/config.js \
  --output "html" "csv" "json" \
  --output-path=tests/lighthouse/reports/"$(date +"%Y%m%d-%H%M%S")" \
  --view \
  http://"${IP}":"${PORT}"
