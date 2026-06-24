import { SERVICES } from '../lib/data'
import type { ServiceId } from '../lib/types'
import Icon from '../components/Icon'

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
            style={{ animationDelay: `${i * 70}ms` }}
            onClick={() => onSelect(s.id)}
          >
            <span className="service-icon" aria-hidden>
              <Icon name={s.icon} />
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

      <section className="trust-row">
        <div className="glass trust-pill"><Icon name="star" /> 4.9 rated</div>
        <div className="glass trust-pill"><Icon name="shield" /> Insured loads</div>
        <div className="glass trust-pill"><Icon name="card" /> All banks</div>
      </section>
    </div>
  )
}
