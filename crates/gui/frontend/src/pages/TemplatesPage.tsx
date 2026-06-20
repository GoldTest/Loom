import React, { useState, useEffect } from 'react';
import { getTemplates, createTemplate, updateTemplate, deleteTemplate, runCliTemplate } from '../api';
import type { CliTool, Template } from '../types';
import { useToast } from '../ToastContext';
import { useI18n } from '../I18nContext';

interface Props {
  tools: CliTool[];
  onInstanceLaunched: (instanceId: string, template: Template, tool: CliTool) => void;
}

function TemplateModal({
  tools, template, onClose, onSave,
}: {
  tools: CliTool[];
  template?: Template;
  onClose: () => void;
  onSave: () => void;
}) {
  const { t } = useI18n();
  const [cliId, setCliId] = useState(template?.cli_id ?? (tools[0]?.id ?? ''));
  const [name, setName] = useState(template?.name ?? '');
  const [argsStr, setArgsStr] = useState(template?.args.join(' ') ?? '');
  const [pwd, setPwd] = useState(template?.pwd ?? '');
  const [envPairs, setEnvPairs] = useState<{ k: string; v: string }[]>(
    Object.entries(template?.env ?? {}).map(([k, v]) => ({ k, v }))
  );
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const addEnv = () => setEnvPairs(p => [...p, { k: '', v: '' }]);
  const removeEnv = (i: number) => setEnvPairs(p => p.filter((_, idx) => idx !== i));
  const updateEnv = (i: number, field: 'k' | 'v', val: string) =>
    setEnvPairs(p => p.map((e, idx) => idx === i ? { ...e, [field]: val } : e));

  const handleSave = async () => {
    if (!name.trim()) { toast.error(t('temp.toast.fieldsRequired')); return; }
    if (!cliId) { toast.error(t('temp.modal.selectTool')); return; }
    setSaving(true);
    try {
      const args = argsStr.trim() ? argsStr.trim().split(/\s+/) : [];
      const env: Record<string, string> = {};
      for (const { k, v } of envPairs) {
        if (k.trim()) env[k.trim()] = v;
      }
      if (template) {
        await updateTemplate(template.id, name.trim(), args, env, pwd.trim() || undefined);
      } else {
        await createTemplate(cliId, name.trim(), args, env, pwd.trim() || undefined);
      }
      onSave();
      onClose();
      toast.success(template ? t('temp.toast.updated') : t('temp.toast.created'));
    } catch (e: any) {
      toast.error(e?.toString() ?? t('temp.toast.createFailed'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">{template ? t('temp.modal.editTitle') : t('temp.modal.newTitle')}</div>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">{t('temp.modal.tool')} *</label>
            <select className="input" value={cliId} onChange={e => setCliId(e.target.value)} disabled={!!template}>
              {tools.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">{t('temp.modal.name')} *</label>
            <input className="input" placeholder={t('temp.modal.namePlaceholder')} value={name} onChange={e => setName(e.target.value)} autoFocus />
          </div>
          <div className="form-group">
            <label className="form-label">{t('temp.card.args')}</label>
            <input className="input" placeholder={t('temp.modal.argsPlaceholder')} value={argsStr} onChange={e => setArgsStr(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">{t('temp.modal.pwd')}</label>
            <input className="input" placeholder={t('temp.modal.pwdPlaceholder')} value={pwd} onChange={e => setPwd(e.target.value)} />
          </div>

          {/* Env vars */}
          <div className="form-group">
            <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
              <label className="form-label" style={{ margin: 0 }}>{t('temp.card.envs')}</label>
              <button className="btn btn-ghost" onClick={addEnv} style={{ fontSize: 11, padding: '4px 10px' }}>＋ {t('temp.modal.btn.addVar')}</button>
            </div>
            {envPairs.map((pair, i) => (
              <div key={i} className="form-row" style={{ marginBottom: 6 }}>
                <input className="input" placeholder="KEY" value={pair.k} onChange={e => updateEnv(i, 'k', e.target.value)} style={{ flex: 1, fontFamily: 'monospace', fontSize: 12 }} />
                <span style={{ color: 'var(--text-tertiary)', fontSize: 14, flexShrink: 0 }}>=</span>
                <input className="input" placeholder="value" value={pair.v} onChange={e => updateEnv(i, 'v', e.target.value)} style={{ flex: 2, fontFamily: 'monospace', fontSize: 12 }} />
                <button className="btn-icon" onClick={() => removeEnv(i)} style={{ color: 'var(--accent-red)', flexShrink: 0 }}>✕</button>
              </div>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>{t('cat.modal.btn.cancel')}</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? t('temp.modal.btn.saving') : template ? t('temp.modal.btn.save') : t('temp.modal.btn.creating')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TemplatesPage({ tools, onInstanceLaunched }: Props) {
  const { t } = useI18n();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | undefined>();
  const [launching, setLaunching] = useState<string | null>(null);
  const toast = useToast();

  const load = async () => {
    try { setTemplates(await getTemplates()); } catch { toast.error(t('temp.toast.launchFailed')); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(t('temp.confirm.delete', { name }))) return;
    try { await deleteTemplate(id); load(); toast.success(t('temp.toast.deleted')); } catch (e: any) { toast.error(e?.toString() ?? t('cat.toast.deleteFailed')); }
  };

  const handleRun = async (tpl: Template) => {
    const tool = tools.find(t => t.id === tpl.cli_id);
    if (!tool) { toast.error(t('temp.modal.selectTool')); return; }
    setLaunching(tpl.id);
    try {
      const instanceId = await runCliTemplate(tpl.id);
      onInstanceLaunched(instanceId, tpl, tool);
      toast.success(t('temp.toast.launched') + ': ' + tpl.name);
    } catch (e: any) {
      toast.error(e?.toString() ?? t('temp.toast.launchFailed'));
    } finally {
      setLaunching(null);
    }
  };

  const getToolName = (cliId: string) => tools.find(t => t.id === cliId)?.name ?? '?';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="page-header">
        <div>
          <div className="page-title">{t('temp.title')}</div>
          <div className="page-subtitle">{t('temp.desc')}</div>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditingTemplate(undefined); setShowModal(true); }} style={{ fontSize: 12 }} disabled={tools.length === 0}>
          <span>＋</span> {t('temp.btn.new')}
        </button>
      </div>

      <div className="page-body">
        {templates.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">▶️</div>
            <div className="empty-state-title">{t('temp.empty.noTemps')}</div>
            <div className="empty-state-desc">{t('temp.empty.desc')}</div>
            <button className="btn btn-primary" onClick={() => setShowModal(true)} disabled={tools.length === 0}>＋ {t('temp.empty.btn.createFirst')}</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {templates.map((tpl, i) => (
              <div key={tpl.id} className="card-outer" style={{ animationDelay: `${i * 30}ms`, animation: 'fadeSlideIn 400ms cubic-bezier(0.16,1,0.3,1) both' }}>
                <div className="card-inner" style={{ padding: '14px 18px' }}>
                  <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
                    <div className="flex items-center gap-2 min-w-0">
                      <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{tpl.name}</span>
                      <span className="badge badge-purple" style={{ fontSize: 10 }}>{getToolName(tpl.cli_id)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="btn btn-success"
                        onClick={() => handleRun(tpl)}
                        disabled={launching === tpl.id}
                        style={{ fontSize: 12, padding: '5px 12px' }}
                      >
                        {launching === tpl.id ? <span className="scan-spinner" style={{ width: 12, height: 12 }} /> : '▶'}
                        {launching === tpl.id ? t('temp.modal.btn.creating') : t('temp.card.btn.run')}
                      </button>
                      <button className="btn-icon" title={t('temp.card.btn.edit')} onClick={() => { setEditingTemplate(tpl); setShowModal(true); }}>✎</button>
                      <button className="btn-icon" title={t('temp.card.btn.delete')} onClick={() => handleDelete(tpl.id, tpl.name)} style={{ color: 'var(--accent-red)', borderColor: 'rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.07)' }}>✕</button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 20, fontSize: 12, color: 'var(--text-tertiary)' }}>
                    {tpl.args.length > 0 && (
                      <span style={{ fontFamily: 'monospace', fontSize: 11 }}>
                        <span style={{ color: 'var(--accent-emerald)', marginRight: 4 }}>{t('temp.card.args')}:</span>
                        {tpl.args.join(' ')}
                      </span>
                    )}
                    {tpl.pwd && (
                      <span style={{ fontFamily: 'monospace', fontSize: 11 }}>
                        <span style={{ color: 'var(--accent-amber)', marginRight: 4 }}>{t('temp.card.pwd')}:</span>
                        {tpl.pwd}
                      </span>
                    )}
                    {Object.keys(tpl.env).length > 0 && (
                      <span style={{ fontSize: 11 }}>
                        <span style={{ color: 'var(--accent-blue)', marginRight: 4 }}>{t('temp.card.envs')}:</span>
                        {Object.keys(tpl.env).join(', ')}
                      </span>
                    )}
                    {tpl.last_run && (
                      <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--text-tertiary)' }}>
                        {t('temp.card.lastRun')}: {new Date(parseInt(tpl.last_run) * 1000).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <TemplateModal
          tools={tools}
          template={editingTemplate}
          onClose={() => { setShowModal(false); setEditingTemplate(undefined); }}
          onSave={load}
        />
      )}
    </div>
  );
}
