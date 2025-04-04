// see https://github.com/google/jsonnet
// see https://jsonnet.org/ref/language.html
{
  "name": "@davidsneighbour/kollitsch-dev",
  "description": "Website and content for kollitsch.dev",
  "version": "2024.5.44",
  "license": "UNLICENSED",
  "private": true,
  "repository": "davidsneighbour/kollitsch.dev",
  "author": {
    "name": "Patrick Kollitsch",
    "email": "patrick@davids-neighbour.com",
    "web": "https://davids-neighbour.com"
  },
  "homepage": "https://kollitsch.dev",
  "dependencies": {
    "@alpinejs/collapse": "3.14.3",
    "@alpinejs/intersect": "3.14.3",
    "@biomejs/biome": "1.9.4",
    "@clack/prompts": "0.7.0",
    "@davidsneighbour/biome-config": "2024.4.8",
    "@davidsneighbour/bootstrap-config": "2024.4.8",
    "@davidsneighbour/browserslist-config": "2024.4.7",
    "@davidsneighbour/commitlint-config": "2024.4.8",
    "@davidsneighbour/eslint-config": "2024.4.8",
    "@davidsneighbour/frontmatter-config": "2024.4.8",
    "@davidsneighbour/htmlvalidate-config": "2024.4.7",
    "@davidsneighbour/hugo-darkskies": "^1.2024.29",
    "@davidsneighbour/imagemin-lint-staged": "0.6.0",
    "@davidsneighbour/markdownlint-config": "2024.4.8",
    "@davidsneighbour/netlify-plugin-hugo-helper": "0.1.6",
    "@davidsneighbour/postcss-config": "2024.4.8",
    "@davidsneighbour/prettier-config": "2024.4.8",
    "@davidsneighbour/release-config": "2024.4.8",
    "@davidsneighbour/remark-config": "2024.4.8",
    "@davidsneighbour/stylelint-config": "2024.4.8",
    "@davidsneighbour/tools": "2024.4.8",
    "@github/hotkey": "3.1.1",
    "@notionhq/client": "2.2.15",
    "@secretlint/secretlint-rule-preset-recommend": "9.0.0",
    "alpinejs": "3.14.3",
    "caniuse-lite": "1.0.30001677",
    "consola": "3.2.3",
    "dotenv": "16.4.5",
    "lint-staged": "15.2.10",
    "netlify-cli": "17.37.2",
    "ninja-keys": "1.2.2",
    "pixelmatch": "6.0.0",
    "prettier-plugin-go-template": "0.0.15",
    "secretlint": "9.0.0",
    "simple-git-hooks": "2.11.1",
    "toml": "3.0.0",
    "trim": "1.0.1",
    "ts-node": "10.9.2",
    "tsx": "4.19.2",
    "xml2js": "0.6.2",
    "yargs": "17.7.2"
  },
  "scripts": {
    "audit:html": "wireit",
    "build": "wireit",
    "clean": "wireit",
    "clean:full": "wireit",
    "deploy": "wireit",
    "eslint": "eslint . --max-warnings 0 --report-unused-disable-directives --ignore-path .gitignore",
    "eslint-fix": "npm run eslint -- --fix",
    "hooks:update": "simple-git-hooks",
    "lighthouse": "bin/audit/lighthouse",
    "lint": "wireit",
    "lint:hook:commit": "lint-staged",
    "lint:html": "npx html-validate --config=tests/html-validator/config.json public/**/*.html",
    "lint:html:config": "html-validate --print-config=tests/html-validator/config.json",
    "lint:lockfiles": "lockfile-lint --path package-lock.json --type=npm --validate-https --allowed-hosts=npm --empty-hostname=false --validate-package-names --validate-checksum --validate-integrity",
    "lint:remark": "remark content/**/*.md",
    "lint:remark2": "remark .",
    "lint:scripts": "eslint assets/js --ext .js",
    "lint:scripts:fix": "eslint assets/js --ext .js --fix",
    "lint:scripts:inspect": "eslint --inspect-config",
    "lint:styles": "wireit",
    "lint:styles:fix": "wireit",
    "lint:templates": "wireit",
    "lint:vale": "vale --config='.github/vale/vale.ini' --no-exit --output='dnb.tmpl' content",
    "lint:vale:update": "cd .github/vale && vale sync && cd ../..",
    "new": "node scripts/content.mjs",
    "prettier": "prettier 'assets/**/*.js'",
    "prettier:fix": "prettier --write ''assets/**/*.js'",
    "release": "wireit",
    "server": "rm -rf ./public && hugo server trust && hugo config --format json --environment gugin > data/dnb/kollitsch/config.json && hugo server -D -E -F --disableFastRender --environment gugin --verbose --logLevel debug --tlsAuto --baseURL https://localhost/",
    "server2": "rm -rf ./public && hugo server trust && hugo config --format json --environment gugin > data/dnb/kollitsch/config.json && hugo server -D -E -F --disableFastRender --environment gugin --verbose --logLevel debug --baseURL http://localhost/ --panicOnWarning",
    "server:pagefind": "wireit",
    "update": "wireit",
    "tests": "npx playwright test"
  },
  "wireit": {
    "deploy": {
      "dependencies": [
        "release",
        "build:deploy",
        "deploy:netlify",
        "deploy:clearcache"
      ]
    },
    "deploy:netlify": {
      "command": "netlify deploy --prod --open",
      "dependencies": [
        "build"
      ]
    },
    "deploy:netlify:debug": {
      "command": "set DEBUG=* & netlify deploy --prod --open",
      "dependencies": [
        "build"
      ]
    },
    "deploy:clearcache": {
      "command": "node ./scripts/cloudflare-purge.mjs",
      "dependencies": [
        "deploy:netlify"
      ]
    },
    "build": {
      "dependencies": [
        "clean:dist",
        "build:hugoconfig",
        "build:hugo",
        "build:pagefind"
      ]
    },
    "build:deploy": {
      "dependencies": [
        "release",
        "clean:dist",
        "build:hugoconfig",
        "build:hugo",
        "build:pagefind"
      ]
    },
    "build:hugo": {
      "command": "hugo --environment gugin --verbose --logLevel debug --minify",
      "dependencies": [
        "clean:dist",
        "build:hugoconfig"
      ]
    },
    "build:hugoconfig": {
      "command": "hugo config --format json --environment gugin > data/dnb/kollitsch/config.json"
    },
    "build:pagefind": {
      "command": "node ./scripts/pagefind.mjs",
      "dependencies": [
        "build:hugo"
      ]
    },
    "clean": {
      "dependencies": [
        "clean:audit",
        "clean:hugo"
      ]
    },
    "clean:hugo": {
      "command": "rimraf public hugo.log hugo_stats.json assets/jsconfig.json .hugo_build.lock"
    },
    "clean:dist": {
      "command": "rimraf public"
    },
    "clean:wireit": {
      "command": "rimraf .wireit"
    },
    "lint:styles": {
      "command": "stylelint -f verbose --color --report-descriptionless-disables --report-invalid-scope-disables --report-needless-disables theme/assets/**/*.scss"
    },
    "lint:styles:fix": {
      "command": "stylelint --fix --color --report-descriptionless-disables --report-invalid-scope-disables --report-needless-disables theme/assets/**/*.scss"
    },
    "lint:templates": {
      "command": "bin/hugo/lint-templates"
    },
    "release": {
      "command": "commit-and-tag-version --sign -a -t \"v\" --releaseCommitMessageFormat \"chore(release): v{{currentTag}}\" -- --no-verify && ./bin/repo/release/postrelease"
    },
    "audit:html": {
      "command": "npm run build && html-validate public/**/*.html --config=tests/html-validator/config.json"
    },
    "server": {
      "dependencies": [
        "server:hugo",
        "server:pagefind"
      ]
    },
    "server:pagefind": {
      "command": "pagefind ",
      "files": [
        "content/**/*.md"
      ]
    },
    "server:hugo": {
      "dependencies": [
        "server:hugo-certificates"
      ],
      "command": "node bin/hugo/server.js",
      "service": {
        "readyWhen": {
          "lineMatches": "Web Server is available at *"
        }
      }
    },
    "server:hugo-certificates": {
      "command": "hugo server trust"
    },
    "lint": {
      "dependencies": [
        "lint:lockfiles"
      ]
    },
    "update": {
      "dependencies": [
        "update:git-hooks"
      ]
    },
    "update:post": {
      "command": "fixpack && browserslist --update-db",
      "dependencies": [
        "update:pre:npm",
        "update:pre:vale",
        "update:pre:submodules"
      ]
    },
    "update:pre:submodules": {
      "command": "git submodule update --recursive --remote"
    },
    "update:pre:npm": {
      "command": "npm-check-updates -u --target minor"
    },
    "update:pre:vale": {
      "command": "vale --config='.github/vale/vale.ini' --no-exit sync"
    },
    "update:git-hooks": {
      "command": "npx simple-git-hooks",
      "dependencies": [
        "update:post"
      ]
    },
    "clean:full": {
      "command": "rimraf node_modules package-lock.json .wireit",
      "dependencies": [
        "clean:audit",
        "clean:hugo:full",
        "clean:netlify"
      ]
    },
    "clean:audit": {
      "command": "rimraf tests/lighthouse/reports/*.{csv,html,json}"
    },
    "clean:hugo:full": {
      "command": "rimraf hugo.log hugo_stats.json resources public assets/jsconfig.json .hugo_build.lock"
    },
    "clean:netlify": {
      "command": "rimraf .netlify/*/*"
    }
  },
  "config": {
    "commitizen": {
      "path": "node_modules/cz-git"
    }
  },
  "publishConfig": {
    "provenance": true
  },
  "engines": {
    "node": ">=20.12.0",
    "npm": ">=10.5.0"
  },
  "browserslist": [
    "extends @davidsneighbour/browserslist-config"
  ],
  "simple-git-hooks": {
    "commit-msg": "npx commitlint -e \"$@\""
  },
  "type": "module",
  "devDependencies": {
    "@playwright/test": "^1.48.2",
    "@types/node": "^22.9.0"
  }
}
