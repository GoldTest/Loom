---
status: complete
created: 2026-06-20
priority: medium
tags:
- scanner
- import
parent: 001-climaster-project
created_at: 2026-06-20T05:58:25.484309500Z
updated_at: 2026-06-20T07:50:57.769504600Z
completed_at: 2026-06-20T07:50:57.769504600Z
transitions:
- status: complete
  at: 2026-06-20T07:50:57.769504600Z
---

# Auto-Scanner and Manual Importer

## Overview
Implement the scanning logic that detects CLI executables. It reads the system `PATH` env var to find executables (on Windows: `.exe`, `.bat`, `.cmd`, `.ps1`), deduplicates and indexes them. Also support manual file and folder import.

## Requirements
- [x] Implement system `PATH` auto-scanner.
- [x] Filter out non-CLI executables (or allow selecting/de-selecting and basic deduplication by executable name).
- [x] Implement manual importing of a single executable file.
- [x] Implement manual importing of an entire folder.
- [x] Persist scanned and imported items into the configuration database/file.
- [x] Write tests verifying path resolution, extension filtering, and duplication detection.

## Acceptance Criteria
- [x] Auto-scanner detects standard Windows executables in PATH correctly.
- [x] Users can manually import a single file or directory and see it added to the database.
