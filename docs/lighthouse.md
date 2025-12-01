# Lighthouse automation

This repository ships a Lighthouse helper that can be used from a daily cron job or a GitHub Actions workflow to archive reports for `https://kollitsch.dev/`.

## Configuration

Defaults live in [`src/config/lighthouse.config.ts`](/src/config/lighthouse.config.ts):

* `url`: Target URL to audit (defaults to `https://kollitsch.dev/`).
* `outputDir`: Directory where reports are stored (`reports/lighthouse`).
* `saveHtmlReports`: Persist HTML in addition to JSON. Disabled by default because HTML can be regenerated from the JSON files later.
* `chromeFlags`: Extra flags passed to the headless Chrome instance.

You can override any of these at runtime with CLI flags or the `LH_URL` environment variable for the URL.

## Running the audit

```bash
npm run lighthouse:audit -- --url https://kollitsch.dev/ --output-dir reports/lighthouse --save-html
```

Key options:

* `--url <target>`: Override the audited URL.
* `--output-dir <path>`: Where JSON (and optionally HTML) reports are stored.
* `--save-html`: Also emit HTML reports generated directly from the JSON results.
* `--render-html-from-json <path>`: Convert an existing JSON report into HTML without rerunning Lighthouse.
* `--chrome-flags <flag1,flag2>`: Comma-separated list of additional Chrome flags.

The script always runs two profiles (mobile and desktop) with verbose logging and the full Lighthouse test suite enabled. Outputs are timestamped so daily runs keep historical state.

## Scheduling tips

* **Cron**: point a daily cron job at `npm run lighthouse:audit` inside the repository. Ensure Chrome dependencies are present on the runner.
* **GitHub Actions**: invoke the same command from a scheduled workflow. Cache the `reports/lighthouse` directory as an artifact to preserve results.
