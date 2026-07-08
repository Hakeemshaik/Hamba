import { useState } from 'react'
import type { Template } from '../lib/types'

interface Props {
  templates: Template[]
  customTemplates: Template[]
  setCustomTemplates: (t: Template[]) => void
  activeTemplateId: string
  setActiveTemplateId: (id: string) => void
}

const EMPTY_DRAFT = {
  name: '',
  description: '',
  prompt: '',
  keyFields: '',
  outcomeField: '',
  sentimentField: '',
  summaryField: '',
}

export function TemplatesView({
  templates,
  customTemplates,
  setCustomTemplates,
  activeTemplateId,
  setActiveTemplateId,
}: Props) {
  const [viewing, setViewing] = useState<Template | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState(EMPTY_DRAFT)
  const [showForm, setShowForm] = useState(false)

  function startNew() {
    setDraft(EMPTY_DRAFT)
    setEditingId(null)
    setShowForm(true)
  }

  function startEdit(t: Template) {
    setDraft({
      name: t.name,
      description: t.description,
      prompt: t.prompt,
      keyFields: t.keyFields.join(', '),
      outcomeField: t.outcomeField,
      sentimentField: t.sentimentField ?? '',
      summaryField: t.summaryField ?? '',
    })
    setEditingId(t.id)
    setShowForm(true)
  }

  function saveDraft() {
    if (!draft.name.trim() || !draft.prompt.trim()) return
    const keyFields = draft.keyFields
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    const tpl: Template = {
      id: editingId ?? `custom-${Date.now().toString(36)}`,
      name: draft.name.trim(),
      description: draft.description.trim(),
      prompt: draft.prompt,
      builtIn: false,
      keyFields,
      outcomeField: draft.outcomeField.trim() || keyFields[0] || 'outcome',
      sentimentField: draft.sentimentField.trim() || undefined,
      summaryField: draft.summaryField.trim() || undefined,
    }
    setCustomTemplates(
      editingId
        ? customTemplates.map((t) => (t.id === editingId ? tpl : t))
        : [...customTemplates, tpl],
    )
    setShowForm(false)
  }

  return (
    <>
      <h1>Analysis templates</h1>
      <p className="subtitle">
        The selected template is used when analysing calls and building reports. Prompts must instruct the
        model to return a single JSON object. Use <code>{'{{TRANSCRIPT}}'}</code> in the prompt to control
        where the transcript is inserted — otherwise it is appended automatically.
      </p>

      <div className="card">
        <div className="template-list">
          {templates.map((t) => (
            <label
              key={t.id}
              className={`template-item${t.id === activeTemplateId ? ' selected' : ''}`}
            >
              <input
                type="radio"
                name="template"
                checked={t.id === activeTemplateId}
                onChange={() => setActiveTemplateId(t.id)}
              />
              <div style={{ flex: 1 }}>
                <div className="row" style={{ gap: 8 }}>
                  <strong>{t.name}</strong>
                  <span className={`badge ${t.builtIn ? 'neutral' : 'info'}`}>
                    {t.builtIn ? 'built-in' : 'custom'}
                  </span>
                </div>
                <div className="muted">{t.description}</div>
                <div className="row" style={{ marginTop: 8 }}>
                  <button
                    className="ghost"
                    onClick={(e) => {
                      e.preventDefault()
                      setViewing(t)
                    }}
                  >
                    View prompt
                  </button>
                  {!t.builtIn && (
                    <>
                      <button
                        className="ghost"
                        onClick={(e) => {
                          e.preventDefault()
                          startEdit(t)
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="danger"
                        onClick={(e) => {
                          e.preventDefault()
                          setCustomTemplates(customTemplates.filter((c) => c.id !== t.id))
                        }}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </label>
          ))}
        </div>
        <div style={{ marginTop: 16 }}>
          <button className="primary" onClick={startNew}>
            + New template
          </button>
        </div>
      </div>

      {showForm && (
        <div className="card">
          <h2>{editingId ? 'Edit template' : 'New template'}</h2>
          <div className="mapping-grid">
            <label className="field">
              Name
              <input type="text" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
            </label>
            <label className="field">
              Description
              <input
                type="text"
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              />
            </label>
            <label className="field">
              Key fields (comma-separated, shown in the calls table)
              <input
                type="text"
                placeholder="outcome_category, sentiment"
                value={draft.keyFields}
                onChange={(e) => setDraft({ ...draft, keyFields: e.target.value })}
              />
            </label>
            <label className="field">
              Outcome field (for charts)
              <input
                type="text"
                placeholder="outcome_category"
                value={draft.outcomeField}
                onChange={(e) => setDraft({ ...draft, outcomeField: e.target.value })}
              />
            </label>
            <label className="field">
              Sentiment field (optional)
              <input
                type="text"
                value={draft.sentimentField}
                onChange={(e) => setDraft({ ...draft, sentimentField: e.target.value })}
              />
            </label>
            <label className="field">
              Summary field (optional)
              <input
                type="text"
                placeholder="call_summary"
                value={draft.summaryField}
                onChange={(e) => setDraft({ ...draft, summaryField: e.target.value })}
              />
            </label>
          </div>
          <label className="field">
            Prompt
            <textarea
              rows={14}
              placeholder="You are a call analysis assistant… Return JSON only."
              value={draft.prompt}
              onChange={(e) => setDraft({ ...draft, prompt: e.target.value })}
            />
          </label>
          <div className="row" style={{ marginTop: 12 }}>
            <button className="primary" onClick={saveDraft} disabled={!draft.name.trim() || !draft.prompt.trim()}>
              Save template
            </button>
            <button className="ghost" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {viewing && (
        <>
          <div className="drawer-overlay" onClick={() => setViewing(null)} />
          <aside className="drawer">
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <h1 style={{ margin: 0 }}>{viewing.name}</h1>
              <button className="ghost" onClick={() => setViewing(null)}>
                Close
              </button>
            </div>
            <p className="muted">{viewing.description}</p>
            <pre className="transcript" style={{ maxHeight: 'none' }}>
              {viewing.prompt}
            </pre>
          </aside>
        </>
      )}
    </>
  )
}
