# Loom

## Skills

This project uses the Agent Skills framework for domain-specific guidance.

### harnspec - Spec-Driven Development methodology

- **Location**: [.agents/skills/harnspec/SKILL.md](.agents/skills/harnspec/SKILL.md)
- **Use when**: Working with specs, planning features, multi-step changes
- **Key principle**: Run `board` or `search` before creating specs

Read the skill file for complete SDD workflow guidance.

## Project-Specific Rules

- **版本号更新规则**: 每个版本约束 21 个小版本，超出后更新次高版本（即第二位加 1，第三位重置为 1）。例如 `0.1.21` 下一个版本为 `0.2.1`，持续到 `0.2.21` 后更新到 `0.3.1`，以此类推。

- **GitHub Operations**: When executing any operations or commands related to GitHub repositories, issues, PRs, or GitHub Actions, always use the GitHub CLI (`gh`) tool.

- Code style preferences
- Naming conventions
- Team workflows
- Custom tooling
