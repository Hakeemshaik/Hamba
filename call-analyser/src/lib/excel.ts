import * as XLSX from 'xlsx'
import type { CallRow, ColumnMapping, ParsedSheet } from './types'

/** Parse an uploaded .xlsx / .xls / .csv file into headers + string rows. */
export async function parseFile(file: File, sheetName?: string): Promise<ParsedSheet> {
  const buf = await file.arrayBuffer()
  const wb = XLSX.read(buf, { type: 'array', cellDates: true })
  const sheetNames = wb.SheetNames
  const active = sheetName && sheetNames.includes(sheetName) ? sheetName : sheetNames[0]
  const ws = wb.Sheets[active]
  const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: '', raw: false })
  const headers = raw.length
    ? Object.keys(raw[0])
    : (XLSX.utils.sheet_to_json<string[]>(ws, { header: 1 })[0] as string[] | undefined) ?? []
  const rows = raw.map((r) => {
    const out: Record<string, string> = {}
    for (const k of Object.keys(r)) out[k] = String(r[k] ?? '').trim()
    return out
  })
  return { sheetNames, activeSheet: active, headers, rows }
}

const NAME_HINTS = ['name', 'client', 'tenant', 'caller', 'lead', 'customer', 'contact', 'owner']
const URL_HINTS = ['url', 'link', 'recording', 'audio', 'call url', 'call link', 'href']
const DATE_HINTS = ['date', 'time', 'created', 'when', 'day', 'timestamp']
const TRANSCRIPT_HINTS = ['transcript', 'conversation', 'dialogue', 'dialog', 'text', 'content']

function scoreHeader(header: string, hints: string[]): number {
  const h = header.toLowerCase().trim()
  let score = 0
  hints.forEach((hint, i) => {
    if (h === hint) score = Math.max(score, 100 - i)
    else if (h.includes(hint)) score = Math.max(score, 50 - i)
  })
  return score
}

function looksLikeUrl(v: string): boolean {
  return /^https?:\/\//i.test(v)
}

function looksLikeDate(v: string): boolean {
  if (!v) return false
  if (/^\d{4}-\d{2}-\d{2}/.test(v) || /^\d{1,2}[/-]\d{1,2}[/-]\d{2,4}/.test(v)) return true
  const t = Date.parse(v)
  return !Number.isNaN(t) && /\d/.test(v)
}

/** Guess which source columns map to name / url / date / transcript. */
export function detectColumns(headers: string[], rows: Record<string, string>[]): ColumnMapping {
  const sample = rows.slice(0, 25)
  const pick = (hints: string[], valueTest?: (v: string) => boolean, exclude: (string | null)[] = []) => {
    let best: string | null = null
    let bestScore = 0
    for (const h of headers) {
      if (exclude.includes(h)) continue
      let score = scoreHeader(h, hints)
      if (valueTest && sample.length) {
        const hits = sample.filter((r) => valueTest(r[h] ?? '')).length
        if (hits / sample.length > 0.6) score += 40
      }
      if (score > bestScore) {
        bestScore = score
        best = h
      }
    }
    return bestScore > 0 ? best : null
  }

  const url = pick(URL_HINTS, looksLikeUrl)
  const name = pick(NAME_HINTS, undefined, [url])
  const date = pick(DATE_HINTS, looksLikeDate, [url, name])
  // transcripts are long text — require hint match or very long average values
  let transcript = pick(TRANSCRIPT_HINTS, undefined, [url, name, date])
  if (!transcript) {
    for (const h of headers) {
      if ([url, name, date].includes(h)) continue
      const avg =
        rows.slice(0, 25).reduce((s, r) => s + (r[h]?.length ?? 0), 0) / Math.max(1, Math.min(rows.length, 25))
      if (avg > 300) {
        transcript = h
        break
      }
    }
  }
  return { name, url, date, transcript }
}

function normaliseDate(v: string): string {
  if (!v) return ''
  const m = v.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (m) return `${m[1]}-${m[2]}-${m[3]}`
  const t = Date.parse(v)
  if (!Number.isNaN(t)) {
    const d = new Date(t)
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
  }
  return v
}

let idCounter = 0
function nextId(): string {
  idCounter += 1
  return `call-${Date.now().toString(36)}-${idCounter}`
}

/** Apply a column mapping to the parsed sheet, producing normalized call rows. */
export function toCallRows(sheet: ParsedSheet, mapping: ColumnMapping): CallRow[] {
  return sheet.rows
    .filter((r) => Object.values(r).some((v) => v !== ''))
    .map((r) => {
      const transcript = mapping.transcript ? r[mapping.transcript] : ''
      const extra: Record<string, string> = {}
      for (const h of sheet.headers) {
        if (![mapping.name, mapping.url, mapping.date, mapping.transcript].includes(h)) {
          if (r[h]) extra[h] = r[h]
        }
      }
      return {
        id: nextId(),
        name: mapping.name ? r[mapping.name] : '',
        url: mapping.url ? r[mapping.url] : '',
        date: normaliseDate(mapping.date ? r[mapping.date] : ''),
        transcript: transcript || undefined,
        extra: Object.keys(extra).length ? extra : undefined,
        status: transcript ? ('pending' as const) : ('no-transcript' as const),
      }
    })
}

function csvEscape(v: string): string {
  if (/[",\n\r]/.test(v)) return `"${v.replace(/"/g, '""')}"`
  return v
}

/** Build the normalized name,url,date CSV. */
export function buildCsv(rows: CallRow[]): string {
  const lines = ['name,url,date']
  for (const r of rows) {
    lines.push([csvEscape(r.name), csvEscape(r.url), csvEscape(r.date)].join(','))
  }
  return lines.join('\r\n')
}

/** Build a CSV of the analysis results (one column per result field). */
export function buildResultsCsv(rows: CallRow[]): string {
  const done = rows.filter((r) => r.status === 'done' && r.result)
  if (!done.length) return ''
  const fieldSet = new Set<string>()
  for (const r of done) Object.keys(r.result!).forEach((k) => fieldSet.add(k))
  const fields = ['name', 'url', 'date', ...fieldSet]
  const lines = [fields.map(csvEscape).join(',')]
  for (const r of done) {
    const vals = fields.map((f) => {
      if (f === 'name') return r.name
      if (f === 'url') return r.url
      if (f === 'date') return r.date
      const v = r.result![f]
      if (v === null || v === undefined) return ''
      return typeof v === 'object' ? JSON.stringify(v) : String(v)
    })
    lines.push(vals.map(csvEscape).join(','))
  }
  return lines.join('\r\n')
}

export function downloadText(filename: string, text: string, mime = 'text/csv'): void {
  const blob = new Blob([text], { type: `${mime};charset=utf-8` })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = filename
  a.click()
  URL.revokeObjectURL(a.href)
}
