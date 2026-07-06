import { useState } from 'react'
import { persistInsuranceLead } from '../lib/db'
import { latestBooking } from '../lib/storage'
import { SUPPORT } from '../lib/contact'
import Icon from '../components/Icon'
import type { Customer } from '../lib/types'

interface Props {
  profile: Customer
  onBack: () => void
}

const COVER_POINTS = [
  'Cover for your goods while they are loaded, in transit and offloaded',
  'One move or ongoing cover — you choose',
  'A real person calls you back with options, usually within a day',
]

export default function Insurance({ profile, onBack }: Props) {
  const [name, setName] = useState(profile.name)
  const [phone, setPhone] = useState(profile.phone)
  const [email, setEmail] = useState(profile.email)
  const [note, setNote] = useState('')
  const [consent, setConsent] = useState(false)
  const [ref, setRef] = useState<string | null>(null)

  const bookingRef = latestBooking()?.id ?? ''
  const ready = name.trim().length > 1 && phone.trim().length >= 9 && consent

  const submit = () => {
    const id = 'INS-' + Date.now().toString().slice(-6)
    persistInsuranceLead({
      id,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      bookingRef,
      note: note.trim(),
      createdAt: Date.now(),
    })
    setRef(id)
  }

  if (ref) {
    const waText = encodeURIComponent(
      `Insurance quote request ${ref}\nName: ${name.trim()}\nCell: ${phone.trim()}` +
        (email.trim() ? `\nEmail: ${email.trim()}` : '') +
        (bookingRef ? `\nBooking: ${bookingRef}` : '') +
        (note.trim() ? `\nNote: ${note.trim()}` : ''),
    )
    return (
      <div className="screen screen--push">
        <div className="topbar">
          <button className="ghost-btn" onClick={onBack} aria-label="Back"><Icon name="back" /></button>
          <span className="topbar-title">Insurance</span>
          <span className="ghost-spacer" />
        </div>
        <div className="confirm-burst">
          <div className="confirm-check"><Icon name="check" /></div>
          <h2 className="confirm-title">Request received</h2>
          <p className="confirm-sub">Reference {ref}. Our team will call you about cover options.</p>
        </div>
        <a
          className="primary-btn insurance-wa"
          href={`https://wa.me/${SUPPORT.whatsapp}?text=${waText}`}
          target="_blank"
          rel="noopener"
        >
          Send it on WhatsApp too
        </a>
        <p className="secure-note">Tapping the button opens WhatsApp with your request pre-filled — the fastest way to reach us.</p>
        <div className="sticky-cta">
          <button className="primary-btn" onClick={onBack}>Done</button>
        </div>
      </div>
    )
  }

  return (
    <div className="screen screen--push">
      <div className="topbar">
        <button className="ghost-btn" onClick={onBack} aria-label="Back"><Icon name="back" /></button>
        <span className="topbar-title">Goods-in-transit cover</span>
        <span className="ghost-spacer" />
      </div>

      <div className="insurance-hero">
        <span className="insurance-shield" aria-hidden><Icon name="shield" /></span>
        <h2 className="confirm-title">Protect what you're moving</h2>
        <p className="lede">No insurance for your goods in transit? Leave your details and we'll come back to you with cover options.</p>
      </div>

      <div className="glass info-card">
        {COVER_POINTS.map((p) => (
          <div key={p} className="cover-point">
            <span className="cover-tick"><Icon name="check" /></span>
            <span>{p}</span>
          </div>
        ))}
      </div>

      <div className="form-stack">
        <p className="group-label">Your details</p>
        <label className="glass field-group">
          <span className="field-label">Full name</span>
          <input className="field-input" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="glass field-group">
          <span className="field-label">Cell number</span>
          <input className="field-input" type="tel" inputMode="tel" placeholder="Mobile number" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </label>
        <label className="glass field-group">
          <span className="field-label">Email</span>
          <input className="field-input" type="email" inputMode="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="glass field-group">
          <span className="field-label">What are you moving? (optional)</span>
          <textarea className="field-input field-textarea" placeholder="e.g. 2-bedroom home, includes a TV and fridge" value={note} onChange={(e) => setNote(e.target.value)} />
        </label>

        <button className="glass check-row" onClick={() => setConsent(!consent)} aria-pressed={consent}>
          <div className="online-text">
            <strong>You may contact me about insurance</strong>
            <span>We'll only use your details for this quote (POPIA)</span>
          </div>
          <span className={`switch ${consent ? 'switch--on' : ''}`} aria-hidden />
        </button>
      </div>

      <div className="sticky-cta">
        <button className="primary-btn" disabled={!ready} onClick={submit}>
          {ready ? 'Request a callback' : consent ? 'Add your name & number' : 'Tick consent to continue'}
        </button>
      </div>
    </div>
  )
}
