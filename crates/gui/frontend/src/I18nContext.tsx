import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'zh' | 'en';

type Dictionary = Record<string, string>;

const zhDict: Dictionary = {
  // Sidebar / Nav
  'nav.cliTools': 'CLI 工具',
  'nav.categories': '分类管理',
  'nav.envVars': '环境变量',
  'nav.templates': '运行模板',
  'nav.instances': '运行实例',
  'nav.manage': '管理',
  'nav.run': '运行',
  'nav.logoSubtitle': '全局 CLI 工具管理器',
  'nav.stats.tools': '工具数',
  'nav.stats.running': '运行中',
  'nav.stats.categories': '分类数',

  // Dashboard
  'db.title': 'CLI 工具',
  'db.subtitle': '{count} 个已注册的工具',
  'db.btn.import': '导入可执行文件',
  'db.btn.scan': '扫描 PATH',
  'db.btn.scanning': '扫描中…',
  'db.search.placeholder': '搜索名称 or 路径…',
  'db.filter.allCategories': '所有分类',
  'db.btn.clear': '清除',
  'db.empty.noTools': '暂无工具',
  'db.empty.noResults': '无搜索结果',
  'db.empty.desc.noTools': '点击“扫描 PATH”自动发现全局安装的 CLI 工具。',
  'db.empty.desc.noResults': '尝试调整搜索词或分类筛选。',
  'db.empty.btn.scanNow': '立即扫描 PATH',
  'db.tool.uncategorized': '未分类',
  'db.tool.noCategory': '无分类',
  'db.prompt.import': '请输入可执行文件的完整路径：',
  'db.confirm.remove': '确定要移除该 CLI 工具吗？',
  'db.toast.loadFailed': '加载 CLI 工具失败',
  'db.toast.scanSuccess': 'PATH 扫描完成，发现 {count} 个工具',
  'db.toast.scanFailed': '扫描失败',
  'db.toast.imported': 'CLI 工具导入成功',
  'db.toast.importFailed': '导入失败',
  'db.toast.removed': '工具已成功移除',
  'db.toast.removeFailed': '删除失败',
  'db.toast.catUpdated': '分类已更新',
  'db.toast.catUpdateFailed': '更新分类失败',

  // CategoriesPage
  'cat.title': '分类管理',
  'cat.subtitle': '{catCount} 个分类 · 共 {toolCount} 个工具',
  'cat.btn.new': '新建分类',
  'cat.empty.noCats': '暂无分类',
  'cat.empty.desc': '创建分类以按类型或用途组织您的 CLI 工具。',
  'cat.empty.btn.createFirst': '创建第一个分类',
  'cat.card.toolsCount': '{count} 个工具',
  'cat.card.noTools': '未分配工具',
  'cat.card.more': '还有 {count} 个',
  'cat.modal.newTitle': '新建分类',
  'cat.modal.name': '分类名称',
  'cat.modal.namePlaceholder': '例如：开发工具',
  'cat.modal.desc': '描述（可选）',
  'cat.modal.descPlaceholder': '分类描述…',
  'cat.modal.btn.cancel': '取消',
  'cat.modal.btn.creating': '创建中…',
  'cat.modal.btn.create': '创建',
  'cat.toast.nameRequired': '分类名称不能为空',
  'cat.toast.created': '分类 "{name}" 创建成功',
  'cat.toast.createFailed': '创建分类失败',
  'cat.confirm.deleteWithTools': '确定要删除 "{name}" 吗？这将使 {count} 个工具变为未分类。',
  'cat.confirm.delete': '确定要删除分类 "{name}" 吗？',
  'cat.toast.deleted': '分类 "{name}" 已成功删除',
  'cat.toast.deleteFailed': '删除失败',

  // EnvVarsPage
  'env.title': '自定义环境变量',
  'env.desc': '选择下方的 CLI 工具以查看和自定义其环境变量。',
  'env.search.placeholder': '搜索工具…',
  'env.editor.title': '配置环境变量：{name}',
  'env.editor.subtitle': '添加在执行该工具时将被注入的自定义环境变量。',
  'env.table.key': '键',
  'env.table.value': '值',
  'env.table.actions': '操作',
  'env.empty.noVars': '暂未设置自定义环境变量。',
  'env.btn.newVar': '新建环境变量',
  'env.btn.add': '添加',
  'env.btn.save': '保存所有修改',
  'env.btn.saving': '保存中…',
  'env.toast.saved': '环境变量保存成功',
  'env.toast.saveFailed': '环境变量保存失败',
  'env.toast.selectTool': '请先选择一个 CLI 工具',
  'env.toast.keyEmpty': '键不能为空',
  'env.toast.dupKey': '重复的键：{key}',

  // TemplatesPage
  'temp.title': '运行参数模板',
  'temp.desc': '创建并保存配置模板，以便使用预定义的参数、环境变量覆盖和工作目录快速运行 CLI 工具。',
  'temp.btn.new': '新建模板',
  'temp.empty.noTemps': '暂无模板',
  'temp.empty.desc': '创建模板来配置如何运行 CLI 工具。',
  'temp.empty.btn.createFirst': '创建第一个模板',
  'temp.card.args': '参数',
  'temp.card.envs': '环境变量覆盖',
  'temp.card.pwd': '工作目录',
  'temp.card.notSet': '未设置',
  'temp.card.lastRun': '上次运行',
  'temp.card.never': '从未',
  'temp.card.btn.run': '运行',
  'temp.card.btn.edit': '修改',
  'temp.card.btn.delete': '删除',
  'temp.confirm.delete': '确定要删除模板 "{name}" 吗？',
  'temp.toast.deleted': '模板已成功删除',
  'temp.toast.launched': '实例已成功启动',
  'temp.toast.launchFailed': '启动实例失败',
  'temp.modal.newTitle': '新建运行模板',
  'temp.modal.editTitle': '编辑运行模板',
  'temp.modal.tool': 'CLI 工具',
  'temp.modal.selectTool': '选择 CLI 工具…',
  'temp.modal.name': '模板名称',
  'temp.modal.namePlaceholder': '例如：Git Status',
  'temp.modal.args': '运行参数（每行一个）',
  'temp.modal.argsPlaceholder': '例如：status',
  'temp.modal.pwd': '工作目录（可选）',
  'temp.modal.pwdPlaceholder': '例如：C:\\my-project',
  'temp.modal.vars': '变量',
  'temp.modal.btn.addVar': '添加变量',
  'temp.modal.noVars': '暂无自定义模板环境变量。',
  'temp.modal.btn.save': '保存',
  'temp.modal.btn.creating': '创建中…',
  'temp.modal.btn.saving': '保存中…',
  'temp.toast.fieldsRequired': '所有字段均为必填项',
  'temp.toast.created': '模板创建成功',
  'temp.toast.createFailed': '创建模板失败',
  'temp.toast.updated': '模板更新成功',
  'temp.toast.updateFailed': '更新模板失败',

  // InstancesPage
  'inst.title': '正在运行的实例',
  'inst.desc': '监控并控制实时的 CLI 执行、查看实时输出日志并终止活动进程树。',
  'inst.empty.title': '无活动运行实例',
  'inst.empty.desc': '启动运行模板即可在此实时查看其运行状态。',
  'inst.table.status': '状态',
  'inst.table.pid': 'PID',
  'inst.table.template': '运行模板',
  'inst.table.tool': '工具',
  'inst.table.started': '启动时间',
  'inst.table.actions': '操作',
  'inst.status.running': '运行中',
  'inst.status.stopped': '已停止',
  'inst.status.failed': '失败',
  'inst.exitCode': '退出码 {code}',
  'inst.btn.terminate': '终止',
  'inst.terminal.title': '终端输出',
  'inst.terminal.clear': '清空日志',
  'inst.terminal.noLogs': '暂无日志输出。',
  'inst.confirm.terminate': '确定要终止该实例及其所有子进程吗？',
  'inst.toast.terminated': '实例已成功终止',
  'inst.toast.terminateFailed': '终止失败',
};

