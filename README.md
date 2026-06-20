# CliMaster

CliMaster is a local command-line interface (CLI) tool manager and supervisor featuring a high-performance Rust core, a unified clap-based command line interface (`climaster`), and a modern Tauri-based GUI dashboard.

It enables developers to scan, import, categorize, and execute CLI commands with custom environment variables and parameterized run templates, all while offering real-time process monitoring and stdout/stderr log streaming.

---

## Features

- **CLI Auto-Scanner & Importer**: Crawl the Windows `PATH` environment variable or scan specific directories to automatically discover executable CLI tools, deduplicating them and storing them locally.
- **Categorization & Custom Environments**: Group discovered CLI tools into categories and specify custom, persistent environment variables to run them with.
- **Run Parameter Templates**: Create reusable execution templates with pre-configured arguments, working directories (`pwd`), and overrides for environment variables.
- **Process Lifecycle Manager**: Launch CLI templates from the GUI dashboard, stream stdout/stderr log output in real-time, and cleanly terminate running processes (including process trees on Windows).
- **System Tray Icon & Close-to-Tray**:
  - The application automatically starts with a system tray icon.
  - Clicking the top-right close (`X`) button hides the main window, allowing it to run in the background.
  - Use the system tray context menu to quickly restore the GUI ("Show CliMaster") or cleanly terminate the process ("Quit").
  - Left-clicking the tray icon restores and focuses the window.
- **Bilingual Interface**: Chinese (`zh`) and English (`en`) support with state persistence.

---

## Project Structure

```
├── crates/
│   ├── core/         # Common logic: persistence, scanner, process runner
│   ├── cli/          # clap-based command-line binary `climaster`
│   └── gui/          # Tauri desktop application backend & React frontend
├── specs/            # Spec-Driven Development (HarnSpec) definitions
└── e2e/              # Playwright/Vitest E2E integration test suite
```

---

## Quick Start

### Prerequisites
- [Rust & Cargo](https://rustup.rs/)
- [Node.js & pnpm](https://nodejs.org/)

### Building the Project
Compile the workspace to produce both the `climaster` CLI binary and `climaster-gui` Tauri backend in your target build folder:
```powershell
cargo build --workspace
```

### Running the GUI Dashboard
To run the GUI in development mode with hot-reloading:
```powershell
# In crates/gui/frontend
pnpm install
pnpm run dev
```
And start the Tauri development server:
```powershell
# In crates/gui/src-tauri
cargo tauri dev
```

### Running the E2E Test Suite
To run the Vitest-based E2E test cases:
```powershell
cd e2e
npx vitest run
```

---

## Configuration & Data Storage
CliMaster stores its registry, categories, environment overrides, templates, and application settings in a single unified configuration file:
- **Location**: `climaster.json` located in the user's local application data directory (e.g. `AppData/Local/climaster/climaster.json` on Windows).
