---
status: complete
created: 2026-06-20
priority: high
tags:
- umbrella
created_at: 2026-06-20T05:57:57.510103300Z
updated_at: 2026-06-20T10:22:49.083447700Z
completed_at: 2026-06-20T09:54:55Z
transitions:
- status: complete
  at: 2026-06-20T08:08:43.891109800Z
- status: in-progress
  at: 2026-06-20T09:48:11.052320100Z
- status: complete
  at: 2026-06-20T09:54:55Z
- status: in-progress
  at: 2026-06-20T10:00:39.103532Z
- status: complete
  at: 2026-06-20T10:22:49.083447700Z
---

# CliMaster Project

## Overview
CliMaster is a local command-line interface (CLI) management tool featuring a Tauri GUI and a Rust CLI. This spec acts as the umbrella parent for all sub-features.

## Requirements
- [x] Setup persistence and Rust workspace [001-setup-persistence]
- [x] Implement global CLI `climaster` [002-global-cli]
- [x] Implement Auto-Scanner and Manual Importer [003-scanner-importer]
- [x] Implement Categorization and Custom Environment Variables [004-categorization-env]
- [x] Implement Run templates and Process control [005-template-process]
- [x] Implement Tauri GUI Dashboard [006-gui-dashboard]
- [x] Implement Final Integration, E2E tests and Validation [007-validation-hardening]
- [x] Implement Chinese-English localization support [009-i18n-localization]

## Acceptance Criteria
- [x] All child specs are complete and verified.
- [x] All E2E test cases pass successfully.
- [x] HarnSpec board has 0 draft/planned/in-progress specs remaining.
