import { useMemo, useState } from 'react'
import { UploadView } from './components/UploadView'
import { CallsView } from './components/CallsView'
import { TemplatesView } from './components/TemplatesView'
import { ReportView } from './components/ReportView'
import { SettingsView } from './components/SettingsView'
import {
  allTemplates,
  useActiveTemplateId,
  useCustomTemplates,
  useReport,
  useRows,
  useSettings,
} from './lib/store'

type Tab = 'upload' | 'calls' | 'templates' | 'report' | 'settings'

const TABS: { id: Tab; label: string }[] = [
  { id: 'upload', label: 'Upload' },
  { id: 'calls', label: 'Calls' },
  { id: 'templates', label: 'Templates' },
  { id: 'report', label: 'Report' },
  { id: 'settings', label: 'Settings' },
]

export default function App() {
  const [tab, setTab] = useState<Tab>('upload')
  const [rows, setRows] = useRows()
  const [settings, setSettings] = useSettings()
  const [customTemplates, setCustomTemplates] = useCustomTemplates()
  const [activeTemplateId, setActiveTemplateId] = useActiveTemplateId()
  const [report, setReport] = useReport()

  const templates = useMemo(() => allTemplates(customTemplates), [customTemplates])
  const activeTemplate = templates.find((t) => t.id === activeTemplateId) ?? templates[0]
  const analysedCount = rows.filter((r) => r.status === 'done').length

  return (
    <>
      <header className="topbar">
        <div className="brand">
          <span className="brand-dot" />
          Call Analyser
        </div>
        <nav className="tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`tab${tab === t.id ? ' active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
              {t.id === 'calls' && rows.length > 0 && <span className="count">{rows.length}</span>}
              {t.id === 'report' && analysedCount > 0 && <span className="count">{analysedCount}</span>}
            </button>
          ))}
        </nav>
        <div className="key-status">
          <span className={`dot${settings.apiKey ? ' ok' : ''}`} />
          {settings.apiKey ? 'API key set' : 'No API key'}
        </div>
      </header>
      <main>
        {tab === 'upload' && (
          <UploadView
            rows={rows}
            setRows={(r) => {
              setRows(r)
              setReport(null)
            }}
            onDone={() => setTab('calls')}
          />
        )}
        {tab === 'calls' && (
          <CallsView
            rows={rows}
            setRows={setRows}
            settings={settings}
            templates={templates}
            activeTemplate={activeTemplate}
            setActiveTemplateId={setActiveTemplateId}
            goToSettings={() => setTab('settings')}
            goToUpload={() => setTab('upload')}
          />
        )}
        {tab === 'templates' && (
          <TemplatesView
            templates={templates}
            customTemplates={customTemplates}
            setCustomTemplates={setCustomTemplates}
            activeTemplateId={activeTemplate.id}
            setActiveTemplateId={setActiveTemplateId}
          />
        )}
        {tab === 'report' && (
          <ReportView
            rows={rows}
            settings={settings}
            template={activeTemplate}
            report={report}
            setReport={setReport}
            goToCalls={() => setTab('calls')}
          />
        )}
        {tab === 'settings' && <SettingsView settings={settings} setSettings={setSettings} />}
      </main>
    </>
  )
}
