import { useState } from 'react'
import { PLACES } from '../lib/data'
import Icon from './Icon'

interface Props {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  marker: 'a' | 'b'
  recents: string[]
}

interface Suggestion {
  name: string
  area: string
  recent?: boolean
}

export default function AddressInput({ label, value, onChange, placeholder, marker, recents }: Props) {
  const [open, setOpen] = useState(false)
  const q = value.trim().toLowerCase()

  let list: Suggestion[]
  if (q) {
    // Matches as you type — name first, then anything containing the query.
    const starts = PLACES.filter((p) => p.name.toLowerCase().startsWith(q))
    const contains = PLACES.filter(
      (p) => !p.name.toLowerCase().startsWith(q) && p.name.toLowerCase().includes(q),
    )
    list = [...starts, ...contains].slice(0, 6)
  } else {
    list = recents.slice(0, 5).map((r) => ({ name: r, area: 'Saved address', recent: true }))
  }

  const choose = (name: string) => {
    onChange(name)
    setOpen(false)
  }

  return (
    <div className="addr">
      <div className="glass field-group">
        <label className="field field--icon">
          <span className={`field-marker field-marker--${marker}`} aria-hidden>
            <Icon name="pin" />
          </span>
          <span className="field-body">
            <span className="field-label">{label}</span>
            <input
              className="field-input"
              placeholder={placeholder}
              autoComplete="off"
              value={value}
              onChange={(e) => {
                onChange(e.target.value)
                setOpen(true)
              }}
              onFocus={() => setOpen(true)}
              onBlur={() => window.setTimeout(() => setOpen(false), 130)}
            />
          </span>
        </label>
      </div>

      {open && list.length > 0 && (
        <div className="glass addr-suggest">
          {!q && <div className="addr-suggest-head">Saved &amp; recent</div>}
          {list.map((s) => (
            <button
              key={s.name}
              type="button"
              className="addr-opt"
              onMouseDown={(e) => {
                e.preventDefault()
                choose(s.name)
              }}
            >
              <span className="addr-opt-ico"><Icon name={s.recent ? 'clock' : 'pin'} /></span>
              <span className="addr-opt-text">
                <span className="addr-opt-name">{s.name}</span>
                <span className="addr-opt-area">{s.area}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
