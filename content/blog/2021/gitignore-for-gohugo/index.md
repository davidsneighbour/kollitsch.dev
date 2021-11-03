+++
title = ".gitignore for GoHugo"

# dates
date = 2021-11-03T20:03:48+07:00

# add multiple resources to create a slider gallery
[[resources]]
title = "Photo by [Mikhail Vasilyev](https://unsplash.com/@miklevasilyev) via [Unsplash](https://unsplash.com/)"
src = "mikhail-vasilyev-NodtnCsLdTE-unsplash.jpg"

# taxonomification
categories = [
  "gohugo"
]
tags = [
  "gitignore", 
  "developers"
]
+++

I really like(d) the [gitignore-generator of Toptal.com](https://www.toptal.com/developers/gitignore) where you can create your own customised `.gitignore` file by selecting all tools, frameworks, programming languages etc. that you use in a project. I even [contributed](https://github.com/toptal/gitignore/pull/389) (which is not too hard, hint hint). But [somehow](https://github.com/toptal/gitignore/commit/1a8b5b5fc7a66da0638c3524ac3019c6e290b083#diff-413e38ddbdde5e179a9de90d33f265643674b4cf4c749299acb0221b61c67cb3) all these changes were removed by merging the status of what appears to be the parent project for these .gitignore contents. I now [added these changes](https://github.com/github/gitignore/pull/3873) "upstream" and hope they will be added again to the `.gitignore` template for GoHugo. 

The current optimum `.gitignore` content for a GoHugo project is the following:

```ini
# Generated files by hugo
/public/
/resources/_gen/
/assets/jsconfig.json
hugo_stats.json
.hugo_build.lock

# Executable may be added to repository
hugo.exe
hugo.darwin
hugo.linux
```
