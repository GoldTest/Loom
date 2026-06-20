---
status: complete
created: 2026-06-20
priority: high
tags:
- cli
- rust
parent: 001-climaster-project
created_at: 2026-06-20T05:58:14.127659900Z
updated_at: 2026-06-20T07:50:07.509577300Z
completed_at: 2026-06-20T07:50:07.509577300Z
transitions:
- status: complete
  at: 2026-06-20T07:50:07.509577300Z
---

# Global CLI climaster

## Overview
Implement the `climaster` command-line executable. It allows users to query registered, scanned, or imported CLI tools in the system, support structured JSON/table outputs, and run searches.

## Requirements
- [x] Implement `climaster` command-line parsing (e.g., using `clap`).
- [x] Implement `climaster list` or `climaster query` to list all registered CLI tools.
- [x] Implement `--format json` or `--json` flag to output standard JSON data.
- [x] Implement query filters (e.g., filter by category, path, or name).
- [x] Write unit and integration tests verifying query command outputs.

## Acceptance Criteria
- [x] Running `climaster list` returns a tabular list of registered tools.
- [x] Running `climaster list --format json` (or `--json`) outputs valid JSON representing the tools.
