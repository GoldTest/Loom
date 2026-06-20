import { execa } from 'execa';
import * as path from 'path';
import * as fs from 'fs';
import { describe, test, expect, beforeEach, afterAll } from 'vitest';

const CLI_BINARY = path.resolve(__dirname, '../../target/debug/climaster');
const CONFIG_PATH = path.resolve(__dirname, '../temp_config_cli.json');

async function runCli(args: string[], env: any = {}) {
  const ext = process.platform === 'win32' ? '.exe' : '';
  const binPath = `${CLI_BINARY}${ext}`;
  return await execa(binPath, args, {
    env: {
      CLIMASTER_CONFIG_PATH: CONFIG_PATH,
      ...env
    },
    reject: false
  });
}

function writeMockConfig(data: any) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(data, null, 2));
}

describe('climaster CLI E2E tests', () => {
  beforeEach(() => {
    if (fs.existsSync(CONFIG_PATH)) {
      fs.unlinkSync(CONFIG_PATH);
    }
  });

  afterAll(() => {
    if (fs.existsSync(CONFIG_PATH)) {
      fs.unlinkSync(CONFIG_PATH);
    }
  });

  // F5: climaster CLI Tool (5 tests)
  test('test_cli_help_menu', async () => {
    const res = await runCli(['--help']);
    expect(res.exitCode).toBe(0);
    expect(res.stdout).toContain('climaster - CLI Tool Manager');
    expect(res.stdout).toContain('Usage:');

    const resShort = await runCli(['-h']);
    expect(resShort.exitCode).toBe(0);
    expect(resShort.stdout).toContain('climaster - CLI Tool Manager');
  });

  test('test_cli_version_info', async () => {
    const res = await runCli(['--version']);
    expect(res.exitCode).toBe(0);
    expect(res.stdout).toContain('climaster 0.1.0');

    const resShort = await runCli(['-v']);
    expect(resShort.exitCode).toBe(0);
    expect(resShort.stdout).toContain('climaster 0.1.0');
  });

  test('test_cli_list_default_table', async () => {
    writeMockConfig({
      cli_tools: [
        {
          id: '1',
          name: 'git',
          path: 'C:\\Program Files\\Git\\cmd\\git.exe',
          version: '2.40.0',
          category_id: 'category-dev',
          custom_env: {}
        }
      ],
      categories: [],
      templates: []
    });

    const res = await runCli(['list']);
    expect(res.exitCode).toBe(0);
    expect(res.stdout).toContain('Name');
    expect(res.stdout).toContain('Path');
    expect(res.stdout).toContain('git');
    expect(res.stdout).toContain('category-dev');
  });

  test('test_cli_list_json_format', async () => {
    writeMockConfig({
      cli_tools: [
        {
          id: '1',
          name: 'git',
          path: 'C:\\Program Files\\Git\\cmd\\git.exe',
          version: '2.40.0',
          category_id: 'category-dev',
          custom_env: {}
        }
      ],
      categories: [],
      templates: []
    });

    const res = await runCli(['list', '--json']);
    expect(res.exitCode).toBe(0);
    const parsed = JSON.parse(res.stdout);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].name).toBe('git');
    expect(parsed[0].path).toBe('C:\\Program Files\\Git\\cmd\\git.exe');
  });

  test('test_cli_search_by_query', async () => {
    writeMockConfig({
      cli_tools: [
        {
          id: '1',
          name: 'git',
          path: 'C:\\Program Files\\Git\\cmd\\git.exe',
          version: '2.40.0',
          category_id: 'category-dev',
          custom_env: {}
        },
        {
          id: '2',
          name: 'npm',
          path: 'C:\\Program Files\\nodejs\\npm.cmd',
          version: '9.0.0',
          category_id: 'category-node',
          custom_env: {}
        }
      ],
      categories: [],
      templates: []
    });

    const res = await runCli(['search', 'git']);
    expect(res.exitCode).toBe(0);
    expect(res.stdout).toContain('git');
    expect(res.stdout).not.toContain('npm');

    const resJson = await runCli(['search', 'npm', '--json']);
    expect(resJson.exitCode).toBe(0);
    const parsed = JSON.parse(resJson.stdout);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].name).toBe('npm');
  });

  // Boundary/Corner Cases (5 tests)
  test('test_cli_unknown_subcommand', async () => {
    const res = await runCli(['invalid_cmd']);
    expect(res.exitCode).toBe(1);
    expect(res.stderr).toContain("Error: Unknown command 'invalid_cmd'");
  });

  test('test_cli_search_empty_query', async () => {
    const res = await runCli(['search']);
    expect(res.exitCode).toBe(1);
    expect(res.stderr).toContain('Error: search query is required');
  });

  test('test_cli_list_invalid_format', async () => {
    const res = await runCli(['list', '--format', 'invalid']);
    expect(res.exitCode).toBe(1);
    expect(res.stderr).toContain("Error: invalid format 'invalid'");
  });

  test('test_cli_excessive_arguments', async () => {
    const res = await runCli(['list', 'extra', 'arg1', 'arg2']);
    expect(res.exitCode).toBe(1);
    expect(res.stderr).toContain("Error: excessive or unknown argument 'extra'");
  });

  test('test_cli_json_parse_empty_db', async () => {
    // Write an empty structure
    writeMockConfig({
      cli_tools: [],
      categories: [],
      templates: []
    });

    const res = await runCli(['list', '--json']);
    expect(res.exitCode).toBe(0);
    const parsed = JSON.parse(res.stdout);
    expect(parsed).toEqual([]);
  });
});
