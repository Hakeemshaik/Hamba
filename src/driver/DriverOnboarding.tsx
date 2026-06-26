import { useState } from 'react'
import type { Driver } from '../lib/types'
import Icon from '../components/Icon'

interface Props {
  initial: Driver
  editing?: boolean
  onSubmit: (d: Driver) => void
  onExit: () => void
}

const LICENCE_CODES = ['B', 'EB', 'C1', 'C', 'EC']
const VEHICLE_TYPES = ['Bakkie', '1-ton', '1.5-ton truck', '4-ton truck', 'Panel van']

export default function DriverOnboarding({ initial, editing, onSubmit, onExit }: Props) {
  const [d, setD] = useState<Driver>(initial)
  const set = (p: Partial<Driver>) => setD((prev) => ({ ...prev, ...p }))
  const file = (key: keyof Driver) => (e: React.ChangeEvent<HTMLInputElement>) =>
    set({ [key]: e.target.files?.[0]?.name ?? '' } as Partial<Driver>)

  const ready =
    !!d.name && !!d.phone && !!d.idNumber && !!d.licenceNumber && !!d.licenceCode &&
    !!d.vehicleType && !!d.vehicleMake && !!d.vehicleReg &&
    !!d.bankHolder && !!d.bankName && !!d.bankAccount &&
    !!d.docId && !!d.docLicence && !!d.docDisc

  const Txt = (p: { label: string; k: keyof Driver; type?: string; mode?: 'tel' | 'email' | 'numeric'; ph?: string }) => (
    <label className="glass field-group">
      <span className="field-label">{p.label}</span>
      <input
        className="field-input"
        type={p.type ?? 'text'}
        inputMode={p.mode}
        placeholder={p.ph}
        value={d[p.k] as string}
        onChange={(e) => set({ [p.k]: e.target.value } as Partial<Driver>)}
      />
    </label>
  )

  const Doc = (p: { label: string; k: keyof Driver }) => (
    <div className="glass field-group docrow">
      <div className="docrow-text">
        <div className="field-label">{p.label}</div>
        <div className={`docstate ${d[p.k] ? 'docstate--on' : ''}`}>
          {(d[p.k] as string) || 'No file selected'}
        </div>
      </div>
      <label className="doc-btn">
        {d[p.k] ? 'Replace' : 'Upload'}
        <input type="file" accept="image/*,.pdf" hidden onChange={file(p.k)} />
      </label>
    </div>
  )

  return (
    <div className="screen">
      <div className="topbar">
        <button className="ghost-btn" onClick={onExit} aria-label="Back"><Icon name="back" /></button>
        <span className="topbar-title">{editing ? 'Edit application' : 'Driver application'}</span>
        <span className="ghost-spacer" />
      </div>

      {!editing && <p className="lede">Join the Hamba driver network. We review every application before you can take jobs.</p>}

      <div className="form-stack">
        <p className="group-label">Your details</p>
        <Txt label="Full name" k="name" />
        <Txt label="Mobile number" k="phone" type="tel" mode="tel" />
        <Txt label="Email (optional)" k="email" type="email" mode="email" />
        <Txt label="SA ID number" k="idNumber" mode="numeric" />

        <p className="group-label">Driver's licence</p>
        <Txt label="Licence number" k="licenceNumber" />
        <div className="cat-wrap">
          {LICENCE_CODES.map((c) => (
            <button key={c} className={`cat-chip ${d.licenceCode === c ? 'cat-chip--on' : ''}`} onClick={() => set({ licenceCode: c })}>
              Code {c}
            </button>
          ))}
        </div>
        <label className="glass field-group">
          <span className="field-label">Licence expiry</span>
          <input className="field-input" type="date" value={d.licenceExpiry} onChange={(e) => set({ licenceExpiry: e.target.value })} />
        </label>

        <p className="group-label">Your vehicle</p>
        <div className="cat-wrap">
          {VEHICLE_TYPES.map((t) => (
            <button key={t} className={`cat-chip ${d.vehicleType === t ? 'cat-chip--on' : ''}`} onClick={() => set({ vehicleType: t })}>
              {t}
            </button>
          ))}
        </div>
        <Txt label="Make" k="vehicleMake" ph="e.g. Toyota" />
        <Txt label="Model" k="vehicleModel" ph="e.g. Hi-Ace" />
        <Txt label="Year" k="vehicleYear" mode="numeric" />
        <Txt label="Registration / number plate" k="vehicleReg" />

        <p className="group-label">Documents</p>
        <Doc label="SA ID document" k="docId" />
        <Doc label="Driver's licence" k="docLicence" />
        <Doc label="Vehicle licence disc" k="docDisc" />
        <Doc label="Insurance certificate (optional)" k="docInsurance" />

        <p className="group-label">Payout bank account</p>
        <Txt label="Account holder" k="bankHolder" />
        <Txt label="Bank" k="bankName" ph="e.g. Capitec" />
        <Txt label="Account number" k="bankAccount" mode="numeric" />
      </div>

      <div className="sticky-cta">
        <p className="secure-note">Your documents are used only to verify you, in line with POPIA.</p>
        <button className="primary-btn" disabled={!ready} onClick={() => onSubmit({ ...d, status: 'pending' })}>
          {ready ? (editing ? 'Save application' : 'Submit application') : 'Complete all required fields'}
        </button>
      </div>
    </div>
  )
}
