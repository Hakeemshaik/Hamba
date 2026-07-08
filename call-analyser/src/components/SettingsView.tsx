import { MODELS } from '../lib/anthropic'
import type { Settings } from '../lib/types'

interface Props {
  settings: Settings
  setSettings: (s: Settings) => void
}

export function SettingsView({ settings, setSettings }: Props) {
  return (
    <>
      <h1>Settings</h1>
      <p className="subtitle">Everything runs in your browser — your key and call data never leave this device except to call the Claude API directly.</p>

      <div className="card">
        <h2>Claude API</h2>
        <div className="mapping-grid">
          <label className="field" style={{ gridColumn: '1 / -1' }}>
            Anthropic API key
            <input
              type="password"
              placeholder="sk-ant-…"
              value={settings.apiKey}
              onChange={(e) => setSettings({ ...settings, apiKey: e.target.value.trim() })}
            />
          </label>
          <label className="field">
            Model
            <select
              value={settings.model}
              onChange={(e) => setSettings({ ...settings, model: e.target.value })}
            >
              {MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            Parallel analyses (1–8)
            <input
              type="number"
              min={1}
              max={8}
              value={settings.concurrency}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  concurrency: Math.min(8, Math.max(1, Number(e.target.value) || 1)),
                })
              }
            />
          </label>
        </div>
        <p className="muted" style={{ marginBottom: 0 }}>
          Get a key at console.anthropic.com → API keys. It is stored in this browser's local storage only.
        </p>
      </div>

      <div className="card">
        <h2>Data</h2>
        <p className="muted">
          Calls, analyses, custom templates and reports are stored locally in this browser.
        </p>
        <button
          className="danger"
          onClick={() => {
            if (confirm('Clear all calls, analyses, templates and reports stored in this browser?')) {
              localStorage.clear()
              location.reload()
            }
          }}
        >
          Clear all local data
        </button>
      </div>
    </>
  )
}
