# Pull Request

## Summary

Provide a short description of the change and the problem it solves.

## Related issues

* Fixes: # (issue number)
* Related: # (issue number)

## Changes

* List of files and the high-level intent for each change.

## How to test

1. Install dependencies: npm install
2. Run tests: npm test
3. Manual verification steps (if applicable)

## Environment / Secrets

List any required env vars (for example `YOUTUBE_API_KEY`) needed to validate this PR.

## Checklist (rules)

* [ ] npm test must succeed locally and in CI
* [ ] Functions added/changed in `src/utils` have unit tests and those tests pass
* [ ] Components added/changed in `src/components` have unit tests and those tests pass

## Additional checklist

* [ ] Ran `npm run biome:check` / `npm run biome:lint` and fixed issues
* [ ] Ran `npm run prettier:check` / formatted as needed
* [ ] No secrets or tokens committed
* [ ] CI is green

## PR description for reviewers

* Intent (1-2 sentences)
* Files changed
* Env variables required to validate
* Any known risks or edge cases
