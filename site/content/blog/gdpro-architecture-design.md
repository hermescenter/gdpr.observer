---
title: "Architecture Design"
date: 2022-12-01
draft: false
featured: true
type: post
description: "How to organize the working prototype and improve Web Evidence Collector to feed existing and future components"
---

GDPRo is a pipeline, a sequence of components that need to be executed in sequence.

Is implemented under an AGPL-v3 license, and you can review or fork the code from this [github repository](https://github.com/vecna/gdpr.observer).


It is implemented to run via `nodejs` and depends from these fundamental frameworks:
* Web Evidence Collector, from the EDPS, based on Puppeteer.
* Consent Acceptance Clicker with multi-language dictionary
* Javascript frameworks: `expressJS`, `zx`, `lodash`.

![architecture-design-1](/images/design/architecture-1.jpg)

<!-- https://miro.com/app/board/uXjVPvt9YPs=/ -->

## Vocabulary

* **Batch of website**: it is a list of website (normally, institutions from an EU member state) that need to be analyzed.

## Getting started

TODO 

## Workflow

TODO 

## APIs

TODO 

## Data Model

TODO 


