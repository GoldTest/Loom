import React, { useState, useEffect } from 'react';
import { getCliTools, updateCliEnv } from '../api';
import type { CliTool } from '../types';
import { useToast } from '../ToastContext';
import { useI18n } from '../I18nContext';

interface Props {
  tools: CliTool[];
}

export default function EnvVarsPage({ tools: initialTools }: Props) {
  const { t } = useI18n();
  const [tools, setTools] = useState<CliTool[]>(initialTools);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [pairs, setPairs] = useState<{ k: string; v: string }[]>([]);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => { setTools(initialTools); }, [initialTools]);

  const selected = tools.find(t => t.id === selectedId);

  useEffect(() => {
    if (selected) {
      setPairs(Object.entries(selected.custom_env).map(([k, v]) => ({ k, v })));
    } else {
      setPairs([]);
    }
  }, [selectedId, tools]);

  const addPair = () => setPairs(p => [...p, { k: '', v: '' }]);
  const removePair = (i: number) => setPairs(p => p.filter((_, idx) => idx !== i));
  const updatePair = (i: number, field: 'k' | 'v', val: string) =>
    setPairs(p => p.map((e, idx) => idx === i ? { ...e, [field]: val } : e));

  const handleSave = async () => {
    if (!selectedId) return;
    setSaving(true);
    try {
      const env: Record<string, string> = {};
      for (const { k, v } of pairs) {
        if (k.trim()) env[k.trim()] = v;
      }
      await updateCliEnv(selectedId, env);
      const fresh = await getCliTools();
      setTools(fresh);
      toast.success(t('env.toast.saved'));
    } catch (e: any) {
      toast.error(e?.toString() ?? t('env.toast.saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  const filtered = tools.filter(t =>
    !search || t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="page-header">
        <div>
          <div className="page-title">{t('env.title')}</div>
          <div className="page-subtitle">{t('env.desc')}</div>
        </div>
      </div>

      <div className="split-layout" style={{ flex: 1, overflow: 'hidden' }}>
        {/* Tool selector */}
        <div className="split-left">
          <div className="search-input-wrap" style={{ maxWidth: '100%' }}>
            <span className="search-icon" style={{ fontSize: 12 }}>🔍</span>
            <input
              className="input"
              placeholder={t('env.search.placeholder')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ fontSize: 12 }}
            />
          </div>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {filtered.map(tool => {
              const envCount = Object.keys(tool.custom_env).length;
              return (
                <div
                  key={tool.id}
                  className={`tool-row${selectedId === tool.id ? ' selected' : ''}`}
                  onClick={() => setSelectedId(tool.id)}
                  style={{ gridTemplateColumns: '1fr auto', padding: '10px 12px' }}
                >
                  <div className="tool-info">
                    <div className="tool-name" style={{ fontSize: 12 }}>{tool.name}</div>
                  </div>
                  {envCount > 0 && (
                    <span className="badge badge-emerald" style={{ fontSize: 10 }}>{envCount}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Env editor */}
        <div className="split-right">
          {!selected ? (
            <div className="empty-state" style={{ height: '100%' }}>
              <div className="empty-state-icon">⚙️</div>
              <div className="empty-state-title">{t('env.toast.selectTool')}</div>
              <div className="empty-state-desc">{t('env.desc')}</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 16 }}>
              <div className="flex items-center justify-between">
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{t('env.editor.title', { name: selected.name })}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontFamily: 'monospace', marginTop: 2 }}>{selected.path}</div>
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-ghost" onClick={addPair} style={{ fontSize: 12 }}>＋ {t('env.btn.newVar')}</button>
                  <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ fontSize: 12 }}>
                    {saving ? t('env.btn.saving') : `✓ ${t('env.btn.save')}`}
                  </button>
                </div>
              </div>

              <div className="divider" />

              {pairs.length === 0 ? (
                <div className="empty-state" style={{ flex: 1 }}>
                  <div className="empty-state-icon" style={{ fontSize: 28 }}>📭</div>
                  <div className="empty-state-title">{t('env.empty.noVars')}</div>
                  <div className="empty-state-desc">{t('env.editor.subtitle')}</div>
                  <button className="btn btn-ghost" onClick={addPair} style={{ fontSize: 12 }}>＋ {t('env.btn.newVar')}</button>
                </div>
              ) : (
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {pairs.map((pair, i) => (
                    <div key={i} className="kv-row" style={{ display: 'grid', gridTemplateColumns: '1fr 16px 2fr auto', gap: 8, alignItems: 'center' }}>
                      <input
                        className="input"
                        value={pair.k}
                        placeholder={t('env.table.key')}
                        onChange={e => updatePair(i, 'k', e.target.value)}
                        style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--accent-purple)', padding: '7px 10px' }}
                      />
                      <span className="kv-eq">=</span>
                      <input
                        className="input"
                        value={pair.v}
                        placeholder={t('env.table.value')}
                        onChange={e => updatePair(i, 'v', e.target.value)}
                        style={{ fontFamily: 'monospace', fontSize: 12, padding: '7px 10px' }}
                      />
                      <button className="kv-remove" onClick={() => removePair(i)}>✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
