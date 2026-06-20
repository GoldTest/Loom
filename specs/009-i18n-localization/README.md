---
status: complete
created: 2026-06-20
priority: high
tags:
- i18n
- ui
parent: 001-climaster-project
created_at: 2026-06-20T09:47:52.286213500Z
updated_at: 2026-06-20T09:47:52.286213500Z
completed_at: 2026-06-20T09:54:50.000000000Z
---

# i18n Chinese-English Localization

## Overview
Add internationalization (i18n) support to CliMaster, allowing users to switch between Chinese and English interfaces. The application must default to Chinese (`zh`) on initial startup, persist the user's language selection across sessions, and update all UI elements dynamically.

## Requirements
- [x] **I18n Translation Store**:
  - Implement language resource files (or dictionary objects) for Chinese (`zh`) and English (`en`).
  - Translate all frontend UI text, including dashboard panels, buttons, tooltips, dialogs, template managers, scanner results, and notifications.
- [x] **State & Persistence**:
  - Add `language` field (string, e.g. `"zh"` or `"en"`) to the storage settings in `climaster.json`.
  - On app launch, default to `"zh"` if no language preference exists in configuration.
  - Expose Tauri command `get_language() -> String` and `set_language(lang: String) -> Result<(), String>` to query and update the persistent language settings.
- [x] **Frontend Language Switcher**:
  - Add a language switching selector/dropdown in the GUI header or settings panel.
  - Ensure the UI text updates instantly upon selection without requiring a restart or page reload.
- [x] **Verification**:
  - Add E2E tests to verify default Chinese rendering, toggle functionality to English, and persistence across app reload.

## Non-Goals
- Localizing the CLI commands themselves (they remain standard commands in English, but the CLI output formatting should align if appropriate, though not strictly required).
- Supporting languages other than Chinese and English in this phase.

## Technical Notes
- Frontend: Use a lightweight i18n hook or helper in the React frontend (or native JS translation map) to translate keys.
- Persistence: Extend the Rust `CliMasterStorage` struct with `language` field:
  ```rust
  #[serde(default = "default_language")]
  pub language: String,
  ```

## Acceptance Criteria
- [x] The GUI displays in Chinese on first run.
- [x] The language selection persists in `climaster.json`.
- [x] Switching to English immediately translates the GUI to English.
- [x] E2E tests for i18n pass successfully.
