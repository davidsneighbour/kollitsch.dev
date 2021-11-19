#!/usr/bin/env bash

# see discourse.gohugo.io/t/audit-your-published-site-for-problems/35184
#
# <!-- raw HTML omitted -->
# By default, Hugo strips raw HTML from your markdown prior to rendering,
# and leaves this HTML comment in its place.
#
# ZgotmplZ
# ZgotmplZ is a special value that indicates that unsafe content reached
# a CSS or URL context at runtime.
# For more information see https://pkg.go.dev/html/template.
#
# HAHAHUGO
# Under conditions too complex to explain in this article, a rendered
# shortcode may include all or a portion of the string HAHAHUGOSHORTCODE
# in either uppercase or lowercase. This is difficult to detect in all
# cicumstances because, depending on a variety of factors, the rendered
# shortcode may include H, HA, HAH, HAHA, HAHAH, HAHAHU, HAHAHUG,
# HAHAHUGO, etc. A case-insensitive search of the output for HAHAHUGO is
# likely to catch the majority of cases without producing false positives.
#
# [i18n]
# This is the placeholder produced instead of the default value or an
# empty string if a translation is missing.
#
# (<nil>)
# This string will appear in the rendered HTML when passing a nil value
# to the printf function.
#
# (&lt;nil&gt;)
# Same as above when the value returned from the printf function has not
# been passed through safeHTML.

REQUIRED_TOOLS=(
  hugo
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

HUGO_MINIFY_TDEWOLFF_HTML_KEEPCOMMENTS=true \
  HUGO_ENABLEMISSINGTRANSLATIONPLACEHOLDERS=true \
  hugo && \
  grep -inorE "<\!-- raw HTML omitted -->|ZgotmplZ|hahahugo|\[i18n\|\(<nil>\)|(&lt;nil&gt;)]" public/
