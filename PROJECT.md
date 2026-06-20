# Project: CliMaster

## Architecture
CliMaster is built as a Cargo workspace with three primary components:
1. **cli**: Command-line application binary `climaster` allowing users to query, search, and list registered CLI tools in table or JSON format.
2. **core** (or shared library): Shared logic for:
   - Persistence (JSON configuration or SQLite) for CLI entries, categories, templates, env vars.
   - Auto-scanner (PATH crawler with filtering/deduplication) and manual importer.
   - Run templates manager and process executor (streaming stdout/stderr, killing process trees on Windows).
3. **gui**: Tauri desktop application. The Rust backend exposes Tauri Commands wrapping the `core` library. The Web Frontend provides dashboard, categorization, environment variables, template editors, live log terminal view, and process state indicators.

```
+--------------------------------------------------+
|                    Tauri GUI                     |
|  +-------------------+    +-------------------+  |
|  |   Web Frontend    |    |   Tauri Backend   |  |
|  | (React / HTML/JS) |<==>|  (Rust Commands)  |  |
|  +-------------------+    +---------+---------+  |
+-------------------------------------|------------+
                                      | Tauri commands invoke core
                                      v
+--------------------------------------------------+
|                  climaster-core                  |
|  +-------------------+    +-------------------+  |
|  | Persistence DB/   |    | Scanner, Importer |  |
|  | JSON Configuration|    |   & Env Manager   |  |
|  +---------+---------+    +---------+---------+  |
|            |                        |            |
|            v                        v            |
|  +--------------------------------------------+  |
|  |   Run Templates & Process Lifecycle Mgr    |  |
|  +--------------------------------------------+  |
+-------------------------------------^------------+
                                      | queries config & runs commands
+-------------------------------------|------------+
|                    climaster-cli                 |
|            (clap CLI binary 'climaster')         |
+--------------------------------------------------+
```

## Code Layout
- `Cargo.toml` (workspace config)
- `crates/core/`: Common functionality library.
- `crates/cli/`: CLI entry point binary `climaster`.
- `crates/gui/`: Tauri project backend (`src-tauri`).
- `crates/gui/src/` or similar: Frontend app code.
- `specs/`: HarnSpec directory.
- `e2e/`: E2E test scripts/runner.

## Milestones
| # | Name | Scope | Dependencies | Status | Conversation ID |
|---|------|-------|-------------|--------|-----------------|
| 1 | Setup & Persistence | Workspace initialization, dependencies setup, configuration DB format. | None | IN_PROGRESS | d1fa318a-8afd-4a34-aa55-d793185d0602 |
| 2 | Global CLI | CLI parser, listing/searching CLI tools, `--json` formatting. | M1 | PLANNED | |
| 3 | Auto-Scanner & Importer | Crawl Windows PATH, manual file/folder import, persistence. | M1 | PLANNED | |
| 4 | Categorization & Env Vars | CRUD for categories, assigning CLIs, managing custom env vars. | M1 | PLANNED | |
| 5 | Run Templates & Process | CLI templates, stdout/stderr live log streaming, kill process tree. | M1 | PLANNED | |
| 6 | GUI Dashboard | Tauri frontend UI, live logs, process lifecycle visual control. | M4, M5 | PLANNED | |
| 7 | Verification & Hardening | Dual track E2E validation, adversarial testing, spec board complete. | M2, M3, M6 | PLANNED | |

## Interface Contracts

### 1. Persistence & Configuration Layout
The core configuration is stored in a JSON configuration file (e.g. `climaster.json` in user's AppData/Local folder):
```json
{
  "cli_tools": [
    {
      "id": "uuid-string",
      "name": "git",
      "path": "C:\\Program Files\\Git\\cmd\\git.exe",
      "version": "2.40.0",
      "category_id": "category-dev",
      "custom_env": {
        "GIT_AUTHOR_NAME": "CliMaster User"
      }
    }
  ],
  "categories": [
    {
      "id": "category-dev",
      "name": "Development Tools",
      "description": "Compilers, VCS, builders"
    }
  ],
  "templates": [
    {
      "id": "template-git-status",
      "cli_id": "uuid-string",
      "name": "Git Status",
      "args": ["status"],
      "env": {
        "GIT_OPTIONAL": "true"
      },
      "pwd": "C:\\Users\\YinHe"
    }
  ]
}
```

### 2. Tauri Backend Commands
- `get_cli_tools() -> Vec<CliTool>`
- `import_cli_tool(path: String) -> Result<CliTool, String>`
- `scan_path_env() -> Result<Vec<CliTool>, String>`
- `scan_directory(path: String) -> Result<Vec<CliTool>, String>`
- `create_category(name: String, desc: String) -> Result<Category, String>`
- `assign_cli_category(cli_id: String, cat_id: Option<String>) -> Result<(), String>`
- `update_cli_env(cli_id: String, env: HashMap<String, String>) -> Result<(), String>`
- `create_template(cli_id: String, name: String, args: Vec<String>, env: HashMap<String, String>, pwd: Option<String>) -> Result<Template, String>`
- `run_cli_template(template_id: String) -> Result<String, String>` (returns instance ID)
- `kill_cli_instance(instance_id: String) -> Result<(), String>`

### 3. Log Streaming Events
Tauri listens on frontend for channel-based events:
- `cli-log-event`: `{"instance_id": "...", "stream": "stdout" | "stderr", "chunk": "..."}`
- `cli-status-event`: `{"instance_id": "...", "status": "running" | "stopped" | "failed", "exit_code": Option<i32>}`
