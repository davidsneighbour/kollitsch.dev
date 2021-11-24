#!/usr/bin/env bash

# shellcheck disable=SC2039
REQUIRED_TOOLS=(
  npm
)

for TOOL in "${REQUIRED_TOOLS[@]}"; do
  if ! command -v "${TOOL}" >/dev/null; then
    echo "${TOOL} is required... "
    exit 1
  fi
done

# link npm configuration packages to local development version
# note, they need to be initialised globally by running `npm link`
# inside of the development package directory (for each package)
# npm link @dnb-org/babel-config \
#   @dnb-org/bootstrap-config \
#   @dnb-org/browserslist-config \
#   @dnb-org/commitlint-config \
#   @dnb-org/cssnano-config \
#   @dnb-org/cypress-config \
#   @dnb-org/eslint-config \
#   @dnb-org/postcss-config \
#   @dnb-org/prettier-config \
#   @dnb-org/standard-version-config \
#   @dnb-org/stylelint-config \
#   @dnb-org/tools \
#   @dnb-org/webpack-config
rm -rf node_modules/@dnb-org
ln -s /home/patrick/Projects/dnb-org/configurations/packages ./node_modules/@dnb-org
