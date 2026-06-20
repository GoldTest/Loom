# CliMaster

<p align="center">
  <img src="crates/gui/frontend/src/assets/hero.png" alt="CliMaster Logo" width="120" />
</p>

<p align="center">
  <b>A Modern CLI Tool Manager, scanner, and supervisor built with Rust & Tauri.</b>
</p>

<p align="center">
  <a href="https://github.com/GoldTest/CliMaster/actions/workflows/ci.yml">
    <img src="https://github.com/GoldTest/CliMaster/actions/workflows/ci.yml/badge.svg" alt="Rust & Frontend CI Status" />
  </a>
  <a href="https://github.com/GoldTest/CliMaster/releases">
    <img src="https://img.shields.io/github/v/release/GoldTest/CliMaster?color=blue" alt="Latest Release" />
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/github/license/GoldTest/CliMaster?color=green" alt="MIT License" />
  </a>
</p>

CliMaster is a local command-line interface (CLI) tool manager and supervisor featuring a high-performance Rust core, a unified clap-based command line interface (`climaster`), and a modern Tauri-based GUI dashboard.

It enables developers to scan, import, categorize, and execute CLI commands with custom environment variables and parameterized run templates, all while offering real-time process monitoring and stdout/stderr log streaming.

---

## 🌟 Key Features

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

## 🏗️ Project Architecture

```
├── .github/
│   └── workflows/
│       ├── ci.yml      # Rust & Frontend CI Workflow
│       └── release.yml # Auto-Release & Packaging Workflow
├── crates/
│   ├── core/           # Common logic: persistence, scanner, process runner
│   ├── cli/            # clap-based command-line binary `climaster`
│   └── gui/            # Tauri desktop application backend & React frontend
├── specs/              # Spec-Driven Development (HarnSpec) definitions
└── e2e/                # Playwright/Vitest E2E integration test suite
```

### Technical Stack
- **Backend & Core**: Rust, Tauri v2
- **Frontend Dashboard**: React, TypeScript, Vite
- **Testing Suite**: Vitest, Execa for CLI integration

---

## 🚀 Getting Started

### Prerequisites

- [Rust & Cargo](https://rustup.rs/) (Stable channel)
- [Node.js](https://nodejs.org/) (v20+ recommended)
- [pnpm](https://pnpm.io/) (for E2E tests, optional but recommended)

### 1. Installation & Environment Setup

Clone the repository:
```bash
git clone https://github.com/GoldTest/CliMaster.git
cd CliMaster
```

Install frontend dependencies:
```bash
cd crates/gui/frontend
npm install
cd ../../..
```

Install E2E test suite dependencies:
```bash
cd e2e
pnpm install
cd ..
```

### 2. Development Mode

To run the GUI in development mode with hot-reloading:
- **Step 1**: Start the frontend development server:
  ```bash
  cd crates/gui/frontend
  npm run dev
  ```
- **Step 2**: Start the Tauri development desktop window:
  ```bash
  cd crates/gui/src-tauri
  cargo tauri dev
  ```

### 3. Testing

Run Rust core unit tests:
```bash
cargo test --workspace
```

Run E2E integration tests:
```bash
cd e2e
pnpm run test
```

### 4. Compilation & Production Build

To build the binaries locally (producing `climaster` CLI and `climaster-gui` in the `target/release` folder):
```bash
cargo build --release --workspace
```

To build and package the Tauri GUI distribution locally (this outputs the NSIS Installer `.exe` in `target/release/bundle/nsis/`):
```bash
npx @tauri-apps/cli build
```

---

## 🤖 CI/CD Workflows

This project uses GitHub Actions to automate verification and packaging:

### 1. Continuous Integration (`ci.yml`)
Runs on every push or pull request to the `master` branch:
- Installs Rust, Node.js, and dependencies.
- Runs Rust workspace tests (`cargo test`).
- Compiles the workspace binaries.
- Executes the Vitest E2E test suite.

### 2. Continuous Delivery (`release.yml`)
Runs on pushing a version tag (e.g., `git tag v1.0.0` & `git push origin v1.0.0`):
- Compiles the release binaries in workspace.
- Packages the **Windows EXE Installer** using Tauri's NSIS bundler.
- Compresses `CliMaster.exe` and `climaster.exe` alongside the README into a **Windows Portable Package** (`CliMaster-portable-x64.zip`).
- Publishes a new GitHub Release with these assets attached.

---

## ⚙️ Configuration & Data Storage

CliMaster stores all CLI tools, categories, execution logs, and templates in a single JSON registry file:
- **Location**: `climaster.json` located in the user's local application data directory (e.g. `AppData/Local/climaster/climaster.json` on Windows).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
