import { useState } from 'react'
import { getThemePref, setThemePref, type ThemePref } from '../lib/theme'
import Icon from '../components/Icon'

interface Props {
  onBack: () => void
  onLegal: (tab: 'terms' | 'privacy') => void
}

const THEMES: { id: ThemePref; label: string }[] = [
  { id: 'system', label: 'System' },
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
]

const KEY_PUSH = 'hamba.pushpref.v1'

export default function Settings({ onBack, onLegal }: Props) {
  const [theme, setTheme] = useState<ThemePref>(() => getThemePref())
  const [push, setPush] = useState(() => {
    try { return localStorage.getItem(KEY_PUSH) !== 'off' } catch { return true }
  })
  const [copied, setCopied] = useState(false)

  const pickTheme = (t: ThemePref) => {
    setTheme(t)
    setThemePref(t)
  }

  const togglePush = () => {
    const next = !push
    setPush(next)
    try { localStorage.setItem(KEY_PUSH, next ? 'on' : 'off') } catch { /* ignore */ }
  }

  const invite = async () => {
    const text = 'Book moves, deliveries and rubble removal with Hamba. Use code HAMBA50 — we both save R50.'
    if (navigator.share) {
      try { await navigator.share({ title: 'Hamba', text }) } catch { /* user closed */ }
    } else {
      try {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1800)
      } catch { /* ignore */ }
    }
  }

  return (
    <div className="screen screen--push">
      <div className="topbar">
        <button className="ghost-btn" onClick={onBack} aria-label="Back"><Icon name="back" /></button>
        <span className="topbar-title">Settings</span>
        <span className="ghost-spacer" />
      </div>

      <p className="group-label">Appearance</p>
      <div className="seg" role="radiogroup" aria-label="Theme">
        {THEMES.map((t) => (
          <button
            key={t.id}
            role="radio"
            aria-checked={theme === t.id}
            className={`seg-opt ${theme === t.id ? 'seg-opt--on' : ''}`}
            onClick={() => pickTheme(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <p className="group-label">Notifications</p>
      <button className="glass check-row" onClick={togglePush} aria-pressed={push}>
        <div className="online-text">
          <strong>Booking updates</strong>
          <span>Confirmations, driver assignment and reminders</span>
        </div>
        <span className={`switch ${push ? 'switch--on' : ''}`} aria-hidden />
      </button>

      <p className="group-label">Invite friends</p>
      <div className="glass referral">
        <div className="referral-text">
          <strong>Give R50, get R50</strong>
          <span>Share your code — you both save on your next move.</span>
        </div>
        <span className="referral-code">HAMBA50</span>
      </div>
      <button className="glass new-trip" onClick={invite}>
        <Icon name="share" /> {copied ? 'Copied to clipboard' : 'Share your code'}
      </button>

      <p className="group-label">About</p>
      <div className="glass info-card">
        <div className="info-row"><span>Version</span><span>1.0.0</span></div>
        <div className="info-row"><span>Service area</span><span>Johannesburg</span></div>
        <button className="info-row info-link" onClick={() => onLegal('terms')}><span>Terms of Service</span><span><Icon name="chevron" /></span></button>
        <button className="info-row info-link" onClick={() => onLegal('privacy')}><span>Privacy Policy</span><span><Icon name="chevron" /></span></button>
      </div>
    </div>
  )
}
