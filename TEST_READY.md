# TEST_READY

This document contains instructions to run the E2E test suite for CliMaster and provides a checklist mapping to all 71 implemented test cases.

## How to Run the Tests

### 1. Compile the Cargo Workspace
Ensure both the CLI and GUI packages are compiled and available in target debug folder:
```powershell
cargo build --workspace
```

### 2. Install E2E Test Dependencies
Navigate to the `e2e` directory and install the Node.js packages:
```powershell
cd e2e
pnpm install
```

### 3. Execute the E2E Test Suite
Run the test suite using Vitest:
```powershell
pnpm run test
```

---

## Test Cases Coverage Checklist (71/71)

### Tier 1: Feature Coverage (30/30)

#### F1: CLI List & Categorization (5/5)
- [x] `test_gui_list_displays_all_cli_tools`
- [x] `test_gui_create_category`
- [x] `test_gui_assign_cli_to_category`
- [x] `test_gui_filter_by_category`
- [x] `test_gui_persistence_across_sessions`

#### F2: Custom Environment Variables (5/5)
- [x] `test_gui_view_env_vars`
- [x] `test_gui_add_custom_env_var`
- [x] `test_gui_edit_custom_env_var`
- [x] `test_gui_delete_custom_env_var`
- [x] `test_gui_env_var_persistence`

#### F3: Run Parameter Templates (5/5)
- [x] `test_template_create`
- [x] `test_template_list`
- [x] `test_template_update`
- [x] `test_template_delete`
- [x] `test_template_persistence`

#### F4: Process Execution & Lifecycle (5/5)
- [x] `test_process_start_from_template`
- [x] `test_process_stdout_log_streaming`
- [x] `test_process_stderr_log_streaming`
- [x] `test_process_terminate_kill`
- [x] `test_process_status_events`

#### F5: climaster CLI Tool (5/5)
- [x] `test_cli_help_menu`
- [x] `test_cli_version_info`
- [x] `test_cli_list_default_table`
- [x] `test_cli_list_json_format`
- [x] `test_cli_search_by_query`

#### F6: Auto-Scanner & Manual Importer (5/5)
- [x] `test_scanner_crawl_path_env`
- [x] `test_scanner_deduplicate_executables`
- [x] `test_importer_single_file`
- [x] `test_importer_directory_scan`
- [x] `test_importer_invalid_path_error`

---

### Tier 2: Boundary & Corner Cases (30/30)

#### F1: CLI List & Categorization (5/5)
- [x] `test_category_duplicate_name`
- [x] `test_category_empty_name`
- [x] `test_category_name_too_long`
- [x] `test_cli_assign_nonexistent_category`
- [x] `test_list_when_config_is_empty`

#### F2: Custom Environment Variables (5/5)
- [x] `test_env_key_empty`
- [x] `test_env_key_invalid_chars`
- [x] `test_env_value_empty`
- [x] `test_env_extremely_large_value`
- [x] `test_env_duplicate_keys`

#### F3: Run Parameter Templates (5/5)
- [x] `test_template_invalid_pwd`
- [x] `test_template_empty_args`
- [x] `test_template_name_empty`
- [x] `test_template_duplicate_name`
- [x] `test_template_missing_cli_id`

#### F4: Process Execution & Lifecycle (5/5)
- [x] `test_run_nonexistent_binary`
- [x] `test_kill_already_stopped_process`
- [x] `test_process_very_long_running_output`
- [x] `test_kill_deeply_nested_process_tree`
- [x] `test_run_binary_lacking_executable_permissions`

#### F5: climaster CLI Tool (5/5)
- [x] `test_cli_unknown_subcommand`
- [x] `test_cli_search_empty_query`
- [x] `test_cli_list_invalid_format`
- [x] `test_cli_excessive_arguments`
- [x] `test_cli_json_parse_empty_db`

#### F6: Auto-Scanner & Manual Importer (5/5)
- [x] `test_scanner_empty_path`
- [x] `test_importer_directory_no_executables`
- [x] `test_importer_deeply_nested_directories`
- [x] `test_importer_symbolic_link_cycle`
- [x] `test_importer_locked_system_files`

---

### Tier 3: Cross-Feature Combinations (6/6)
- [x] `test_cross_scan_and_auto_assign_category`
- [x] `test_cross_import_and_create_template`
- [x] `test_cross_update_env_and_run_template`
- [x] `test_cross_delete_cli_cascades_templates`
- [x] `test_cross_delete_category_orphans_clis`
- [x] `test_cross_cli_query_after_gui_modifications`

---

### Tier 4: Real-World Scenarios (5/5)
- [x] `scenario_development_toolchain_setup`
- [x] `scenario_network_diagnostics_lifecycle`
- [x] `scenario_environment_override_execution`
- [x] `scenario_database_backup_cron_mock`
- [x] `scenario_system_cleanup_and_recovery`
