import { useRef, useState } from 'react'
import { buildCsv, detectColumns, downloadText, parseFile, toCallRows } from '../lib/excel'
import type { CallRow, ColumnMapping, ParsedSheet } from '../lib/types'

interface Props {
  rows: CallRow[]
  setRows: (rows: CallRow[]) => void
  onDone: () => void
}

export function UploadView({ rows, setRows, onDone }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [sheet, setSheet] = useState<ParsedSheet | null>(null)
  const [mapping, setMapping] = useState<ColumnMapping>({ name: null, url: null, date: null, transcript: null })
  const [drag, setDrag] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(f: File, sheetName?: string) {
    setError('')
    try {
      const parsed = await parseFile(f, sheetName)
      setFile(f)
      setSheet(parsed)
      setMapping(detectColumns(parsed.headers, parsed.rows))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not read that file')
    }
  }

  const preview = sheet ? toCallRows(sheet, mapping).slice(0, 8) : []
  const totalRows = sheet ? sheet.rows.filter((r) => Object.values(r).some((v) => v !== '')).length : 0
  const withTranscript = sheet
    ? toCallRows(sheet, mapping).filter((r) => r.transcript).length
    : 0

  function importRows() {
    if (!sheet) return
    setRows(toCallRows(sheet, mapping))
    onDone()
  }

  function columnSelect(key: keyof ColumnMapping, label: string, required: boolean) {
    return (
      <label className="field">
        {label}
        {required ? '' : ' (optional)'}
        <select
          value={mapping[key] ?? ''}
          onChange={(e) => setMapping({ ...mapping, [key]: e.target.value || null })}
        >
          <option value="">— not in this sheet —</option>
          {sheet?.headers.map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>
      </label>
    )
  }

  return (
    <>
      <h1>Upload a call sheet</h1>
      <p className="subtitle">
        Drop in any Excel or CSV export. It gets converted to a clean <code>name, url, date</code> CSV,
        and the calls are queued for analysis.
      </p>

      <div className="card">
        <div
          className={`dropzone${drag ? ' drag' : ''}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setDrag(true)
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDrag(false)
            const f = e.dataTransfer.files?.[0]
            if (f) void handleFile(f)
          }}
        >
          <div className="big">📄</div>
          <strong>{file ? file.name : 'Drop an Excel or CSV file here'}</strong>
          <div className="muted">.xlsx · .xls · .csv — or click to browse</div>
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) void handleFile(f)
              e.target.value = ''
            }}
          />
        </div>
        {error && <p className="error-text">{error}</p>}
      </div>

      {sheet && (
        <div className="card">
          <h2>Map your columns</h2>
          {sheet.sheetNames.length > 1 && (
            <label className="field" style={{ maxWidth: 260, marginBottom: 12 }}>
              Sheet
              <select
                value={sheet.activeSheet}
                onChange={(e) => file && void handleFile(file, e.target.value)}
              >
                {sheet.sheetNames.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
          )}
          <div className="mapping-grid">
            {columnSelect('name', 'Name', true)}
            {columnSelect('url', 'Call URL', true)}
            {columnSelect('date', 'Date', true)}
            {columnSelect('transcript', 'Transcript', false)}
          </div>
          <p className="muted" style={{ margin: '0 0 12px' }}>
            {totalRows} rows found · {withTranscript} with a transcript
            {withTranscript < totalRows &&
              ' — calls without a transcript can have one pasted in later on the Calls tab'}
          </p>

          {preview.length > 0 && (
            <div className="table-wrap" style={{ marginBottom: 16 }}>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>URL</th>
                    <th>Date</th>
                    <th>Transcript</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.map((r) => (
                    <tr key={r.id}>
                      <td>{r.name || <span className="muted">—</span>}</td>
                      <td>{r.url || <span className="muted">—</span>}</td>
                      <td>{r.date || <span className="muted">—</span>}</td>
                      <td>
                        {r.transcript ? (
                          `${r.transcript.slice(0, 60)}…`
                        ) : (
                          <span className="muted">none</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="row">
            <button className="primary" onClick={importRows}>
              Import {totalRows} calls
            </button>
            <button
              className="ghost"
              onClick={() => downloadText('calls.csv', buildCsv(toCallRows(sheet, mapping)))}
            >
              Download name,url,date CSV
            </button>
            {rows.length > 0 && (
              <span className="muted">Importing replaces the {rows.length} calls currently loaded.</span>
            )}
          </div>
        </div>
      )}
    </>
  )
}
