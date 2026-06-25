import { useState } from 'react'
import Icon from '../components/Icon'
import Illustration from '../components/Illustration'
import type { Customer } from '../lib/types'

interface Props {
  profile: Customer
  onBack: () => void
  onSave: (c: Customer) => void
}

export default function EditProfile({ profile, onBack, onSave }: Props) {
  const [form, setForm] = useState<Customer>(profile)
  const set = (patch: Partial<Customer>) => setForm((f) => ({ ...f, ...patch }))

  return (
    <div className="screen">
      <div className="topbar">
        <button className="ghost-btn" onClick={onBack} aria-label="Back">
          <Icon name="back" />
        </button>
        <span className="topbar-title">Personal information</span>
        <span className="ghost-spacer" />
      </div>

      <div className="edit-avatar">
        <span className="edit-avatar-img"><Illustration name="avatar" /></span>
        <button className="edit-photo-badge" aria-label="Change photo"><Icon name="camera" /></button>
        <p className="edit-photo-label">Change your photo</p>
      </div>

      <div className="form-stack">
        <label className="glass field-group">
          <span className="field-label">Full name</span>
          <input className="field-input" placeholder="e.g. Lerato Khumalo" value={form.name} onChange={(e) => set({ name: e.target.value })} />
        </label>
        <label className="glass field-group">
          <span className="field-label">Mobile number</span>
          <input className="field-input" type="tel" inputMode="tel" placeholder="+27 82 000 0000" value={form.phone} onChange={(e) => set({ phone: e.target.value })} />
        </label>
        <label className="glass field-group">
          <span className="field-label">Email</span>
          <input className="field-input" type="email" inputMode="email" placeholder="you@email.co.za" value={form.email} onChange={(e) => set({ email: e.target.value })} />
        </label>
        <label className="glass field-group">
          <span className="field-label">Default pickup address</span>
          <input className="field-input" placeholder="Street, suburb, city" value={form.address} onChange={(e) => set({ address: e.target.value })} />
        </label>
      </div>

      <div className="sticky-cta">
        <button className="primary-btn" onClick={() => onSave(form)}>Save changes</button>
      </div>
    </div>
  )
}
