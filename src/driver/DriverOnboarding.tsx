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

type Set = (p: Partial<Driver>) => void

// Field components live at module scope so their identity is stable across
// renders — defining them inside the screen made React remount the input on
// every keystroke, dropping focus after each character.
function Txt(p: { d: Driver; set: Set; label: string; k: keyof Driver; type?: string; mode?: 'tel' | 'email' | 'numeric'; ph?: string }) {
  return (
    <label className="glass field-group">
      <span className="field-label">{p.label}</span>
      <input
        className="field-input"
        type={p.type ?? 'text'}
        inputMode={p.mode}
        placeholder={p.ph}
        value={p.d[p.k] as string}
        onChange={(e) => p.set({ [p.k]: e.target.value } as Partial<Driver>)}
      />
    </label>
  )
}

function Doc(p: { d: Driver; set: Set; label: string; k: keyof Driver }) {
  const onFile = (e: ChangeEvent<HTMLInputElement>) =>
    p.set({ [p.k]: e.target.files?.[0]?.name ?? '' } as Partial<Driver>)
  return (
    <div className="glass field-group docrow">
      <div className="docrow-text">
        <div className="field-label">{p.label}</div>
        <div className={`docstate ${p.d[p.k] ? 'docstate--on' : ''}`}>{(p.d[p.k] as string) || 'No file selected'}</div>
      </div>
      <label className="doc-btn">
        {p.d[p.k] ? 'Replace' : 'Upload'}
        <input type="file" accept="image/*,.pdf" hidden onChange={onFile} />
      </label>
    </div>
  )
}

function Check(p: { d: Driver; set: Set; label: string; sub?: string; k: keyof Driver }) {
  return (
    <button className="glass check-row" onClick={() => p.set({ [p.k]: !p.d[p.k] } as Partial<Driver>)} aria-pressed={!!p.d[p.k]}>
      <div className="online-text">
        <strong>{p.label}</strong>
        {p.sub && <span>{p.sub}</span>}
      </div>
      <span className={`switch ${p.d[p.k] ? 'switch--on' : ''}`} aria-hidden />
    </button>
  )
}

export default function DriverOnboarding({ initial, editing, onSubmit, onExit }: Props) {
  const [d, setD] = useState<Driver>(initial)
  const set: Set = (p) => setD((prev) => ({ ...prev, ...p }))

  const ready =
    !!d.name && !!d.phone && !!d.idNumber && !!d.docId && !!d.docSelfie && !!d.docAddress &&
    !!d.licenceNumber && !!d.licenceCode && d.criminalConsent && d.drivingConsent &&
    !!d.vehicleType && !!d.vehicleMake && !!d.vehicleReg && !!d.loadCapacity &&
    !!d.docRegistration && !!d.docDisc && !!d.docRoadworthy && !!d.docInsurance &&
    !!d.docTruckPhoto && !!d.refName && !!d.refPhone && d.trainingAck &&
    !!d.bankHolder && !!d.bankName && !!d.bankAccount

  return (
    <div className="screen screen--push">
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
        <Txt d={d} set={set} label={`${d.idType} number`} k="idNumber" mode="numeric" />
        <Doc d={d} set={set} label={`${d.idType} document`} k="docId" />
        <Doc d={d} set={set} label="Selfie (for identity check)" k="docSelfie" />
        <Doc d={d} set={set} label="Proof of address (utility bill / bank statement)" k="docAddress" />

        <p className="group-label">Driver's licence</p>
        <Txt d={d} set={set} label="Licence number" k="licenceNumber" />
        <div className="cat-wrap">
          {LICENCE_CODES.map((c) => (
            <button key={c} className={`cat-chip ${d.licenceCode === c ? 'cat-chip--on' : ''}`} onClick={() => set({ licenceCode: c })}>Code {c}</button>
          ))}
        </div>
        <label className="glass field-group">
          <span className="field-label">Licence expiry</span>
          <input className="field-input" type="date" value={d.licenceExpiry} onChange={(e) => set({ licenceExpiry: e.target.value })} />
        </label>
        <Check d={d} set={set} label="I have a Professional Driving Permit (PrDP)" sub="Required to carry goods for reward" k="hasPrdp" />
        {d.hasPrdp && <Doc d={d} set={set} label="PrDP document" k="docPrdp" />}

        <p className="group-label">Checks &amp; consent</p>
        <Check d={d} set={set} label="Criminal background check" sub="I consent to a criminal record check (MIE/AFISwitch)" k="criminalConsent" />
        <Check d={d} set={set} label="Driving record" sub="I consent to a check of my traffic & accident history" k="drivingConsent" />

        <p className="group-label">Your vehicle</p>
        <div className="cat-wrap">
          {VEHICLE_TYPES.map((t) => (
            <button key={t} className={`cat-chip ${d.vehicleType === t ? 'cat-chip--on' : ''}`} onClick={() => set({ vehicleType: t })}>{t}</button>
          ))}
        </div>
        <Txt d={d} set={set} label="Make" k="vehicleMake" ph="e.g. Toyota" />
        <Txt d={d} set={set} label="Model" k="vehicleModel" ph="e.g. Hi-Ace" />
        <Txt d={d} set={set} label="Year" k="vehicleYear" mode="numeric" />
        <Txt d={d} set={set} label="Registration / number plate" k="vehicleReg" />
        <Txt d={d} set={set} label="Load capacity" k="loadCapacity" ph="e.g. 1 ton / 8 m³" />
        <Txt d={d} set={set} label="Load dimensions (optional)" k="vehicleDims" ph="L × W × H" />
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
        <Doc d={d} set={set} label="Vehicle registration papers" k="docRegistration" />
        <Doc d={d} set={set} label="Vehicle licence disc" k="docDisc" />
        <Doc d={d} set={set} label="Roadworthy certificate" k="docRoadworthy" />
        <Doc d={d} set={set} label="Insurance certificate" k="docInsurance" />
        <Check d={d} set={set} label="Cover includes commercial / business use" k="commercialCover" />

        <p className="group-label">Vehicle photos</p>
        <Doc d={d} set={set} label="Photo of your truck/bakkie" k="docTruckPhoto" />
        <Doc d={d} set={set} label="Photo of loading equipment (optional)" k="docEquipment" />

        <p className="group-label">Reference</p>
        <Txt d={d} set={set} label="Reference name" k="refName" ph="Previous employer or client" />
        <Txt d={d} set={set} label="Reference contact number" k="refPhone" type="tel" mode="tel" />

        <p className="group-label">Training</p>
        <Check d={d} set={set} label="Safe handling & customer service" sub="I agree to complete Hamba's short driver training" k="trainingAck" />

        <p className="group-label">Payout bank account</p>
        <Txt d={d} set={set} label="Account holder" k="bankHolder" />
        <Txt d={d} set={set} label="Bank" k="bankName" ph="e.g. Capitec" />
        <Txt d={d} set={set} label="Account number" k="bankAccount" mode="numeric" />
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
