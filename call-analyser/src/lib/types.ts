export type CallStatus = 'pending' | 'no-transcript' | 'analyzing' | 'done' | 'error'

export interface CallRow {
  id: string
  name: string
  url: string
  date: string
  transcript?: string
  /** any extra columns carried over from the source sheet */
  extra?: Record<string, string>
  status: CallStatus
  /** parsed JSON returned by the analysis template */
  result?: Record<string, unknown>
  /** template id the result was produced with */
  resultTemplateId?: string
  error?: string
}

export interface Template {
  id: string
  name: string
  description: string
  /** the full analysis prompt; may contain the {{TRANSCRIPT}} placeholder */
  prompt: string
  builtIn: boolean
  /** fields worth surfacing in the calls table, in priority order */
  keyFields: string[]
  /** field holding the outcome enum (used for charts) */
  outcomeField: string
  /** field holding the sentiment enum, if any */
  sentimentField?: string
  /** field holding the call summary, if any */
  summaryField?: string
}

export interface Settings {
  apiKey: string
  model: string
  concurrency: number
}

export interface ColumnMapping {
  name: string | null
  url: string | null
  date: string | null
  transcript: string | null
}

export interface ParsedSheet {
  sheetNames: string[]
  activeSheet: string
  headers: string[]
  rows: Record<string, string>[]
}

export interface ReportData {
  markdown: string
  generatedAt: string
  templateId: string
  callCount: number
}
