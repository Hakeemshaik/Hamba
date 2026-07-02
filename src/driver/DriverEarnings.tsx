import { loadBookings } from '../lib/storage'
import { formatZar } from '../lib/quote'
import Illustration from '../components/Illustration'
import { getDemoJobs } from './demo'
import type { Driver } from '../lib/types'

interface Props {
  driver: Driver
  demo?: boolean
}

export default function DriverEarnings({ driver, demo }: Props) {
  const me = driver.name
  const all = demo ? getDemoJobs() : loadBookings()
  const done = all.filter((b) => b.status === 'completed' && b.driverName === me)
  const total = done.reduce((s, b) => s + b.total * 0.85, 0)

  return (
    <div className="screen screen--tabbed">
      <div className="app-bar"><span className="wordmark">Earnings</span></div>

      <div className="glass earn-total">
        <span className="earn-total-lbl">Total earned</span>
        <span className="earn-total-num">{formatZar(total)}</span>
        <span className="earn-total-sub">{done.length} completed {done.length === 1 ? 'job' : 'jobs'} · after 15% platform fee</span>
      </div>

      {done.length === 0 ? (
        <div className="glass trip-empty">
          <span className="trip-empty-art" aria-hidden><Illustration name="boxes" /></span>
          <h3>No earnings yet</h3>
          <p>Completed jobs and your payouts will be listed here.</p>
        </div>
      ) : (
        <div className="trip-list">
          {done.map((b) => (
            <div key={b.id} className="glass trip-card">
              <span className="trip-art" aria-hidden><Illustration name={b.icon} /></span>
              <div className="trip-body">
                <div className="trip-top">
                  <span className="trip-service">{b.serviceName}</span>
                  <span className="trip-price">{formatZar(b.total * 0.85)}</span>
                </div>
                <div className="trip-route">{b.pickup || 'Pickup'} → {b.dropoff || 'Drop-off'}</div>
                <div className="trip-meta"><span>{b.date || ''} · {b.id}</span><span>Fare {formatZar(b.total)}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
