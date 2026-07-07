import { useState } from 'react'
import { SERVICES, CATEGORIES } from '../lib/data'
import { formatZar } from '../lib/quote'
import { loadBookings } from '../lib/storage'
import type { ServiceId } from '../lib/types'
import Icon from '../components/Icon'
import Illustration from '../components/Illustration'

interface Props {
  name: string
  onSelect: (id: ServiceId) => void
  onWhereTo: () => void
  onRoute: (pickup: string, dropoff: string) => void
  onProfile: () => void
}

export default function Home({ name, onSelect, onWhereTo, onRoute, onProfile }: Props) {
  const [cat, setCat] = useState('all')
  const firstName = name.trim().split(' ')[0] || 'there'
  const shown = SERVICES.filter((s) => cat === 'all' || s.category === cat)

  // Last two distinct routes, Uber-style one-tap recents.
  const recents: { pickup: string; dropoff: string }[] = []
  for (const b of loadBookings()) {
    if (!b.pickup || !b.dropoff) continue
    if (recents.some((r) => r.pickup === b.pickup && r.dropoff === b.dropoff)) continue
    recents.push({ pickup: b.pickup, dropoff: b.dropoff })
    if (recents.length === 2) break
  }

  return (
    <div className="screen screen--tabbed">
      <div className="home-top">
        <div>
          <p className="home-greet">Hi {firstName}</p>
          <p className="home-loc"><Icon name="pin" /> Johannesburg</p>
        </div>
        <button className="home-avatar" onClick={onProfile} aria-label="Your profile">
          <Illustration name="avatar" />
        </button>
      </div>

      <h1 className="headline">
        Get anything <span className="headline-accent">moved.</span>
      </h1>

      <button className="glass whereto" onClick={onWhereTo}>
        <span className="whereto-dot" aria-hidden />
        <span className="whereto-text">Where to?</span>
        <span className="whereto-go" aria-hidden><Icon name="arrow" /></span>
      </button>

      {recents.length > 0 && (
        <div className="recents-row">
          {recents.map((r) => (
            <button key={r.pickup + r.dropoff} className="recent-chip" onClick={() => onRoute(r.pickup, r.dropoff)}>
              <Icon name="clock" />
              {r.pickup} → {r.dropoff}
            </button>
          ))}
        </div>
      )}

      <div className="cat-row" role="tablist" aria-label="Service categories">
        {CATEGORIES.map((c, i) => (
          <button
            key={c.id}
            role="tab"
            aria-selected={cat === c.id}
            className={`cat-chip ${cat === c.id ? 'cat-chip--on' : ''}`}
            style={{ animationDelay: `${80 + i * 50}ms` }}
            onClick={() => setCat(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="svc-grid">
        {shown.map((s, i) => (
          <button
            key={s.id}
            className="glass svc-tile"
            style={{ animationDelay: `${i * 60}ms`, ['--tile' as string]: s.accent }}
            onClick={() => onSelect(s.id)}
          >
            <span className="svc-art" aria-hidden>
              <Illustration name={s.icon} />
            </span>
            <span className="svc-body">
              <span className="svc-name2">{s.name}</span>
              <span className="svc-from">from {formatZar(s.base)}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
