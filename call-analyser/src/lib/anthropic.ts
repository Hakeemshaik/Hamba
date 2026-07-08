import Anthropic from '@anthropic-ai/sdk'
import type { CallRow, Settings, Template } from './types'

export const MODELS = [
  { id: 'claude-opus-4-8', label: 'Claude Opus 4.8 (best quality)' },
  { id: 'claude-sonnet-5', label: 'Claude Sonnet 5 (fast + capable)' },
  { id: 'claude-haiku-4-5', label: 'Claude Haiku 4.5 (fastest, cheapest)' },
] as const

export const DEFAULT_SETTINGS: Settings = {
  apiKey: '',
  model: 'claude-opus-4-8',
  concurrency: 3,
}

function makeClient(settings: Settings): Anthropic {
  return new Anthropic({
    apiKey: settings.apiKey,
    // this app runs entirely in the user's browser with their own key
    dangerouslyAllowBrowser: true,
  })
}

/** Pull the first JSON object out of a model response, tolerating code fences. */
export function extractJson(text: string): Record<string, unknown> {
  const cleaned = text.replace(/```(?:json)?/gi, '').trim()
  const start = cleaned.indexOf('{')
  const end = cleaned.lastIndexOf('}')
  if (start === -1 || end === -1 || end <= start) {
    throw new Error('No JSON object found in the model response')
  }
  return JSON.parse(cleaned.slice(start, end + 1)) as Record<string, unknown>
}

const TRANSCRIPT_PLACEHOLDER_RE = /\{\{TRANSCRIPT\}\}|<<<insert the single call transcript here>>>/g

async function withRetries<T>(fn: () => Promise<T>): Promise<T> {
  let attempt = 0
  // SDK already retries twice internally; this adds a slower outer loop for 429/529 bursts
  for (;;) {
    try {
      return await fn()
    } catch (err) {
      attempt += 1
      const retryable =
        err instanceof Anthropic.RateLimitError ||
        err instanceof Anthropic.InternalServerError ||
        err instanceof Anthropic.APIConnectionError
      if (!retryable || attempt > 3) throw err
      await new Promise((r) => setTimeout(r, 2000 * 2 ** attempt))
    }
  }
}

/** Run one call transcript through a template and return the parsed JSON. */
export async function analyseTranscript(
  settings: Settings,
  template: Template,
  transcript: string,
): Promise<Record<string, unknown>> {
  const client = makeClient(settings)
  const hasPlaceholder = TRANSCRIPT_PLACEHOLDER_RE.test(template.prompt)
  TRANSCRIPT_PLACEHOLDER_RE.lastIndex = 0

  const request = hasPlaceholder
    ? {
        system: 'You are a call analysis assistant. Return a single valid JSON object only.',
        user: template.prompt.replace(TRANSCRIPT_PLACEHOLDER_RE, transcript),
      }
    : {
        system: template.prompt,
        user: `TRANSCRIPT:\n\n${transcript}`,
      }

  const response = await withRetries(() =>
    client.messages.create({
      model: settings.model,
      max_tokens: 4096,
      system: request.system,
      messages: [{ role: 'user', content: request.user }],
    }),
  )

  if (response.stop_reason === 'refusal') {
    throw new Error('The model declined to analyse this transcript')
  }
  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('')
  return extractJson(text)
}

/** Simple promise pool: run tasks with bounded concurrency. */
export async function runPool<T>(
  items: T[],
  limit: number,
  worker: (item: T, index: number) => Promise<void>,
  isCancelled: () => boolean,
): Promise<void> {
  let next = 0
  const lanes = Array.from({ length: Math.max(1, limit) }, async () => {
    while (next < items.length && !isCancelled()) {
      const i = next
      next += 1
      await worker(items[i], i)
    }
  })
  await Promise.all(lanes)
}

const REPORT_SYSTEM = `You are a senior call-centre operations analyst. You will be given:
1. The name and purpose of the analysis template that was used.
2. Pre-computed aggregate statistics.
3. The per-call structured analysis records (JSON).

Write a management report in Markdown with these sections:
# <Report title including the campaign/template name and date>
## Executive summary — 3-6 bullet takeaways a manager needs.
## Outcome breakdown — what happened across the calls, with numbers and percentages.
## Key metrics — payments/PTPs, callbacks, escalations, compliance or quality issues, whichever apply to this template.
## Notable calls — up to 8 individual calls worth a human's attention (disputes, escalations, compliance risks, big commitments), each with the caller name and one-line reason.
## Risks & follow-ups — concrete actions, owners where inferable, and anything requiring human review.
## Recommendations — 3-6 specific, actionable suggestions to improve outcomes or agent performance.

Rules: base everything strictly on the data provided; do not invent calls, names or numbers. Use plain language. Amounts are ZAR unless stated otherwise. Keep it under ~1200 words.`

/** Generate an aggregate markdown report over all analysed calls. */
export async function generateReport(
  settings: Settings,
  template: Template,
  rows: CallRow[],
  stats: Record<string, unknown>,
): Promise<string> {
  const client = makeClient(settings)
  const done = rows.filter((r) => r.status === 'done' && r.result)

  // cap payload size: compact records, drop transcripts
  const records = done.slice(0, 300).map((r) => ({
    name: r.name,
    date: r.date,
    ...r.result,
  }))

  const userMsg = [
    `TEMPLATE: ${template.name}`,
    `TEMPLATE PURPOSE: ${template.description}`,
    `TOTAL CALLS ANALYSED: ${done.length}${done.length > records.length ? ` (records truncated to ${records.length})` : ''}`,
    '',
    'AGGREGATE STATISTICS:',
    JSON.stringify(stats, null, 2),
    '',
    'PER-CALL RECORDS:',
    JSON.stringify(records),
  ].join('\n')

  const response = await withRetries(() =>
    client.messages
      .stream({
        model: settings.model,
        max_tokens: 8192,
        system: REPORT_SYSTEM,
        messages: [{ role: 'user', content: userMsg }],
      })
      .finalMessage(),
  )

  if (response.stop_reason === 'refusal') {
    throw new Error('The model declined to generate this report')
  }
  return response.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('')
}

export function friendlyError(err: unknown): string {
  if (err instanceof Anthropic.AuthenticationError) return 'Invalid API key — check Settings'
  if (err instanceof Anthropic.RateLimitError) return 'Rate limited — try again shortly or lower concurrency'
  if (err instanceof Anthropic.APIConnectionError) return 'Network error reaching the Claude API'
  if (err instanceof Anthropic.APIError) return `API error ${err.status ?? ''}: ${err.message}`
  if (err instanceof Error) return err.message
  return String(err)
}
