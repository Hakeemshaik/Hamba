import { formatZar } from '../lib/quote'
import Illustration from '../components/Illustration'
import Icon from '../components/Icon'

interface Props {
  onNew: () => void
}

const SAMPLE = [
  { icon: 'boxes', service: 'Local Removal', when: 'Today · 14:00', route: 'Bryanston → Fourways', price: 2200, state: 'active' },
  { icon: 'rubble', service: 'Rubble Removal', when: '12 Jun · 09:30', route: 'Sandton', price: 1480, state: 'done' },
  { icon: 'truck', service: 'Long Distance', when: '28 May · 07:00', route: 'JHB → Pretoria', price: 3950, state: 'done' },
]

export default function Activity({ onNew }: Props) {
  return (
    <div className="screen screen--tabbed">
      <div className="app-bar">
        <span className="wordmark">Your trips</span>
      </div>

      <div className="trip-list">
        {SAMPLE.map((b, i) => (
          <div key={i} className="glass trip-card" style={{ animationDelay: `${i * 60}ms` }}>
            <span className="trip-art" aria-hidden><Illustration name={b.icon} /></span>
            <div className="trip-body">
              <div className="trip-top">
                <span className="trip-service">{b.service}</span>
                <span className={`trip-status trip-status--${b.state}`}>
                  {b.state === 'active' ? 'In progress' : 'Completed'}
                </span>
              </div>
              <div className="trip-route">{b.route}</div>
              <div className="trip-meta">
                <span>{b.when}</span>
                <span className="trip-price">{formatZar(b.price)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="glass new-trip" onClick={onNew}>
        <Icon name="plus" /> Book a new move
      </button>
    </div>
  )
}
