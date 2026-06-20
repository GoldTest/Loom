# Original User Request

## Initial Request — 2026-06-20T13:54:24+08:00

CLImaster是一个本地命令行工具(CLI)管理软件，包含可视化界面和自身的CLI。所有核心逻辑与CLI程序采用 Rust 实现，GUI 推荐采用 Rust 桌面框架（如 Tauri）结合 Web 前端构建。

Working directory: d:\Develop\CliMaster
Integrity mode: development

## Requirements

### R1. 可视化界面 (GUI) 与分类管理
- 必须实现一个美观、响应式的桌面端可视化界面。
- 支持展示全局已安装的 CLI 工具（包括名称、路径、版本等基础信息）。
- 支持对 CLI 工具进行“分类 (Categorization)”管理（例如：开发工具、系统工具、网络工具等）。
- 支持查看和管理各 CLI 的环境变量。

### R2. CLI 运行模板与实例生命周期管理
- 支持针对每个 CLI 创建和保存“运行参数模板”（可配置默认参数、自定义环境变量、默认工作目录等）。
- 允许在 GUI 界面内直接运行指定的 CLI 工具（使用选定的模板）。
- 能够监控运行中的 CLI 实例，实时查看/流式输出其标准输出 (stdout) 和标准错误 (stderr)。
- 能够对运行中的 CLI 实例执行停止/终止 (Kill)操作。

### R3. 自身的 CLI 工具 (CLImaster CLI)
- 提供一个名为 `climaster` 的全局可执行命令行工具。
- 支持通过命令行查询已安装、已扫描或已注册的全局 CLI 工具信息。
- 查询结果支持以结构化格式（如 JSON 或格式化表格）输出，以便于其他工具解析。

### R4. 全局 CLI 自动扫描与手动导入
- 具备自动扫描系统 `PATH` 环境变量下的所有可执行文件（在 Windows 下如 `.exe`, `.bat`, `.cmd`, `.ps1` 等）并建立索引的能力。
- 支持用户手动导入单个 CLI 可执行文件，或添加特定本地文件夹以进行批量扫描。

### R5. 规范驱动开发 (HarnSpec Process Management)
- 必须使用当前项目中的 `harnspec` CLI 进行开发过程的任务拆分、进度跟踪与交付管理。
- 任务启动时，应在 `specs/` 目录下创建对应的特性规范（通过 `harnspec create`）。
- 任务执行过程中，通过更新 spec 状态（从 `draft`/`planned` 到 `in-progress`，最终到 `complete`）来同步并交付每一阶段的代码和文档。

## Verification Plan

### Automated Tests (Programmatic)
- 编写测试脚本，通过调用 `climaster` CLI（例如 `climaster list --format json`）验证其能正确输出已扫描/注册的 CLI 列表，并且格式符合 JSON 规范。
- 验证当执行手动导入或路径扫描后，`climaster` CLI 的查询更新。
- 运行 `harnspec validate` 验证所有 spec 均符合 HarnSpec 规范。

### Manual Verification (Agent-as-judge)
- 验证在 GUI 界面中创建分类，并成功将 CLI 分配到对应分类中。
- 验证环境变量的展示和修改能够被正确保存。
- 运行一个持续输出日志的模拟 CLI 工具（如 `ping` 或自定义脚本），验证 GUI 能实时显示输出。
- 在 GUI 中终止该模拟 CLI，验证其进程树被彻底清理（没有孤儿进程残留）。

## Acceptance Criteria

### CLI 管理与分类
- [ ] 可视化界面能正确列出所有扫描到及手动导入 of CLI，并支持按分类（例如开发、网络）筛选。
- [ ] 分类信息与导入 of CLI 记录能够持久化（如保存在本地 JSON 配置文件或 SQLite 数据库中），应用重启后不丢失。
- [ ] 可以在 GUI 中修改 CLI 相关的自定义环境变量，并在运行时生效。

### 运行模板与进程管理
- [ ] 支持为每个 CLI 工具创建并保存至少一个预设模板（参数、目录、环境变量）。
- [ ] 在 GUI 内启动 CLI 实例后，应有独立的实时日志输出视图显示 stdout 与 stderr。
- [ ] 提供明确的“停止/终止”按钮，点击后能够彻底杀死该 CLI 进程（包括其子进程），且 UI 状态更新为“已停止”。

### climaster 命令行工具
- [ ] 提供独立可执行文件 `climaster`，并能够通过命令行参数（例如 `list` 或 `query`）查询当前系统已登记的所有 CLI 信息。
- [ ] 支持通过 `--json` 或类似参数使 CLI 输出标准的 JSON 格式数据。

### 扫描与导入功能
- [ ] 能够读取系统环境变量 `PATH` 并扫描出其中的可执行文件，过滤掉非 CLI 的文件（或按执行文件名做基础去重）。
- [ ] 用户可以通过 GUI 手动选择一个本地可执行文件进行导入，或者选择一个文件夹扫描其下的所有可执行文件。

### 开发交付规范
- [ ] 所有开发里程碑均在 `specs/` 目录下有对应的 spec，且状态均更新为 `complete`。
- [ ] 运行 `harnspec board` 无遗留的 `draft`、`planned` 或 `in-progress` 状态的核心规范。
