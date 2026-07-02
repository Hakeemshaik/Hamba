import { useState } from 'react'
import { SERVICES, CATEGORIES } from '../lib/data'
import { formatZar } from '../lib/quote'
import type { ServiceId } from '../lib/types'
import Icon from '../components/Icon'
import Illustration from '../components/Illustration'

interface Props {
  name: string
  onSelect: (id: ServiceId) => void
  onProfile: () => void
}

export default function Home({ name, onSelect, onProfile }: Props) {
  const [cat, setCat] = useState('all')
  const firstName = name.trim().split(' ')[0] || 'there'
  const shown = SERVICES.filter((s) => cat === 'all' || s.category === cat)

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
