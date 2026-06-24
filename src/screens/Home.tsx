import { SERVICES } from '../lib/data'
import type { ServiceId } from '../lib/types'

interface Props {
  onSelect: (id: ServiceId) => void
}

export default function Home({ onSelect }: Props) {
  return (
    <div className="screen">
      <header className="home-hero">
        <p className="eyebrow">Hamba · Moves & Removals</p>
        <h1 className="display">
          Where are we<br />
          moving today?
        </h1>
        <p className="lede">Book a move or a clear-out in under a minute. Pay by tap, card or EFT.</p>
      </header>

      <section className="service-list">
        {SERVICES.map((s, i) => (
          <button
            key={s.id}
            className="glass service-card"
            style={{ animationDelay: `${i * 70}ms`, ['--accent' as string]: s.accent }}
            onClick={() => onSelect(s.id)}
          >
            <span className="service-icon" aria-hidden>{s.icon}</span>
            <span className="service-text">
              <span className="service-name">{s.name}</span>
              <span className="service-tag">{s.tagline}</span>
            </span>
            <span className="service-chev">›</span>
          </button>
        ))}
      </section>

      <section className="trust-row">
        <div className="glass trust-pill">⭐ 4.9 rated</div>
        <div className="glass trust-pill">🛡️ Insured loads</div>
        <div className="glass trust-pill">💳 All banks</div>
      </section>
    </div>
  )
}
