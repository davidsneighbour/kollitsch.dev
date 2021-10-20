#!/usr/bin/env bash

# see https://discourse.gohugo.io/t/audit-your-published-site-for-problems/35184

rm -rf public
HUGO_MINIFY_TDEWOLFF_HTML_KEEPCOMMENTS=true \
HUGO_ENABLEMISSINGTRANSLATIONPLACEHOLDERS=true \
hugo && grep -inorE "<\!-- raw HTML omitted -->|ZgotmplZ|hahahugo|\[i18n\]" public/
