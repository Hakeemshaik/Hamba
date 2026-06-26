import { useState } from 'react'
import { persistComplaint } from '../lib/db'
import { latestBooking } from '../lib/storage'
import Icon from '../components/Icon'

interface Props {
  onBack: () => void
}

const CATEGORIES = [
  'Late arrival',
  'Damaged goods',
  'Driver conduct',
  'Pricing issue',
  'Other',
]

export default function Complaint({ onBack }: Props) {
  const [category, setCategory] = useState('')
  const [reference, setReference] = useState(latestBooking()?.id ?? '')
  const [message, setMessage] = useState('')
  const [ref, setRef] = useState<string | null>(null)

  const ready = !!category && message.trim().length > 4

  const submit = () => {
    const id = 'CMP-' + Date.now().toString().slice(-6)
    persistComplaint({ id, category, reference: reference.trim(), message: message.trim(), createdAt: Date.now() })
    setRef(id)
  }

  if (ref) {
    return (
      <div className="screen">
        <div className="topbar">
          <button className="ghost-btn" onClick={onBack} aria-label="Back"><Icon name="back" /></button>
          <span className="topbar-title">Complaint</span>
          <span className="ghost-spacer" />
        </div>
        <div className="confirm-burst">
          <div className="confirm-check"><Icon name="check" /></div>
          <h2 className="confirm-title">Complaint received</h2>
          <p className="confirm-sub">Reference {ref}. Our team will be in touch, usually within one business day.</p>
        </div>
        <div className="sticky-cta">
          <button className="primary-btn" onClick={onBack}>Done</button>
        </div>
      </div>
    )
  }

  return (
    <div className="screen">
      <div className="topbar">
        <button className="ghost-btn" onClick={onBack} aria-label="Back"><Icon name="back" /></button>
        <span className="topbar-title">Report a problem</span>
        <span className="ghost-spacer" />
      </div>

      <p className="lede">Tell us what went wrong and we’ll make it right.</p>

      <div className="form-stack">
        <p className="group-label">What happened?</p>
        <div className="cat-wrap">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={`cat-chip ${category === c ? 'cat-chip--on' : ''}`}
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
            >
              {c}
            </button>
          ))}
        </div>

        <label className="glass field-group">
          <span className="field-label">Booking reference (optional)</span>
          <input
            className="field-input"
            placeholder="e.g. HMB-481204"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
          />
        </label>

        <label className="glass field-group">
          <span className="field-label">Details</span>
          <textarea
            className="field-input field-textarea"
            placeholder="Describe what happened…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </label>
      </div>

      <div className="sticky-cta">
        <button className="primary-btn" disabled={!ready} onClick={submit}>
          {ready ? 'Submit complaint' : 'Pick a reason & add details'}
        </button>
      </div>
    </div>
  )
}
