import { useMemo, useState } from 'react'
import { marked } from 'marked'
import { friendlyError, generateReport } from '../lib/anthropic'
import { downloadText } from '../lib/excel'
import { computeStats } from '../lib/store'
import type { CallRow, ReportData, Settings, Template } from '../lib/types'

interface Props {
  rows: CallRow[]
  settings: Settings
  template: Template
  report: ReportData | null
  setReport: (r: ReportData | null) => void
  goToCalls: () => void
}

export function ReportView({ rows, settings, template, report, setReport, goToCalls }: Props) {
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')

  const stats = useMemo(() => computeStats(rows, template), [rows, template])
  const done = rows.filter((r) => r.status === 'done' && r.result)

  async function makeReport() {
    setError('')
    setGenerating(true)
    try {
      const markdown = await generateReport(settings, template, rows, stats)
      setReport({
        markdown,
        generatedAt: new Date().toISOString(),
        templateId: template.id,
        callCount: done.length,
      })
    } catch (err) {
      setError(friendlyError(err))
    } finally {
      setGenerating(false)
    }
  }

  if (!done.length) {
    return (
      <div className="empty card">
        <div className="big">📊</div>
        <p>Analyse some calls first — then the report is built from every result.</p>
        <button className="primary" onClick={goToCalls}>
          Go to calls
        </button>
      </div>
    )
  }

  const outcomeDist = Object.entries(stats.outcome_distribution as Record<string, number>)
  const sentimentDist = Object.entries(stats.sentiment_distribution as Record<string, number>)
  const flags = Object.entries(stats.flags as Record<string, number>).filter(([, n]) => n > 0)

  return (
    <>
      <h1>Report</h1>
      <p className="subtitle">
        Built from {done.length} analysed calls using <strong>{template.name}</strong>.
      </p>

      <div className="viz-root">
        <div className="stat-tiles">
          <StatTile label="Calls analysed" value={String(done.length)} />
          {stats.ptp_count !== undefined && (
            <>
              <StatTile label="Promises to pay" value={String(stats.ptp_count)} />
              <StatTile
                label="PTP value (ZAR)"
                value={`R ${Number(stats.ptp_total_zar ?? 0).toLocaleString('en-ZA')}`}
              />
            </>
          )}
          {flags.slice(0, 2).map(([f, n]) => (
            <StatTile key={f} label={f.replace(/_/g, ' ')} value={String(n)} />
          ))}
          {stats.errors > 0 && <StatTile label="Failed analyses" value={String(stats.errors)} />}
        </div>

        <div className="charts-grid" style={{ marginBottom: 16 }}>
          <div className="card">
            <h2>Outcomes</h2>
            <BarChart data={outcomeDist} color="var(--series-1)" total={done.length} />
          </div>
          {sentimentDist.length > 0 && (
            <div className="card">
              <h2>Sentiment</h2>
              <BarChart data={sentimentDist} color="var(--series-2)" total={done.length} />
            </div>
          )}
        </div>
      </div>

      <div className="card no-print">
        <div className="row">
          <button className="primary" onClick={() => void makeReport()} disabled={generating}>
            {generating ? 'Writing report…' : report ? 'Regenerate report' : 'Make report'}
          </button>
          {report && (
            <>
              <button
                className="ghost"
                onClick={() => downloadText('call-analysis-report.md', report.markdown, 'text/markdown')}
              >
                Download .md
              </button>
              <button className="ghost" onClick={() => window.print()}>
                Print / PDF
              </button>
              <span className="muted">
                Generated {new Date(report.generatedAt).toLocaleString()} from {report.callCount} calls
              </span>
            </>
          )}
        </div>
        {error && <p className="error-text" style={{ marginBottom: 0 }}>{error}</p>}
        {!settings.apiKey && (
          <p className="error-text" style={{ marginBottom: 0 }}>
            Add your Anthropic API key in Settings first.
          </p>
        )}
      </div>

      {report && (
        <div className="card">
          <div
            className="report-md"
            dangerouslySetInnerHTML={{ __html: marked.parse(report.markdown, { async: false }) as string }}
          />
        </div>
      )}
    </>
  )
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat-tile">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
    </div>
  )
}

function BarChart({
  data,
  color,
  total,
}: {
  data: [string, number][]
  color: string
  total: number
}) {
  const max = Math.max(1, ...data.map(([, n]) => n))
  return (
    <div className="barchart">
      {data.map(([label, n]) => (
        <div
          className="bar-row"
          key={label}
          title={`${label}: ${n} calls (${Math.round((n / Math.max(1, total)) * 100)}%)`}
        >
          <span className="bar-label">{label}</span>
          <div className="bar-track">
            <div className="bar-fill" style={{ width: `${(n / max) * 100}%`, background: color }} />
          </div>
          <span className="bar-value">{n}</span>
        </div>
      ))}
    </div>
  )
}
