import { loadBookings } from '../lib/storage'
import { formatZar } from '../lib/quote'
import Icon from '../components/Icon'
import type { Driver } from '../lib/types'

interface Props {
  driver: Driver
  online: boolean
  onToggleOnline: () => void
  onJobs: () => void
}

export default function DriverHome({ driver, online, onToggleOnline, onJobs }: Props) {
  const me = driver.name
  const all = loadBookings()
  const active = all.filter((b) => b.status === 'active' && b.driverName === me).length
  const completed = all.filter((b) => b.status === 'completed' && b.driverName === me)
  const earned = completed.reduce((s, b) => s + b.total * 0.85, 0)
  const first = driver.name.split(' ')[0] || 'driver'
  const approved = driver.status === 'approved'

  return (
    <div className="screen screen--tabbed">
      <div className="app-bar">
        <span className="wordmark">Hi {first}</span>
        <span className="app-bar-tag">Driver</span>
      </div>

      {approved ? (
        <button className={`glass online-toggle ${online ? 'online-toggle--on' : ''}`} onClick={onToggleOnline}>
          <span className="online-dot" />
          <div className="online-text">
            <strong>{online ? 'You’re online' : 'You’re offline'}</strong>
            <span>{online ? 'Receiving job requests' : 'Go online to receive jobs'}</span>
          </div>
          <span className={`switch ${online ? 'switch--on' : ''}`} aria-hidden />
        </button>
      ) : (
        <div className="glass status-card">
          <span className="status-ic"><Icon name="clock" /></span>
          <div className="online-text">
            <strong>Application under review</strong>
            <span>We’ll let you know once you’re approved to take jobs.</span>
          </div>
        </div>
      )}

      <div className="stat-grid">
        <div className="glass stat"><span className="stat-num">{active}</span><span className="stat-lbl">Active</span></div>
        <div className="glass stat"><span className="stat-num">{completed.length}</span><span className="stat-lbl">Completed</span></div>
        <div className="glass stat"><span className="stat-num stat-num--money">{formatZar(earned)}</span><span className="stat-lbl">Earned</span></div>
      </div>

      <button className="glass new-trip" onClick={onJobs}><Icon name="list" /> View available jobs</button>
    </div>
  )
}
