import { SERVICES } from '../lib/data'
import type { ServiceId } from '../lib/types'
import Icon from '../components/Icon'
import Illustration from '../components/Illustration'

interface Props {
  onSelect: (id: ServiceId) => void
}

export default function Home({ onSelect }: Props) {
  return (
    <div className="screen">
      <div className="app-bar">
        <span className="wordmark">Hamba</span>
        <span className="app-bar-tag">Moves &amp; Removals</span>
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

      <section className="trust-row" aria-label="Why Hamba">
        <div className="glass trust-pill"><Icon name="star" /> 4.9 rated</div>
        <div className="glass trust-pill"><Icon name="shield" /> Insured loads</div>
        <div className="glass trust-pill"><Icon name="card" /> All banks</div>
      </section>
    </div>
  )
}
