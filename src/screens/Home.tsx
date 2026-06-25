import { useState } from 'react'
import { SERVICES } from '../lib/data'
import type { ServiceId } from '../lib/types'
import Icon from '../components/Icon'
import Illustration from '../components/Illustration'

interface Props {
  onSelect: (id: ServiceId) => void
}

const CITIES = [
  { id: 'jhb', name: 'Johannesburg', live: true },
  { id: 'pta', name: 'Pretoria', live: false },
  { id: 'cpt', name: 'Cape Town', live: false },
]

const FEATURES = [
  { icon: 'bolt', title: 'Instant quotes', sub: 'See your price upfront' },
  { icon: 'pin', title: 'Live tracking', sub: 'Watch your truck arrive' },
  { icon: 'badge', title: 'Vetted drivers', sub: 'ID, licence & insurance' },
  { icon: 'card', title: 'Secure payment', sub: 'All SA banks via Yoco' },
]

export default function Home({ onSelect }: Props) {
  const [city, setCity] = useState('jhb')

  return (
    <div className="screen">
      <div className="app-bar">
        <span className="wordmark">Hamba</span>
        <span className="app-bar-tag">Moves &amp; Removals</span>
      </div>

      <div className="city-row" role="group" aria-label="Service area">
        {CITIES.map((c) => (
          <button
            key={c.id}
            className={`glass city-pill ${city === c.id ? 'city-pill--on' : ''}`}
            onClick={() => c.live && setCity(c.id)}
            disabled={!c.live}
          >
            <Icon name="pin" />
            {c.name}
            {!c.live && <span className="city-soon">soon</span>}
          </button>
        ))}
      </div>

      <header className="home-hero">
        <h1 className="display">
          Where are we<br />
          moving today?
        </h1>
        <p className="lede">Book a move or a clear-out in under a minute. Pay by tap, card or EFT.</p>
      </header>

      <section className="service-list" aria-label="Choose a service">
        <p className="group-label">Choose a service</p>
        {SERVICES.map((s, i) => (
          <button
            key={s.id}
            className="glass service-card"
            style={{ animationDelay: `${i * 70}ms`, ['--tile' as string]: s.accent }}
            onClick={() => onSelect(s.id)}
          >
            <span className="service-icon" aria-hidden>
              <Illustration name={s.icon} />
            </span>
            <span className="service-text">
              <span className="service-name">{s.name}</span>
              <span className="service-tag">{s.tagline}</span>
            </span>
            <span className="service-chev" aria-hidden>
              <Icon name="chevron" />
            </span>
          </button>
        ))}
      </section>

      <section className="feature-grid" aria-label="Why Hamba">
        {FEATURES.map((f) => (
          <div key={f.title} className="glass feature-card">
            <span className="feature-icon" aria-hidden><Icon name={f.icon} /></span>
            <span className="feature-title">{f.title}</span>
            <span className="feature-sub">{f.sub}</span>
          </div>
        ))}
      </section>
    </div>
  )
}
