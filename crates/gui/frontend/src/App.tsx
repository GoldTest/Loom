import React, { useState, useEffect, useCallback } from 'react';
import './index.css';
import { ToastProvider } from './ToastContext';
import { I18nProvider, useI18n } from './I18nContext';
import Dashboard from './pages/Dashboard';
import CategoriesPage from './pages/CategoriesPage';
import TemplatesPage from './pages/TemplatesPage';
import InstancesPage from './pages/InstancesPage';
import EnvVarsPage from './pages/EnvVarsPage';
import { getCliTools } from './api';
import type { CliTool, Category, Template, RunningInstance } from './types';

// ─── Simple icons (Unicode + SVG inline) ─────────────────────
const Icons = {
  terminal: '⌨',
  grid: '⊞',
  tag: '◈',
  play: '▶',
  instance: '◉',
  env: '⚙',
};

type Page = 'dashboard' | 'categories' | 'templates' | 'instances' | 'env';

interface NavItemProps {
  icon: string;
  label: string;
  page: Page;
  current: Page;
  badge?: number;
  onClick: () => void;
}

function NavItem({ icon, label, current, page, badge, onClick }: NavItemProps) {
  return (
    <button
      className={`nav-item${current === page ? ' active' : ''}`}
      onClick={onClick}
      style={{ width: '100%', textAlign: 'left', background: 'none', border: '1px solid transparent', cursor: 'pointer' }}
    >
      <span className="nav-icon" style={{ fontSize: 14 }}>{icon}</span>
      <span>{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="nav-badge">{badge}</span>
      )}
    </button>
  );
}

function App() {
  const { language, setLanguage, t } = useI18n();
  const [page, setPage] = useState<Page>('dashboard');
  const [tools, setTools] = useState<CliTool[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedTool, setSelectedTool] = useState<CliTool | undefined>();
  const [instances, setInstances] = useState<RunningInstance[]>([]);

  const loadTools = useCallback(async () => {
    try {
      const data = await getCliTools();
      setTools(data);
      // Extract categories from tools data — categories are stored separately
      // but we'll drive them from the API
    } catch { /* handled in child */ }
  }, []);

  // Load categories separately via a core-level query
  // We piggyback on tool data since categories are in the same config
  const refreshAll = useCallback(async () => {
    try {
      const data = await getCliTools();
      setTools(data);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    // We need categories too — since the backend doesn't expose a standalone
    // get_categories command, we use the storage directly via the tool data.
    // Let's add a get_categories Tauri command wrapper via dynamic invoke
    import('@tauri-apps/api/core').then(({ invoke }) => {
      invoke<{ id: string; name: string; description: string }[]>('get_categories')
        .then(cats => setCategories(cats))
        .catch(() => {
          // Fallback: derive from tools (categories were added by create_category)
          // This path used only if get_categories not registered
        });
    });
    loadTools();
  }, [loadTools]);

  const handleCategoriesChange = useCallback(async () => {
    await refreshAll();
    import('@tauri-apps/api/core').then(({ invoke }) => {
      invoke<Category[]>('get_categories').then(cats => setCategories(cats)).catch(() => {});
    });
  }, [refreshAll]);

  const handleInstanceLaunched = useCallback(
    (instanceId: string, template: Template, tool: CliTool) => {
      const inst: RunningInstance = {
        instance_id: instanceId,
        template,
        tool,
        status: 'running',
        logs: [],
        started_at: new Date(),
      };
      setInstances(prev => [...prev, inst]);
      setPage('instances');
    },
    []
  );

  const runningCount = instances.filter(i => i.status === 'running').length;

  return (
    <div className="app-shell">
      {/* ── Sidebar ─────────────────────────────────────── */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">⌘</div>
          <div style={{ flexGrow: 1 }}>
            <div className="sidebar-logo-text">CliMaster</div>
            <div className="sidebar-logo-badge">{t('nav.logoSubtitle')}</div>
          </div>
          <select
            id="lang-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value as 'zh' | 'en')}
            style={{
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '11px',
              padding: '2px 4px',
              cursor: 'pointer',
              marginLeft: '4px'
            }}
          >
            <option value="zh">中文</option>
            <option value="en">EN</option>
          </select>
        </div>

        <div className="nav-section-label">{t('nav.manage')}</div>
        <NavItem icon={Icons.terminal} label={t('nav.cliTools')} page="dashboard" current={page} badge={tools.length || undefined} onClick={() => setPage('dashboard')} />
        <NavItem icon={Icons.tag} label={t('nav.categories')} page="categories" current={page} badge={categories.length || undefined} onClick={() => setPage('categories')} />
        <NavItem icon={Icons.env} label={t('nav.envVars')} page="env" current={page} onClick={() => setPage('env')} />

        <div className="nav-section-label" style={{ marginTop: 8 }}>{t('nav.run')}</div>
        <NavItem icon={Icons.play} label={t('nav.templates')} page="templates" current={page} onClick={() => setPage('templates')} />
        <NavItem icon={Icons.instance} label={t('nav.instances')} page="instances" current={page} badge={runningCount || undefined} onClick={() => setPage('instances')} />

        {/* Bottom status */}
        <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ padding: '8px 12px', fontSize: 11, color: 'var(--text-tertiary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span>{t('nav.stats.tools')}</span><span style={{ color: 'var(--text-secondary)' }}>{tools.length}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span>{t('nav.stats.running')}</span>
              <span style={{ color: runningCount > 0 ? 'var(--accent-emerald)' : 'var(--text-secondary)' }}>
                {runningCount}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{t('nav.stats.categories')}</span><span style={{ color: 'var(--text-secondary)' }}>{categories.length}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────── */}
      <main className="main-content">
        {page === 'dashboard' && (
          <Dashboard
            categories={categories}
            onToolsChange={refreshAll}
            onSelectTool={setSelectedTool}
            selectedToolId={selectedTool?.id}
          />
        )}
        {page === 'categories' && (
          <CategoriesPage
            categories={categories}
            tools={tools}
            onCategoriesChange={handleCategoriesChange}
          />
        )}
        {page === 'env' && (
          <EnvVarsPage tools={tools} />
        )}
        {page === 'templates' && (
          <TemplatesPage
            tools={tools}
            onInstanceLaunched={handleInstanceLaunched}
          />
        )}
        {page === 'instances' && (
          <InstancesPage
            instances={instances}
            onInstancesChange={setInstances}
          />
        )}
      </main>
    </div>
  );
}

export default function Root() {
  return (
    <I18nProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </I18nProvider>
  );
}
