import { useMemo, useRef, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import { analyseTranscript, friendlyError, runPool } from '../lib/anthropic'
import { buildCsv, buildResultsCsv, downloadText } from '../lib/excel'
import type { CallRow, Settings, Template } from '../lib/types'
import { CallDetail } from './CallDetail'

interface Props {
  rows: CallRow[]
  setRows: Dispatch<SetStateAction<CallRow[]>>
  settings: Settings
  templates: Template[]
  activeTemplate: Template
  setActiveTemplateId: (id: string) => void
  goToSettings: () => void
  goToUpload: () => void
}

const GOOD_VALUES = ['yes', 'cooperative', 'positive', 'validated', 'strong', 'low', 'complete', 'informed', 'confirmed_eligible']
const BAD_VALUES = ['hostile', 'negative', 'refused', 'dispute', 'high', 'non_compliant', 'pressured', 'no', 'not_eligible']

export function badgeClass(field: string, value: unknown): string {
  const v = String(value ?? '').toLowerCase()
  if (!v || v === 'null') return 'neutral'
  const negativeWhenYes = [
    'human_review_required',
    'escalation_flag',
    'dispute_raised',
    'wrong_person',
    'do_not_call',
    'nca_compliance_breach',
    'hallucinated_figures',
    'bundled_questions_detected',
    'maintenance_issue_flagged',
  ]
  if (negativeWhenYes.includes(field)) return v === 'yes' ? 'bad' : 'neutral'
  if (field === 'ptp_confirmed' || field === 'state_sequence_followed') return v === 'yes' ? 'good' : 'neutral'
  if (GOOD_VALUES.includes(v)) return 'good'
  if (BAD_VALUES.includes(v)) return 'bad'
  if (v === 'medium' || v === 'maybe' || v === 'partial' || v === 'weak' || v === 'evasive' || v === 'distressed')
    return 'warn'
  return 'info'
}

export function CallsView({
  rows,
  setRows,
  settings,
  templates,
  activeTemplate,
  setActiveTemplateId,
  goToSettings,
  goToUpload,
}: Props) {
  const [running, setRunning] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)
  const cancelRef = useRef(false)

  const analysable = rows.filter((r) => r.transcript && r.status !== 'analyzing')
  const doneCount = rows.filter((r) => r.status === 'done').length
  const errorCount = rows.filter((r) => r.status === 'error').length
  const progress = rows.length ? Math.round(((doneCount + errorCount) / rows.length) * 100) : 0

  function patchRow(id: string, patch: Partial<CallRow>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  }

  async function analyseOne(row: CallRow) {
    if (!row.transcript) return
    patchRow(row.id, { status: 'analyzing', error: undefined })
    try {
      const result = await analyseTranscript(settings, activeTemplate, row.transcript)
      patchRow(row.id, { status: 'done', result, resultTemplateId: activeTemplate.id })
    } catch (err) {
      patchRow(row.id, { status: 'error', error: friendlyError(err) })
    }
  }

  async function analyseAll(onlyPending: boolean) {
    if (!settings.apiKey) {
      goToSettings()
      return
    }
    const targets = rows.filter(
      (r) => r.transcript && (!onlyPending || r.status === 'pending' || r.status === 'error'),
    )
    if (!targets.length) return
    cancelRef.current = false
    setRunning(true)
    try {
      await runPool(targets, settings.concurrency, (row) => analyseOne(row), () => cancelRef.current)
    } finally {
      setRunning(false)
    }
  }

  const pendingCount = rows.filter((r) => r.transcript && (r.status === 'pending' || r.status === 'error')).length
  const openRow = useMemo(() => rows.find((r) => r.id === openId) ?? null, [rows, openId])

  if (!rows.length) {
    return (
      <div className="empty card">
        <div className="big">📞</div>
        <p>No calls loaded yet.</p>
        <button className="primary" onClick={goToUpload}>
          Upload a sheet
        </button>
      </div>
    )
  }

  return (
    <>
      <h1>Calls</h1>
      <p className="subtitle">
        {rows.length} calls · {doneCount} analysed
        {errorCount > 0 && <span className="error-text"> · {errorCount} failed</span>}
      </p>

      <div className="card no-print">
        <div className="row" style={{ marginBottom: running || doneCount > 0 ? 14 : 0 }}>
          <label className="field" style={{ minWidth: 280 }}>
            Analysis template
            <select value={activeTemplate.id} onChange={(e) => setActiveTemplateId(e.target.value)}>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>
          <div style={{ flex: 1 }} />
          {running ? (
            <button className="danger" onClick={() => (cancelRef.current = true)}>
              Stop
            </button>
          ) : (
            <>
              <button className="primary" onClick={() => void analyseAll(true)} disabled={!pendingCount}>
                Analyse {pendingCount || ''} pending
              </button>
              <button className="ghost" onClick={() => void analyseAll(false)} disabled={!analysable.length}>
                Re-analyse all
              </button>
            </>
          )}
          <button className="ghost" onClick={() => downloadText('calls.csv', buildCsv(rows))}>
            CSV (name,url,date)
          </button>
          <button
            className="ghost"
            onClick={() => downloadText('call-analysis-results.csv', buildResultsCsv(rows))}
            disabled={!doneCount}
          >
            Results CSV
          </button>
        </div>
        {(running || doneCount + errorCount > 0) && (
          <div className="row">
            <div className="progress">
              <div style={{ width: `${progress}%` }} />
            </div>
            <span className="muted">
              {doneCount + errorCount}/{rows.length}
            </span>
          </div>
        )}
        {!settings.apiKey && (
          <p className="error-text" style={{ marginBottom: 0 }}>
            Add your Anthropic API key in Settings before analysing.
          </p>
        )}
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Date</th>
                <th>Status</th>
                {activeTemplate.keyFields.slice(0, 4).map((f) => (
                  <th key={f}>{f.replace(/_/g, ' ')}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="clickable" onClick={() => setOpenId(r.id)}>
                  <td>{r.name || <span className="muted">—</span>}</td>
                  <td>{r.date || <span className="muted">—</span>}</td>
                  <td>
                    <StatusBadge row={r} />
                  </td>
                  {activeTemplate.keyFields.slice(0, 4).map((f) => {
                    const v = r.result?.[f]
                    return (
                      <td key={f}>
                        {r.status === 'done' && v !== null && v !== undefined && v !== '' ? (
                          <span className={`badge ${badgeClass(f, v)}`}>{String(v)}</span>
                        ) : (
                          <span className="muted">—</span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {openRow && (
        <CallDetail
          row={openRow}
          template={templates.find((t) => t.id === openRow.resultTemplateId) ?? activeTemplate}
          onClose={() => setOpenId(null)}
          onSaveTranscript={(t) =>
            patchRow(openRow.id, { transcript: t || undefined, status: t ? 'pending' : 'no-transcript' })
          }
          onAnalyse={() => void analyseOne(openRow)}
          analysing={openRow.status === 'analyzing'}
        />
      )}
    </>
  )
}

function StatusBadge({ row }: { row: CallRow }) {
  switch (row.status) {
    case 'done':
      return <span className="badge good">✓ analysed</span>
    case 'analyzing':
      return <span className="badge info">analysing…</span>
    case 'error':
      return (
        <span className="badge bad" title={row.error}>
          failed
        </span>
      )
    case 'no-transcript':
      return <span className="badge warn">no transcript</span>
    default:
      return <span className="badge neutral">pending</span>
  }
}
