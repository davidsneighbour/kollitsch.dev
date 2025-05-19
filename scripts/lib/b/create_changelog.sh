#!/bin/bash

# example usage
#
# set verbosity, then call the function
#
# ```
# verbose=true
# create_changelog
# ```

create_changelog() {
  # Use externally defined verbose variable, default to 'false' if not set
  local is_verbose="${verbose:-false}"

  local release_notes
  release_notes=$(npx commit-and-tag-version --dry-run 2>/dev/null | \
    sed -r 's/\x1B\[[0-9;]*[mK]//g' | \
    awk 'BEGIN { flag=0 } /^---$/ { if (flag == 0) { flag=1 } else { flag=2 }; next } flag == 1')

  if [ -n "$release_notes" ]; then
    RELEASE_NOTES="$release_notes"
    echo "$RELEASE_NOTES" >changes.md
    if [ "$is_verbose" == "true" ]; then
      echo "Release notes generated and saved to changes.md:"
      echo "\`\`\`"
      echo "$RELEASE_NOTES"
      echo "\`\`\`"
    fi
    code changes.md
  else
    echo "Error: Failed to generate release notes using commit-and-tag-version."
    return 1
  fi
}