const enDict: Dictionary = {
  // Sidebar / Nav
  'nav.cliTools': 'CLI Tools',
  'nav.categories': 'Categories',
  'nav.envVars': 'Env Variables',
  'nav.templates': 'Templates',
  'nav.instances': 'Instances',
  'nav.manage': 'Manage',
  'nav.run': 'Run',
  'nav.logoSubtitle': 'Global CLI Manager',
  'nav.stats.tools': 'Tools',
  'nav.stats.running': 'Running',
  'nav.stats.categories': 'Categories',

  // Dashboard
  'db.title': 'CLI Tools',
  'db.subtitle': '{count} tools registered',
  'db.btn.import': 'Import Executable',
  'db.btn.scan': 'Scan PATH',
  'db.btn.scanning': 'Scanning…',
  'db.search.placeholder': 'Search by name or path…',
  'db.filter.allCategories': 'All Categories',
  'db.btn.clear': 'Clear',
  'db.empty.noTools': 'No tools yet',
  'db.empty.noResults': 'No results',
  'db.empty.desc.noTools': 'Click "Scan PATH" to discover all globally installed CLI tools.',
  'db.empty.desc.noResults': 'Try adjusting your search or filter.',
  'db.empty.btn.scanNow': 'Scan PATH Now',
  'db.tool.uncategorized': 'Uncategorized',
  'db.tool.noCategory': 'No Category',
  'db.prompt.import': 'Enter full path to executable:',
  'db.confirm.remove': 'Remove this CLI tool?',
  'db.toast.loadFailed': 'Failed to load CLI tools',
  'db.toast.scanSuccess': 'Scanned PATH — found {count} tools',
  'db.toast.scanFailed': 'Scan failed',
  'db.toast.imported': 'CLI tool imported',
  'db.toast.importFailed': 'Import failed',
  'db.toast.removed': 'Tool removed',
  'db.toast.removeFailed': 'Delete failed',
  'db.toast.catUpdated': 'Category updated',
  'db.toast.catUpdateFailed': 'Failed to update category',

  // CategoriesPage
  'cat.title': 'Categories',
  'cat.subtitle': '{catCount} categories · {toolCount} total tools',
  'cat.btn.new': 'New Category',
  'cat.empty.noCats': 'No categories yet',
  'cat.empty.desc': 'Create categories to organize your CLI tools by type or purpose.',
  'cat.empty.btn.createFirst': 'Create First Category',
  'cat.card.toolsCount': '{count} tools',
  'cat.card.noTools': 'No tools assigned',
  'cat.card.more': '+{count} more',
  'cat.modal.newTitle': 'New Category',
  'cat.modal.name': 'Category Name',
  'cat.modal.namePlaceholder': 'e.g. Development Tools',
  'cat.modal.desc': 'Description (optional)',
  'cat.modal.descPlaceholder': 'Category description…',
  'cat.modal.btn.cancel': 'Cancel',
  'cat.modal.btn.creating': 'Creating…',
  'cat.modal.btn.create': 'Create',
  'cat.toast.nameRequired': 'Category name is required',
  'cat.toast.created': 'Category "{name}" created',
  'cat.toast.createFailed': 'Failed to create category',
  'cat.confirm.deleteWithTools': 'Delete "{name}"? {count} tool(s) will become uncategorized.',
  'cat.confirm.delete': 'Delete category "{name}"?',
  'cat.toast.deleted': 'Category "{name}" deleted',
  'cat.toast.deleteFailed': 'Delete failed',

  // EnvVarsPage
  'env.title': 'Custom Env Variables',
  'env.desc': 'Select a CLI tool below to view and customize its environment variables.',
  'env.search.placeholder': 'Search tools…',
  'env.editor.title': 'Configure Variables for {name}',
  'env.editor.subtitle': 'Add custom environment variables that will be injected when this tool is executed.',
  'env.table.key': 'Key',
  'env.table.value': 'Value',
  'env.table.actions': 'Actions',
  'env.empty.noVars': 'No custom env variables set.',
  'env.btn.newVar': 'New Env Variable',
  'env.btn.add': 'Add',
  'env.btn.save': 'Save All Changes',
  'env.btn.saving': 'Saving…',
  'env.toast.saved': 'Variables saved successfully',
  'env.toast.saveFailed': 'Failed to save variables',
  'env.toast.selectTool': 'Please select a CLI tool first',
  'env.toast.keyEmpty': 'Key cannot be empty',
  'env.toast.dupKey': 'Duplicate key: {key}',

  // TemplatesPage
  'temp.title': 'Run Templates',
  'temp.desc': 'Create and save configuration templates to quickly run CLI tools with pre-defined arguments, environment overrides, and working directories.',
  'temp.btn.new': 'New Template',
  'temp.empty.noTemps': 'No templates yet',
  'temp.empty.desc': 'Create templates to configure how CLI tools should be run.',
  'temp.empty.btn.createFirst': 'Create First Template',
  'temp.card.args': 'Arguments',
  'temp.card.envs': 'Env Overrides',
  'temp.card.pwd': 'Working Dir',
  'temp.card.notSet': 'Not set',
  'temp.card.lastRun': 'Last Run',
  'temp.card.never': 'Never',
  'temp.card.btn.run': 'Run',
  'temp.card.btn.edit': 'Edit',
  'temp.card.btn.delete': 'Delete',
  'temp.confirm.delete': 'Delete template "{name}"?',
  'temp.toast.deleted': 'Template deleted',
  'temp.toast.launched': 'Instance launched',
  'temp.toast.launchFailed': 'Failed to launch instance',
  'temp.modal.newTitle': 'New Run Template',
  'temp.modal.editTitle': 'Edit Run Template',
  'temp.modal.tool': 'CLI Tool',
  'temp.modal.selectTool': 'Select CLI tool…',
  'temp.modal.name': 'Template Name',
  'temp.modal.namePlaceholder': 'e.g. Git Status',
  'temp.modal.args': 'Arguments (one per line)',
  'temp.modal.argsPlaceholder': 'e.g. status',
  'temp.modal.pwd': 'Working Directory (optional)',
  'temp.modal.pwdPlaceholder': 'e.g. C:\\my-project',
  'temp.modal.vars': 'Variables',
  'temp.modal.btn.addVar': 'Add Variable',
  'temp.modal.noVars': 'No custom template environment variables.',
  'temp.modal.btn.save': 'Save',
  'temp.modal.btn.creating': 'Creating…',
  'temp.modal.btn.saving': 'Saving…',
  'temp.toast.fieldsRequired': 'All fields are required',
  'temp.toast.created': 'Template created',
  'temp.toast.createFailed': 'Failed to create template',
  'temp.toast.updated': 'Template updated',
  'temp.toast.updateFailed': 'Failed to update template',

  // InstancesPage
  'inst.title': 'Running Instances',
  'inst.desc': 'Monitor and control live CLI executions, view real-time streaming output, and terminate active process trees.',
  'inst.empty.title': 'No active instances',
  'inst.empty.desc': 'Launch a template to see it executing here in real-time.',
  'inst.table.status': 'STATUS',
  'inst.table.pid': 'PID',
  'inst.table.template': 'TEMPLATE',
  'inst.table.tool': 'TOOL',
  'inst.table.started': 'STARTED',
  'inst.table.actions': 'ACTIONS',
  'inst.status.running': 'running',
  'inst.status.stopped': 'stopped',
  'inst.status.failed': 'failed',
  'inst.exitCode': 'Exit Code {code}',
  'inst.btn.terminate': 'Terminate',
  'inst.terminal.title': 'Terminal Output',
  'inst.terminal.clear': 'Clear Logs',
  'inst.terminal.noLogs': 'No logs generated yet.',
  'inst.confirm.terminate': 'Confirm terminating this instance and all its child processes?',
  'inst.toast.terminated': 'Instance terminated',
  'inst.toast.terminateFailed': 'Termination failed',
};

const dictionaries: Record<Language, Dictionary> = {
  zh: zhDict,
  en: enDict,
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: string, variables?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('zh');

  // Load language preference from Tauri backend on mount
  useEffect(() => {
    import('@tauri-apps/api/core')
      .then(({ invoke }) => {
        invoke<string>('get_language')
          .then((lang) => {
            if (lang === 'zh' || lang === 'en') {
              setLanguageState(lang);
            }
          })
          .catch(() => {
            // Fallback to default 'zh'
          });
      })
      .catch(() => {
        // Fallback for non-Tauri contexts
      });
  }, []);

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    try {
      const { invoke } = await import('@tauri-apps/api/core');
      await invoke('set_language', { lang });
    } catch (e) {
      console.error('Failed to save language preference', e);
    }
  };

  const t = (key: string, variables?: Record<string, string | number>): string => {
    const dict = dictionaries[language] || zhDict;
    let value = dict[key] || zhDict[key] || key;

    if (variables) {
      Object.entries(variables).forEach(([k, v]) => {
        value = value.replace(new RegExp(`{${k}}`, 'g'), String(v));
      });
    }

    return value;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
