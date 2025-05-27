# Changelog
## [2025.4.7](https://github.com/davidsneighbour/kollitsch.dev/compare/v2025.4.6...v2025.4.7) (2025-05-27)


### Theme

* **config:** enable markup.goldmark.renderer.unsafe for use of inline HTML ([b69cf1b](https://github.com/davidsneighbour/kollitsch.dev/commit/b69cf1b2d8cba782f5a29d46f29cff75247fb336))
* **fix:** clear out unused templates ([b2f8175](https://github.com/davidsneighbour/kollitsch.dev/commit/b2f8175e1e27f4552bd6171d483fd20b00507eb4))
* **fix:** refactor shortcodes and remove unused shortcodes ([cfdc8d4](https://github.com/davidsneighbour/kollitsch.dev/commit/cfdc8d4be7be2b3d6d393da8c9884b8b313b7661))


### Chore

* smaller changes to hugo setup ([1776280](https://github.com/davidsneighbour/kollitsch.dev/commit/1776280078e2a4b05dd55e06b1be2b91b5701f20))


### Build System

* script to find/audit shortcodes ([6775fc9](https://github.com/davidsneighbour/kollitsch.dev/commit/6775fc9991afd60fe09b447fcbc512a6a1da6921))


### CI

* **fix:** proper capture of {{%-based shortcodes ([c349bb6](https://github.com/davidsneighbour/kollitsch.dev/commit/c349bb6f51855c22666238d721dd15a56101da24))

## [2025.4.6](https://github.com/davidsneighbour/kollitsch.dev/compare/v2025.4.5...v2025.4.6) (2025-05-22)


### Theme

* **feat:** add TailwindCSS setup ([cd6b79d](https://github.com/davidsneighbour/kollitsch.dev/commit/cd6b79d5be5d4146f08e0cc7d970b147f7249268))
* **fix:** move hooks and filters into func/hooks ([d3b0ff9](https://github.com/davidsneighbour/kollitsch.dev/commit/d3b0ff93deca655abc91113f5ffa9ca722df294a))
* **fix:** remove unused func partials and move single use partials inline ([f8cf981](https://github.com/davidsneighbour/kollitsch.dev/commit/f8cf981196b8ea37ca77091c3c5201581ec5ffb5))


### Refactors

* cleanup and moving configs around ([b2a3cad](https://github.com/davidsneighbour/kollitsch.dev/commit/b2a3cad6c06824b1d0efcdeccff4356014b81690))

## [2025.4.5](https://github.com/davidsneighbour/kollitsch.dev/compare/v2025.4.4...v2025.4.5) (2025-05-21)


### Theme

* **fix:** add copyright line to theme files ([9849992](https://github.com/davidsneighbour/kollitsch.dev/commit/9849992e07100b2f25614da16dad90554bdfdea6))
* **fix:** remove text scrambler from title ([644eb5b](https://github.com/davidsneighbour/kollitsch.dev/commit/644eb5b554af9302b75e48e7ccc9d1dabe5c0f53))


### Bug Fixes

* move setup configuration into its own environment ([d796e70](https://github.com/davidsneighbour/kollitsch.dev/commit/d796e700125dffc79ff4bd6fad5d02b45834400f))


### Chore

* **git:** remove binaries submodule ([d566fe7](https://github.com/davidsneighbour/kollitsch.dev/commit/d566fe74f4e0862005dada8bd8ef9e44d9920845))
* remove .git-blame-ignore-revs ([cc3e0df](https://github.com/davidsneighbour/kollitsch.dev/commit/cc3e0df50ed08be4b2c7bff64613ffdfea34902c))
* remove .gitmodules ([5ff7aef](https://github.com/davidsneighbour/kollitsch.dev/commit/5ff7aefb8321978978c82e65cd47358f0b060224))

## [2025.4.4](https://github.com/davidsneighbour/kollitsch.dev/compare/v2025.4.3...v2025.4.4) (2025-05-21)


### Content

* **fix:** replace ... with … (ellipsis) ([87cb856](https://github.com/davidsneighbour/kollitsch.dev/commit/87cb8560bd982a1774eab2dd7758fd14fb51245a))


### Documentation

* cleanup CHANGELOG.md ([d5a73a4](https://github.com/davidsneighbour/kollitsch.dev/commit/d5a73a482f0282227e5c26f2d44fa4b0c43eb984))


### Refactors

* move content module into root repository ([8bce49c](https://github.com/davidsneighbour/kollitsch.dev/commit/8bce49c7bbafd764ce7d82bd2267ea2804315fba))
* restructure repo and move content module into repo ([ae81c03](https://github.com/davidsneighbour/kollitsch.dev/commit/ae81c0342f1e9dad35869042b06500647efb5eb4))
* rework frontmatter configuration ([1a72d78](https://github.com/davidsneighbour/kollitsch.dev/commit/1a72d78b5a448d75789a6b2582ca940709dc0820))


### Tests

* cleanup test setup ([f5e7254](https://github.com/davidsneighbour/kollitsch.dev/commit/f5e7254114d5795613af6cd16de04881f8afbe07))


### Build System

* **deps:** update dependencies ([f521ec1](https://github.com/davidsneighbour/kollitsch.dev/commit/f521ec1f7c0eb36370c889671a82c3c9cfcb9f0a))
* **git:** remove frontmatter submodule ([18ed969](https://github.com/davidsneighbour/kollitsch.dev/commit/18ed96908575e89bd3e3d85ccfef20ea4dbcadbc))
* **packages:** update version updater ([ac13392](https://github.com/davidsneighbour/kollitsch.dev/commit/ac1339222874b24b546da93bd7fc851be480533a))
* **server:** reconfigure server build ([0b65e9a](https://github.com/davidsneighbour/kollitsch.dev/commit/0b65e9a44c96c3259387040775431f2f244491ba))


### CI

* **fix:** add content to commitlint configuration ([4bcf0bf](https://github.com/davidsneighbour/kollitsch.dev/commit/4bcf0bfcc12b16ae79046c0717f6c8daecceb3a6))

## [2025.4.3](https://github.com/davidsneighbour/kollitsch.dev/compare/v2025.4.2...v2025.4.3) (2025-05-20)

### Build System

* **fix:** remove ANSI formatting from version string ([5d1c854](https://github.com/davidsneighbour/kollitsch.dev/commit/5d1c85489f0970f56856594d25b2d7b3a02f5051))

## [2025.4.2](https://github.com/davidsneighbour/kollitsch.dev/compare/v2025.4.1...v2025.4.2) (2025-05-20)

### Build System

* **fix:** remove ANSI formatting from version number ([e46d1ca](https://github.com/davidsneighbour/kollitsch.dev/commit/e46d1ca4c9aa40394cbabce363d57e031f3c83a1))

## [2025.4.1](https://github.com/davidsneighbour/kollitsch.dev/compare/v2025.4.0...v2025.4.1) (2025-05-20)

### Build System

* **fix:** proper version in CITATION.cff ([71bec6f](https://github.com/davidsneighbour/kollitsch.dev/commit/71bec6f56837bb2652bc5697010d49451c16edf5))
