---
title: "The Pizening III: Installing Docker on Raspberry Pi using apt"
description: "pizen post"
draft: true
date: 2025-10-10T12:17:16.215Z
tags: []
cover:
  src: "patrycja-jadach-1bS1PGDrdy4-unsplash.jpg"
  title: ""
---

audit: <https://chatgpt.com/g/g-p-6959e23d170c819191053ccbc0ed584f/c/6959e2b0-fa98-8321-bed1-70e7afc72dc4>

## Installing Docker on Raspberry Pi OS using the official APT repository

For production systems and long-term maintenance, installing Docker via the official APT repository is the recommended approach. This method integrates Docker cleanly into the system package manager and ensures reliable updates over time.

### Method 2: Using the APT repository (recommended for production)

This setup configures Docker’s official repository and installs all required components directly from it.

### 1. Update the system

Before adding new repositories, make sure your system is up to date.

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Install required dependencies

These packages are needed to securely fetch and verify Docker packages.

```bash
sudo apt-get install -y ca-certificates curl gnupg
```

### 3. Add Docker’s official GPG key

Docker signs its packages. The GPG key ensures the integrity and authenticity of downloaded packages.

```bash
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
```

### 4. Add the Docker APT repository

This registers the official Docker repository for your Raspberry Pi OS release.

```bash
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

### 5. Install Docker

After refreshing the package index, install Docker Engine and related tooling.

```bash
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y
```

---

## Post-installation steps

After Docker is installed, a few additional steps are recommended to make it usable in day-to-day workflows.

### 1. Allow non-root Docker usage

By default, Docker commands require `sudo`. Adding your user to the `docker` group removes this requirement.

```bash
sudo usermod -aG docker $USER
```

Log out and log back in (or reboot) for the group change to take effect.

### 2. Verify the installation

Run the test container to confirm Docker is working correctly.

```bash
docker run hello-world
```

If the installation is successful, Docker will download the image and print a confirmation message.

### 3. Enable Docker at boot (optional)

If Docker should start automatically when the system boots:

```bash
sudo systemctl enable docker
```

---

## Further reading

For architecture-specific notes, troubleshooting, and alternative installation paths, refer to the official Docker documentation:

* [https://docs.docker.com/engine/install/raspberry-pi-os/](https://docs.docker.com/engine/install/raspberry-pi-os/)

This repository-based setup is well suited for Raspberry Pi systems that act as container hosts, automation nodes, or lightweight servers running unattended for long periods.
