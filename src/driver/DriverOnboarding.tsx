import { useState, type ChangeEvent } from 'react'
import type { Driver } from '../lib/types'
import Icon from '../components/Icon'

interface Props {
  initial: Driver
  editing?: boolean
  onSubmit: (d: Driver) => void
  onExit: () => void
}

const ID_TYPES = ['ID', 'Passport']
const LICENCE_CODES = ['B', 'EB', 'C1', 'C', 'EC']
const VEHICLE_TYPES = ['Bakkie', '1-ton', '1.5-ton truck', '4-ton truck', 'Panel van']

export default function DriverOnboarding({ initial, editing, onSubmit, onExit }: Props) {
  const [d, setD] = useState<Driver>(initial)
  const set = (p: Partial<Driver>) => setD((prev) => ({ ...prev, ...p }))
  const file = (key: keyof Driver) => (e: ChangeEvent<HTMLInputElement>) =>
    set({ [key]: e.target.files?.[0]?.name ?? '' } as Partial<Driver>)

  const ready =
    !!d.name && !!d.phone && !!d.idNumber && !!d.docId && !!d.docSelfie && !!d.docAddress &&
    !!d.licenceNumber && !!d.licenceCode && d.criminalConsent && d.drivingConsent &&
    !!d.vehicleType && !!d.vehicleMake && !!d.vehicleReg && !!d.loadCapacity &&
    !!d.docRegistration && !!d.docDisc && !!d.docRoadworthy && !!d.docInsurance &&
    !!d.docTruckPhoto && !!d.refName && !!d.refPhone && d.trainingAck &&
    !!d.bankHolder && !!d.bankName && !!d.bankAccount

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
        <div className={`docstate ${d[p.k] ? 'docstate--on' : ''}`}>{(d[p.k] as string) || 'No file selected'}</div>
      </div>
      <label className="doc-btn">
        {d[p.k] ? 'Replace' : 'Upload'}
        <input type="file" accept="image/*,.pdf" hidden onChange={file(p.k)} />
      </label>
    </div>
  )

  const Check = (p: { label: string; sub?: string; k: keyof Driver }) => (
    <button className="glass check-row" onClick={() => set({ [p.k]: !d[p.k] } as Partial<Driver>)} aria-pressed={!!d[p.k]}>
      <div className="online-text">
        <strong>{p.label}</strong>
        {p.sub && <span>{p.sub}</span>}
      </div>
      <span className={`switch ${d[p.k] ? 'switch--on' : ''}`} aria-hidden />
    </button>
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
        <p className="group-label">Identity</p>
        <div className="cat-wrap">
          {ID_TYPES.map((t) => (
            <button key={t} className={`cat-chip ${d.idType === t ? 'cat-chip--on' : ''}`} onClick={() => set({ idType: t })}>{t}</button>
          ))}
        </div>
        <Txt label={`${d.idType} number`} k="idNumber" mode="numeric" />
        <Doc label={`${d.idType} document`} k="docId" />
        <Doc label="Selfie (for identity check)" k="docSelfie" />
        <Doc label="Proof of address (utility bill / bank statement)" k="docAddress" />

        <p className="group-label">Driver's licence</p>
        <Txt label="Licence number" k="licenceNumber" />
        <div className="cat-wrap">
          {LICENCE_CODES.map((c) => (
            <button key={c} className={`cat-chip ${d.licenceCode === c ? 'cat-chip--on' : ''}`} onClick={() => set({ licenceCode: c })}>Code {c}</button>
          ))}
        </div>
        <label className="glass field-group">
          <span className="field-label">Licence expiry</span>
          <input className="field-input" type="date" value={d.licenceExpiry} onChange={(e) => set({ licenceExpiry: e.target.value })} />
        </label>
        <Check label="I have a Professional Driving Permit (PrDP)" sub="Required to carry goods for reward" k="hasPrdp" />
        {d.hasPrdp && <Doc label="PrDP document" k="docPrdp" />}

        <p className="group-label">Checks &amp; consent</p>
        <Check label="Criminal background check" sub="I consent to a criminal record check (MIE/AFISwitch)" k="criminalConsent" />
        <Check label="Driving record" sub="I consent to a check of my traffic & accident history" k="drivingConsent" />

        <p className="group-label">Your vehicle</p>
        <div className="cat-wrap">
          {VEHICLE_TYPES.map((t) => (
            <button key={t} className={`cat-chip ${d.vehicleType === t ? 'cat-chip--on' : ''}`} onClick={() => set({ vehicleType: t })}>{t}</button>
          ))}
        </div>
        <Txt label="Make" k="vehicleMake" ph="e.g. Toyota" />
        <Txt label="Model" k="vehicleModel" ph="e.g. Hi-Ace" />
        <Txt label="Year" k="vehicleYear" mode="numeric" />
        <Txt label="Registration / number plate" k="vehicleReg" />
        <Txt label="Load capacity" k="loadCapacity" ph="e.g. 1 ton / 8 m³" />
        <Txt label="Load dimensions (optional)" k="vehicleDims" ph="L × W × H" />
        <div className="glass field-group helpers-row">
          <div>
            <div className="field-label">Assistants available</div>
            <div className="helpers-sub">Extra hands you can bring</div>
          </div>
          <div className="stepper" role="group" aria-label="Assistants">
            <button onClick={() => set({ assistants: Math.max(0, d.assistants - 1) })} disabled={d.assistants === 0}>−</button>
            <span>{d.assistants}</span>
            <button onClick={() => set({ assistants: Math.min(3, d.assistants + 1) })} disabled={d.assistants === 3}>+</button>
          </div>
        </div>

        <p className="group-label">Vehicle documents</p>
        <Doc label="Vehicle registration papers" k="docRegistration" />
        <Doc label="Vehicle licence disc" k="docDisc" />
        <Doc label="Roadworthy certificate" k="docRoadworthy" />
        <Doc label="Insurance certificate" k="docInsurance" />
        <Check label="Cover includes commercial / business use" k="commercialCover" />

        <p className="group-label">Vehicle photos</p>
        <Doc label="Photo of your truck/bakkie" k="docTruckPhoto" />
        <Doc label="Photo of loading equipment (optional)" k="docEquipment" />

        <p className="group-label">Reference</p>
        <Txt label="Reference name" k="refName" ph="Previous employer or client" />
        <Txt label="Reference contact number" k="refPhone" type="tel" mode="tel" />

        <p className="group-label">Training</p>
        <Check label="Safe handling & customer service" sub="I agree to complete Hamba's short driver training" k="trainingAck" />

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
