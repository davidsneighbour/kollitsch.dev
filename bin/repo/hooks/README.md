# Quick and dirty release hook script for GoHugo websites with standard-version

Note: standard-version is deprecated and this script is now using a fork of it, aptly called [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version). The config stays with the original name for the time being.

Available Hooks:

* prerelease: executed before anything happens. If the prerelease script returns a non-zero exit code, versioning will be aborted, but it has no other effect on the process.
* prebump/postbump: executed before and after the version is bumped. If the prebump script returns a version #, it will be used rather than the version calculated by commit-and-tag-version.
* prechangelog/postchangelog: executes before and after the CHANGELOG is generated.
* precommit/postcommit: called before and after the commit step.
* pretag/posttag: called before and after the tagging step.
* postrelease: called after everything is done.

var festivals = process.env.FESTIVALS.split(' ');
