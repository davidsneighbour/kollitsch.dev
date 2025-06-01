---
$schema: /assets/schemas/blog.schema.yaml
title: The Case of the Unconnectable Docker Daemon
description: >-
  I unravel, Arthur Conan Doyle style, a mystery where my Docker daemon refuses
  to respond. From sneaking into group permissions and examining socket
  ownership to navigating Docker contexts and rootless environments, I follow
  each clue until the service speaks again.
summary: >-
  I unravel, Arthur Conan Doyle style, a mystery where my Docker daemon refuses
  to respond. From sneaking into group permissions and examining socket
  ownership to navigating Docker contexts and rootless environments, I follow
  each clue until the service speaks again.
date: '2025-04-26T06:35:29+07:00'
resources:
  - src: docker-forensics.png
tags:
  - docker
  - troubleshooting
  - forensics
  - 100DaysToOffload
type: blog
fmContentType: blog
---

It was a dreary April afternoon when I returned to my terminal, only to be met with a chilling refusal:

```plaintext
Cannot connect to the Docker daemon at unix:///home/patrick/.docker/desktop/docker.sock
```

Checking the services status I found it was indeed unresponsive:

```bash
systemctl status docker
journalctl -u docker.service --no-pager
```

A trusted companion had fallen silent, and I donned my metaphorical deerstalker to uncover the truth.

## The first clue - members of the group

Running the following command I expected to see my name appear as a member of the `docker` group:

```bash
getent group docker
```

And indeed, there I was:

```plaintext
docker:x:983:patrick
```

An often overlooked detail in the Docker documentation is the need for the current user to be in the `docker` group. This though was not the issue for me as the response conveied.

Yet still the daemon remained mute. I realised that, like a locked door, new group membership might demand a fresh session—log out, log in, or invoke `newgrp docker`. But alas, doing that did not yield the desired result. I was still met with the same chilling message.

## The scene of the crime

A glance at my Docker contexts revealed I was adrift in `desktop-linux`:

```bash
docker context ls
```

The response was a list of contexts, each with its own endpoint:

```plaintext
NAME            DESCRIPTION                               DOCKER ENDPOINT                                    ERROR
default         Current DOCKER_HOST based configuration   unix:///var/run/docker.sock                        
desktop-linux * Docker Desktop                            unix:///home/patrick/.docker/desktop/docker.sock   
```

And thus, my friend, it became clear that the daemon had been misled by the context. I was not in the right place, and Docker was confused.

A swift return to the `default` context and the unsetting of `DOCKER_HOST` should guide me back to familiar waters.

```bash
docker context use default
```

## The vital heartbeat

A simple resurrection spell sufficed:

```bash
sudo systemctl start docker
```

At once, the gears creaked, and slowly came to life, and turned, and the daemon spoketh yet again.

## The rootless finale

A proper socket restored the connection.

*Lessons learned* – When the daemon falls silent, treat each clue with respect. Verify your group membership, inspect the sockets, mind your context, ensure the service is alive, and, if you walk the rootless path, point to the correct socket. In the realm of Docker, every detail may hold the key. Sometimes there are more players in the room than you expect or see.

With the mystery unveiled, I reclaimed my faithful Docker daemon and returned to peace (and work).
