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
        Moving? <span className="headline-accent">Book&nbsp;&amp;&nbsp;go.</span>
      </h1>

      <button className="search-field glass" onClick={() => onSelect(SERVICES[0].id)}>
        <Icon name="search" />
        <span>Where are you moving?</span>
      </button>

      <div className="cat-row" role="tablist" aria-label="Service categories">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            role="tab"
            aria-selected={cat === c.id}
            className={`cat-chip ${cat === c.id ? 'cat-chip--on' : ''}`}
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
              <span className="svc-tag2">{s.tagline}</span>
              <span className="svc-foot">
                <span className="svc-from">from {formatZar(s.base)}</span>
                <span className="svc-add" aria-hidden><Icon name="arrow" /></span>
              </span>
            </span>
          </button>
        ))}
      </div>

      <div className="glass referral">
        <div className="referral-text">
          <strong>Invite friends, get R50</strong>
          <span>You both save R50 on your next move.</span>
        </div>
        <span className="referral-code">HAMBA50</span>
      </div>
    </div>
  )
}
