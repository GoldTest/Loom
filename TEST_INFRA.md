# CliMaster E2E Test Infrastructure

This document outlines the test architecture, test cases, and runner design for the CliMaster project E2E tests.

## Test Architecture

The E2E test suite validates both the CLI application and the Tauri backend commands against interface contracts specified in `PROJECT.md`.

```
 +------------------+           +----------------------+
 |    E2E Tests     |           |      E2E Tests       |
 | (cli.test.ts)    |           |    (gui.test.ts)     |
 +--------+---------+           +----------+-----------+
          |                                |
          | Spawns                         | Invokes via
          v                                v
 +------------------+           +----------------------+
 |  climaster CLI   |           |  climaster GUI Tauri |
 | (crates/cli)     |           | (crates/gui/src-tauri)
 +--------+---------+           +----------+-----------+
          |                                |
          +--------------+   +-------------+
                         |   | Both read/write config
                         v   v
                 +-------------------+
                 |   climaster.json  |
                 | (Shared Database) |
                 +-------------------+
```

### Components

1. **Test Runner**: Node/TypeScript project in the `e2e/` folder using **Vitest** for testing, and **Execa** to spawn process subcommands.
2. **Headless GUI Test Harness**: The Rust Tauri backend (`crates/gui/src-tauri`) registers standard Tauri Commands. To facilitate fast, WebView-less headless testing, it compiles to an executable that executes commands directly when invoked with special environment variables:
   - `TAURI_TEST_CMD`: Name of the command to execute (e.g., `create_category`, `run_cli_template`).
   - `TAURI_TEST_ARGS`: JSON representation of command arguments.
   - `CLIMASTER_CONFIG_PATH`: Path to a session-isolated test configuration file.
3. **Mock Target Program**: The CLI binary implements a `mock-run` subcommand that simulates various executable behaviors (outputting to stdout/stderr, sleeping, printing environment variables, spawning nested child processes, exiting with codes) to test execution lifecycles without OS dependencies.
4. **Active Instances State Sync**: Active running template processes map their PIDs and instance IDs in a temporary `active_instances.json` file. This lets the test suite kill running instances cross-process.

## Test Suite Structure

The test suite covers 71 test cases across 4 tiers:

### Tier 1: Feature Coverage (30 tests)
- **F1: CLI List & Categorization**: Lists tools, creates categories, assigns tools, filters, and verifies persistence.
- **F2: Custom Environment Variables**: Views, adds, edits, deletes custom env vars, and verifies persistence.
- **F3: Run Parameter Templates**: Creates, lists, updates, deletes templates, and verifies persistence.
- **F4: CLI Process Execution & Life Cycle**: Starts templates, streams stdout/stderr logs, terminates/kills processes, and verifies status events.
- **F5: climaster CLI Tool**: Checks `--help`, `--version`, list table/JSON, and search by query.
- **F6: Auto-Scanner & Manual Importer**: Crawls system `PATH`, deduplicates executables, imports files/folders, and handles invalid path errors.

### Tier 2: Boundary & Corner Cases (30 tests)
- **F1: CLI List & Categorization**: Handles duplicate/empty/long category names, non-existent category assignments, and empty databases.
- **F2: Custom Environment Variables**: Validates keys (empty or with invalid characters), permits empty values, supports 64KB values, and resolves duplicate keys.
- **F3: Run Parameter Templates**: Validates nonexistent working directories, permits empty args, prevents empty template names and duplicate names, and handles missing CLI IDs.
- **F4: CLI Process Execution & Life Cycle**: Handles nonexistent binaries, already-stopped processes, high-volume stdout outputs (1,000+ lines), process tree termination, and non-executable files.
- **F5: climaster CLI Tool**: Handles unknown subcommands, search with empty query, invalid output format, excessive arguments, and JSON parsing on empty database.
- **F6: Auto-Scanner & Manual Importer**: Handles empty PATH env vars, folders with no executables, directory depth limits (max 3), symlink cycles, and locked system files.

### Tier 3: Cross-Feature Combinations (6 tests)
- **61**: Scan path and auto-classify tools into categories.
- **62**: Import CLI tool and immediately create a template.
- **63**: Update CLI environment variables and run template.
- **64**: Delete CLI tool and verify cascade deletion of its templates.
- **65**: Delete category and verify associated CLIs are orphaned rather than deleted.
- **66**: Edit categories/tools in GUI and verify CLI `list` output reflects modifications.

### Tier 4: Real-World Application Scenarios (5 tests)
- **67**: Development Toolchain Setup Scenario
- **68**: Network Diagnostics Lifecycle & Process Control Scenario
- **69**: Environment Override Execution & Re-running Scenario
- **70**: Database Backup Cron Job Mock Execution Scenario
- **71**: System Cleanup & Database Synchronization Recovery Scenario
