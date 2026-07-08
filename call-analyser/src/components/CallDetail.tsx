import { useState } from 'react'
import type { CallRow, Template } from '../lib/types'
import { badgeClass } from './CallsView'

interface Props {
  row: CallRow
  template: Template
  onClose: () => void
  onSaveTranscript: (transcript: string) => void
  onAnalyse: () => void
  analysing: boolean
}

export function CallDetail({ row, template, onClose, onSaveTranscript, onAnalyse, analysing }: Props) {
  const [editingTranscript, setEditingTranscript] = useState(!row.transcript)
  const [draft, setDraft] = useState(row.transcript ?? '')

  const resultEntries = row.result ? Object.entries(row.result) : []
  const summary = template.summaryField ? row.result?.[template.summaryField] : null

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <aside className="drawer">
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 4 }}>
          <h1 style={{ margin: 0 }}>{row.name || 'Unnamed call'}</h1>
          <button className="ghost" onClick={onClose}>
            Close
          </button>
        </div>
        <p className="muted" style={{ marginTop: 0 }}>
          {row.date}
          {row.url && (
            <>
              {' · '}
              <a href={row.url} target="_blank" rel="noreferrer">
                open call recording ↗
              </a>
            </>
          )}
        </p>

        {row.error && <p className="error-text">{row.error}</p>}

        {typeof summary === 'string' && summary && (
          <div className="card" style={{ padding: 14, marginBottom: 16 }}>
            <h2 style={{ marginBottom: 6 }}>Summary</h2>
            <p style={{ margin: 0 }}>{summary}</p>
          </div>
        )}

        {resultEntries.length > 0 && (
          <>
            <h2>Analysis — {template.name}</h2>
            <dl className="kv" style={{ marginBottom: 20 }}>
              {resultEntries
                .filter(([k]) => k !== template.summaryField)
                .map(([k, v]) => (
                  <FieldRow key={k} field={k} value={v} />
                ))}
            </dl>
          </>
        )}

        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
          <h2 style={{ margin: 0 }}>Transcript</h2>
          <div className="row">
            {!editingTranscript && (
              <button className="ghost" onClick={() => setEditingTranscript(true)}>
                Edit
              </button>
            )}
            <button className="primary" onClick={onAnalyse} disabled={!row.transcript || analysing}>
              {analysing ? 'Analysing…' : row.result ? 'Re-analyse' : 'Analyse'}
            </button>
          </div>
        </div>

        {editingTranscript ? (
          <>
            <textarea
              rows={12}
              value={draft}
              placeholder="Paste the call transcript here…"
              onChange={(e) => setDraft(e.target.value)}
            />
            <div className="row" style={{ marginTop: 8 }}>
              <button
                className="primary"
                onClick={() => {
                  onSaveTranscript(draft.trim())
                  setEditingTranscript(false)
                }}
              >
                Save transcript
              </button>
              <button
                className="ghost"
                onClick={() => {
                  setDraft(row.transcript ?? '')
                  setEditingTranscript(false)
                }}
              >
                Cancel
              </button>
            </div>
          </>
        ) : row.transcript ? (
          <pre className="transcript">{row.transcript}</pre>
        ) : (
          <p className="muted">No transcript for this call yet.</p>
        )}

        {row.extra && Object.keys(row.extra).length > 0 && (
          <>
            <h2 style={{ marginTop: 20 }}>Other columns from the sheet</h2>
            <dl className="kv">
              {Object.entries(row.extra).map(([k, v]) => (
                <div key={k} style={{ display: 'contents' }}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </>
        )}
      </aside>
    </>
  )
}

function FieldRow({ field, value }: { field: string; value: unknown }) {
  const isEmpty = value === null || value === undefined || value === ''
  const text = isEmpty
    ? '—'
    : Array.isArray(value)
      ? value.length
        ? value.join(', ')
        : '—'
      : String(value)
  const short = !isEmpty && text.length <= 40 && !Array.isArray(value)
  return (
    <div style={{ display: 'contents' }}>
      <dt>{field.replace(/_/g, ' ')}</dt>
      <dd>
        {isEmpty ? (
          <span className="muted">—</span>
        ) : short ? (
          <span className={`badge ${badgeClass(field, value)}`}>{text}</span>
        ) : (
          text
        )}
      </dd>
    </div>
  )
}
