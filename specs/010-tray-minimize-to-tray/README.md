---
status: complete
created: 2026-06-20
priority: medium
tags:
- gui
- tauri
- tray
parent: 001-climaster-project
created_at: 2026-06-20T10:00:13.058817700Z
updated_at: 2026-06-20T10:21:39.923164500Z
completed_at: 2026-06-20T10:21:39.923164500Z
transitions:
- status: in-progress
  at: 2026-06-20T10:00:52.677899500Z
- status: complete
  at: 2026-06-20T10:21:39.923164500Z
---

# Tray Icon and Minimize to Tray

## Overview
Implement a system tray icon for CliMaster and support minimizing the application to the system tray when clicking the close button ("X") in the top-right corner. This allows the application to run in the background, monitor active CLI process instances, and quickly restore the GUI.

## Requirements
- [x] **System Tray Setup**:
  - Configure the Tauri system tray icon on application startup.
  - Use a custom-designed CliMaster icon for the tray.
  - Implement a system tray context menu with "Show CliMaster" and "Quit" options.
- [x] **Minimize/Close to Tray**:
  - Intercept the window close request (`WindowEvent::CloseRequested`) and prevent the window from destroying the process.
  - Hide the main window instead of closing it when the close request is triggered.
- [x] **Tray Event Handling**:
  - Clicking the tray icon should toggle window visibility (show/focus if hidden, hide if visible) or always show the window.
  - Clicking the "Show CliMaster" tray menu item should show and focus the window.
  - Clicking the "Quit" tray menu item should fully terminate the application.
- [x] **Documentation Update**:
  - Update the main `README.md` to describe the new system tray feature, close-to-tray behavior, and how to exit the app.

## Non-Goals
- Adding complex settings in the GUI to toggle close-to-tray behavior (it will be the default behavior).
- Supporting multiple window tray indicators.

## Technical Notes
- **Tauri v2 Tray Icon Configuration**:
  - Enable `tray-icon` and `image-png` features in `Cargo.toml` of `crates/gui/src-tauri`.
  - Add tray building logic in `main.rs` using `tauri::tray::TrayIconBuilder`.
  - Intercept window close in `main.rs` via `.on_window_event`.
  - Copy the generated `climaster_logo` PNG to `crates/gui/src-tauri/icons/tray.png` and use it.

## Acceptance Criteria
- [x] The application starts with a system tray icon.
- [x] Clicking the top-right close button hides the window without exiting the process.
- [x] Clicking the tray icon or selecting "Show CliMaster" from the tray menu restores and focuses the window.
- [x] Selecting "Quit" from the tray menu terminates the process completely.
- [x] README.md has been updated to reflect these changes.
