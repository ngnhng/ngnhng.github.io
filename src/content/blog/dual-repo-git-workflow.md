---
title: "Bridging the Air-Gap: A Dual-Repo Strategy for Enterprise Development"
description: A practical dual-repository Git workflow for developing locally and delivering code into locked-down enterprise environments.
pubDate: 2026-02-15
tags:
  - git
  - workflow
  - enterprise
---

## The Challenge: Security vs. Velocity

In enterprise software development, security is paramount. We often work within "Jump Hosts" provisioned Windows VMs inside a locked-down intranet. While this architecture secures the data, it also slows development down in all the familiar ways.

Common bottlenecks included:

- **Tooling limitations:** inability to install modern IDEs, plugins, or container runtimes on the remote VM.
- **Input latency:** developing through Windows Remote Desktop introduces perceptible lag during routine editing.
- **The "straw" effect:** pushing a whole team's daily output through a single RDP window becomes its own systems bottleneck.

## The Constraints

The environment had a strict network topology:

1. **Internal:** an intranet-only GitLab instance accessible only through RDP.
2. **No direct tunnel:** no SSH tunnels or direct `git remote` bridge between local machines and the internal network.
3. **Compliance:** source code could still be hosted on our own secure infrastructure for development work.

## The Solution: The Patch-Bridge Workflow

To reclaim a usable development loop, we separated the place where code is **written** from the place where code is **integrated**.

### 1. The outer loop

The team works on a self-hosted GitLab outside the firewall.

- Development stays local with preferred IDEs and tooling.
- Merge requests and reviews happen in the fast environment first.

### 2. The bridge

Instead of copying raw files, we use Git patches.

```bash
git format-patch master --stdout > feature-update.patch
```

![Diagram of the dual-repository Git workflow from local development to enterprise GitLab.](/blog/dual-repo-git-workflow/workflow.png)

### 3. The inner loop

The patch is transferred into the intranet environment and applied there:

```bash
git apply --check feature-update.patch
git am feature-update.patch
```

This keeps author metadata and commit history intact while avoiding line-ending drift and other manual transfer problems.

## Why This Works

Decoupling development from internal hosting bought back:

- **Native performance:** zero-latency typing and local debugging.
- **Better history:** `git format-patch` and `git am` preserve commit information cleanly.
- **Compliance:** the final code path still lands in the internal enterprise GitLab.
