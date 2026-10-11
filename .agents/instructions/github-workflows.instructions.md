---
applyTo: ".github/workflows/**"
---

# GitHub Actions workflows

Apply to every workflow:

- set `persist-credentials: false` on every `actions/checkout` step;
- pin actions to a commit SHA with a version comment (`uses: owner/action@<sha> # vX.Y.Z`);
- grant each job only the minimum `permissions` it needs;
- cron schedules are UTC; convert carefully when a schedule is requested in another timezone;
- do not add a workflow that commits, pushes, deploys, or opens issues unless explicitly requested.

Deployment is local with Wrangler, not GitHub Actions. See `.agents/references/build-and-deploy.md` for the current workflow list.
