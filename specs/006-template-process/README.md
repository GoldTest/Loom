---
status: complete
created: 2026-06-20
priority: high
tags:
- templates
- process
parent: 001-climaster-project
created_at: 2026-06-20T05:58:41.760416900Z
updated_at: 2026-06-20T07:55:38.717067700Z
completed_at: 2026-06-20T07:55:38.717067700Z
transitions:
- status: complete
  at: 2026-06-20T07:55:38.717067700Z
---

# Running Templates and Process Lifecycle Management

## Overview
Implement CLI execution templates (default arguments, env vars, working dir) and process lifecycle management (launching CLI instances, real-time log streaming of stdout/stderr, and killing process trees safely on Windows).

## Requirements
- [x] Implement CRUD for CLI Execution Templates (id, cli_name, default_args, env, pwd).
- [x] Implement process execution engine to launch a CLI using a selected template.
- [x] Capture stdout and stderr streams in real-time, sending them to the GUI/frontend.
- [x] Implement process tree termination (Kill) to kill the launched process and all its child processes on Windows.
- [x] Write tests verifying process execution, stream capturing, and termination.

## Acceptance Criteria
- [x] A CLI tool runs successfully using a template with custom env vars and arguments.
- [x] Logs are streamed live from the running process.
- [x] Terminating a running process kills it and its child processes, updating its state to stopped.
