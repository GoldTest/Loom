---
status: complete
created: 2026-06-20
priority: medium
tags:
- gui
- tauri
- settings
- categories
parent: 001-climaster-project
created_at: 2026-06-20T13:41:29.162123500Z
updated_at: 2026-06-30T15:09:53.899306900Z
completed_at: 2026-06-30T15:09:53.899306900Z
transitions:
- status: in-progress
  at: 2026-06-20T13:42:23.565763100Z
- status: complete
  at: 2026-06-30T15:09:53.899306900Z
---

# Smart Categorization, Category Improvements, Font Management, and UI Fixes

## Overview
Enhance category management with smart classification and name editing, introduce font management in the Settings tab, resolve dropdown readability issues in dark mode, and align sidebar tabs properly.

## Requirements
  - [x] **Smart Classification**:
    - Automatically analyze registered CLI tools and assign them.
    - Windows/System tools (e.g., `cmd`, `powershell`, `ping`, `ipconfig`, `netstat`) should be assigned to "System" ("系统").
    - Development tools (e.g., `java`, `javac`, `git`, `rustc`, `cargo`, `node`, `npm`, `python`, `pip`) should be assigned to "Development" ("开发").
    - Dynamically check/create the target categories (using Chinese names if language is "zh", otherwise English).
    - Add a "Smart Classify" button in the Categories page.
  - [x] **Category Editing**:
    - Add the ability to edit a category's name and description.
    - Expose a backend command `update_category(cat_id, name, desc)`.
    - Add an edit button (📝) to each category card in the frontend that triggers an edit modal.
  - [x] **Category UI Optimization**:
    - Make the layout cleaner and more intuitive.
    - Show a summary of categorized vs uncategorized tools.
    - Render a clear lists of categories with smooth hover animations.
  - [x] **Font Management**:
    - Add font family and font size settings to the Settings page.
    - Predefined font families: Plus Jakarta Sans, Inter, Outfit, JetBrains Mono, Fira Code, System Default.
    - Include a custom font family input.
    - Predefined font sizes: Small (12px), Medium (14px), Large (16px), Extra Large (18px).
    - Store font selections in config and apply them globally using CSS variables.
  - [x] **Dark Theme Dropdown Fix**:
    - Ensure all `<select>` options are fully readable in dark theme by applying solid backgrounds (`var(--bg-modal)`) and correct text colors.
  - [x] **Sidebar Tab Alignment**:
    - Fix misalignments where sidebar tab icons and text are not vertically centered.

## Non-Goals
- Automatic classification running in the background without user triggering it.
- Editing CLI tool details directly from the categories page.

## Technical Notes
- **Backend (Rust)**:
  - Update `CliMasterStorage` model in `crates/core/src/storage/models.rs` to include `font_family` (default "Plus Jakarta Sans") and `font_size` (default "14px").
  - Add `update_category` in `crates/core/src/storage/manager.rs` to edit category name and description.
  - Add `smart_classify` in `crates/core/src/storage/manager.rs` to run the smart classification logic.
  - Add getters and setters for `font_family` and `font_size` in `crates/core/src/storage/manager.rs`.
  - Register all new Tauri commands in `crates/gui/src-tauri/src/main.rs`.
- **Frontend (React/TypeScript/CSS)**:
  - Add new API wrappers in `api.ts`.
  - Update `I18nContext.tsx` with Chinese and English translations for all new actions and settings.
  - Refine `CategoriesPage.tsx` with an edit button/modal, a "Smart Classify" button, and uncategorized stats.
  - Refine `SettingsPage.tsx` with font management controls.
  - Update `index.css` to fix select options styling, sidebar item centering, and apply font variables.

## Acceptance Criteria
  - [x] The Categories tab has a "Smart Classify" button that assigns tools to "System"/"Development" categories successfully.
  - [x] Category cards have an edit option, allowing updates to both name and description which persist on restart.
  - [x] Dropdowns under dark theme are fully readable (no white-on-white text).
  - [x] Font selections in the Settings tab immediately apply to the UI and persist on application reload.
  - [x] Sidebar icons and text are perfectly centered vertically.
