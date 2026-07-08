import { useEffect, useState } from 'react'
import { DEFAULT_SETTINGS } from './anthropic'
import { BUILT_IN_TEMPLATES } from './templates'
import type { CallRow, ReportData, Settings, Template } from './types'

const KEYS = {
  rows: 'call-analyser.rows',
  settings: 'call-analyser.settings',
  templates: 'call-analyser.customTemplates',
  activeTemplate: 'call-analyser.activeTemplate',
  report: 'call-analyser.report',
} as const

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function save(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // storage full — analyses with huge transcripts can exceed quota; app keeps working in memory
  }
}

export function usePersistentState<T>(key: keyof typeof KEYS, fallback: T) {
  const [value, setValue] = useState<T>(() => load(KEYS[key], fallback))
  useEffect(() => {
    save(KEYS[key], value)
  }, [key, value])
  return [value, setValue] as const
}

export function useRows() {
  return usePersistentState<CallRow[]>('rows', [])
}

export function useSettings() {
  return usePersistentState<Settings>('settings', DEFAULT_SETTINGS)
}

export function useCustomTemplates() {
  return usePersistentState<Template[]>('templates', [])
}

export function useActiveTemplateId() {
  return usePersistentState<string>('activeTemplate', BUILT_IN_TEMPLATES[0].id)
}

export function useReport() {
  return usePersistentState<ReportData | null>('report', null)
}

export function allTemplates(custom: Template[]): Template[] {
  return [...BUILT_IN_TEMPLATES, ...custom]
}

/** Aggregate stats over analysed rows for charts and the report prompt. */
export function computeStats(rows: CallRow[], template: Template) {
  const done = rows.filter((r) => r.status === 'done' && r.result)
  const count = (field: string) => {
    const map = new Map<string, number>()
    for (const r of done) {
      const v = r.result![field]
      const key = v === null || v === undefined || v === '' ? '(none)' : String(v)
      map.set(key, (map.get(key) ?? 0) + 1)
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1])
  }

  const outcomes = count(template.outcomeField)
  const sentiments = template.sentimentField ? count(template.sentimentField) : []

  const yesCount = (field: string) =>
    done.filter((r) => String(r.result![field] ?? '').toLowerCase() === 'yes').length

  const sumField = (field: string) =>
    done.reduce((s, r) => {
      const v = Number(r.result![field])
      return Number.isFinite(v) ? s + v : s
    }, 0)

  const fieldNames = new Set<string>()
  for (const r of done) Object.keys(r.result!).forEach((k) => fieldNames.add(k))

  const flags: Record<string, number> = {}
  for (const f of [
    'human_review_required',
    'escalation_flag',
    'dispute_raised',
    'callback_required',
    'wrong_person',
    'do_not_call',
    'nca_compliance_breach',
    'hallucinated_figures',
    'maintenance_issue_flagged',
  ]) {
    if (fieldNames.has(f)) flags[f] = yesCount(f)
  }

  const hasPtp = fieldNames.has('ptp_confirmed')
  const ptp = {
    ptp_count: hasPtp ? yesCount('ptp_confirmed') : undefined,
    ptp_total_zar: hasPtp ? Math.round(sumField('ptp_amount') * 100) / 100 : undefined,
  }

  return {
    total_rows: rows.length,
    analysed: done.length,
    errors: rows.filter((r) => r.status === 'error').length,
    missing_transcript: rows.filter((r) => r.status === 'no-transcript').length,
    outcome_distribution: Object.fromEntries(outcomes),
    sentiment_distribution: Object.fromEntries(sentiments),
    flags,
    ...ptp,
  }
}
