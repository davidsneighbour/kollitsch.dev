---
title: Cloning All My Repos on a New Ubuntu Installation
linkTitle: Cloning All My Repos on a New Ubuntu Installation
description: >-
  A script to automatically clone all my GitHub repos to a local Ubuntu system
  using GitHub's REST API.
date: '2024-04-28T15:15:56+07:00'
resources:
  - title: >-
      Photo by [Roman Synkevych](https://unsplash.com/@synkevych) via
      [Unsplash](https://unsplash.com/)
    src: header.jpg
tags:
  - ubuntu 24.04
  - howto
  - git
  - 100DaysToOffload
fmContentType: blog
cover: header.jpg
---

One of the first things I do after a new installation of myt OS of choice Ubuntu, is to clone *all* my repositories from GitHub. This way, I have all my code and configuration files available locally, and I can start working on them right away instead of loading them each time I start working on any project. I like to put all my files into `~/github.com/davidsneighbour/reponame` - which leads to an URL-like path for my repos and makes it easier for me to find them online too.

This time I thought, it would be nice to have a script doing all that for me, because with 200+ repositories it was getting a daunting task. GitHub Rest API to the rescue. I wrote a quick script that locates all my private and public repos and clones them into my folder.

Setting it up is relatively hasslefree: copy [the full script](https://github.com/davidsneighbour/dotfiles/blob/2a3178501237a90e29b3e865c1736a0b592f51c2/bin/helpers/setup-repositories.sh) somewhere in your path and make it executable. You'll also need to create a `.env` file in your home directory with the following content:

```ini
GITHUB_DEV_TOKEN=github_pat_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

The key can be either a [classic key](https://github.com/settings/tokens) or one of those [fancy new "faingrained" tokens](https://github.com/settings/tokens?type=beta). The script will use this token to authenticate with GitHub and the rights required are either `repo` rights (classic token) or *Metadata* rights (for the fine grained token). The script will clone all repositories under the token user's account, so make sure you have the necessary permissions.

After that run it with

```bash
setup-repositories.sh --output-dir ~/github.com/davidsneighbour/
```

The script is structured into several functions, each handling a part of the task, so that I might be able to reuse the code later on elsewhere.

## Dependency Check

Before doing anything, the `check_dependencies` function verifies that all necessary commands (in this case `curl`, `jq`, `git`) are available. This prevents the script from failing later due to missing tools. All three tools can, if missing, be installed via `apt install curl jq git`.

```bash
check_dependencies() {
  for cmd in curl jq git; do
    command -v "${cmd}" >/dev/null 2>&1 || {
      echo >&2 "The script requires ${cmd} but it's not installed. Aborting."
      exit 1
    }
  done
}
```

## Parsing Command-Line Arguments

The `parse_arguments` function handles input parameters. Both options are optional.

The `--output-dir` option sets the directory where the repositories will be cloned. If not provided, the script will clone the repositories into the current directory.

The `--debug` option can be used to save the responses from the REST API to json files in `--dir-output`.

```bash
parse_arguments() {
  while [[ "$#" -gt 0 ]]; do
    case $1 in
    --output-dir)
      output_dir="${2%/}"
      shift
      ;;
    --debug)
      debug_mode="true"
      ;;
    *)
      echo "Unknown parameter passed: $1"
      usage
      ;;
    esac
    shift
  done
}
```

## Initialization

The `initialize` function sets up the environment. It ensures the `--output-dir` exists and loads the GitHub token from an `.env` file in the user's home directory. If the token isn't set, it exits with an error.

```bash
initialize() {
  if [ -z "${output_dir}" ]; then
    output_dir="."
  fi
  mkdir -p "${output_dir}" || exit
  cd "${output_dir}" || exit

  if [ -f ~/.env ]; then
    source ~/.env
  else
    echo "Error: .env file not found in home directory."
    exit 2
  fi

  if [ -z "${GITHUB_DEV_TOKEN}" ]; then
    echo "Error: GitHub development token not set in .env file."
    exit 3
  fi
}
```

## Fetch and Clone Repositories

`fetch_and_clone_repos` does the actual job and [fetches the repository meta-data using the GitHub API](https://docs.github.com/en/rest/repos/repos#list-repositories-for-the-authenticated-user). It handles pagination and checks if the JSON response from GitHub is valid. It then calls `clone_repositories` which clones the repository.

If a directory already exists it will skip the repository. This way the script can run again after interruptions without starting again at the beginning.

```bash
fetch_and_clone_repos() {
  local page=1 all_repos_fetched=false response repo_count
  while [ "${all_repos_fetched}" = false ]; do
    response=$(curl -sH "Authorization: token ${GITHUB_DEV_TOKEN}" "https://api.github.com/user/repos?type=all&per_page=100&page=${page}")
    if ! echo "${response}" | jq . >/dev/null 2>&1; then
      echo "Failed to parse JSON, or got an error from GitHub:"
      echo "${response}"
      exit 4
    fi

    if [ "${debug_mode}" = "true" ]; then
      echo "${response}" >"debug_response_page_${page}.json"
    fi

    repo_count=$(echo "${response}" | jq -r '. | length')
    if [ "${repo_count}" -eq 0 ]; then
      all_repos_fetched=true
      echo "No more repositories to clone."
      break
    fi

    clone_repositories "${response}"
    ((page++))
  done
}

clone_repositories() {
  echo "$1" | jq -r '.[] | .name, .ssh_url' | while
    read -r repo_name
    read -r ssh_url
  do
    if [ -z "${ssh_url}" ]; then
      echo "A repository without a clone URL was encountered: ${repo_name}"
      continue
    fi
    if [ -d "${output_dir}/${repo_name}" ]; then
      echo "Directory ${output_dir}/${repo_name} already exists, skipping clone."
      continue
    fi
    echo "Cloning ${ssh_url} into ${output_dir}/${repo_name}"
    git clone "${ssh_url}" "${output_dir}/${repo_name}"
  done
}
```

## Main Execution

Finally, the `main` function executes all the above functions in order:

```bash
main() {
  check_dependencies
  debug_mode="false"
  parse_arguments "$@"
  initialize
  fetch_and_clone_repos
  echo "Repositories cloned in ${output_dir}"
}

main "$@"
```

[The complete code of the script at this point can be found here.](https://github.com/davidsneighbour/dotfiles/blob/2a3178501237a90e29b3e865c1736a0b592f51c2/bin/helpers/setup-repositories.sh)

## Gotchas

Like any quickly written program this script has some limitations and gotchas:

* While it checks if a repository is already cloned, this check is only rudimentary. When a `git clone` command fails it normally cleans up the directory, but if the script is interrupted during the clone process, the directory might remain. This script only checks if a directory exists, not if it's a valid git repository.
* The script clones **all** repos under the users account, including forks. This might not be what you want. It also fills the space with plenty of probably unused repositories. I think it might be a good idea to add a check for the type of repository (fork, private, public) and only clone the ones I want. Or even add a simple tag to the repositories I want to clone or exclude from cloning.

For me, it does its job: cloning all the repos in my profile.
