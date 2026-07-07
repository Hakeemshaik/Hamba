import { useState } from 'react'
import { loadBookings, updateBooking, addNotification } from '../lib/storage'
import { formatZar } from '../lib/quote'
import Icon from '../components/Icon'
import Illustration from '../components/Illustration'
import { getDemoJobs, updateDemoJob } from './demo'
import type { Driver } from '../lib/types'

interface Props {
  driver: Driver
  demo?: boolean
}

export default function DriverJobs({ driver, demo }: Props) {
  const me = driver.name
  const [, force] = useState(0)
  const refresh = () => force((n) => n + 1)

  const all = demo ? getDemoJobs() : loadBookings()
  const doUpdate = demo ? updateDemoJob : updateBooking
  const available = all.filter((b) => b.status === 'upcoming')
  const mine = all.filter((b) => b.status === 'active' && b.driverName === me)

  const accept = (id: string) => {
    doUpdate(id, { status: 'active', driverName: me })
    if (!demo) addNotification('Driver assigned', `${me} accepted your booking ${id} and is preparing to head out.`)
    refresh()
  }
  const complete = (id: string) => {
    doUpdate(id, { status: 'completed' })
    refresh()
  }

  return (
    <div className="screen screen--tabbed">
      <div className="app-bar"><span className="wordmark">Jobs</span></div>

      {driver.status !== 'approved' && (
        <div className="glass status-card">
          <span className="status-ic"><Icon name="clock" /></span>
          <div className="online-text">
            <strong>Account under review</strong>
            <span>You’ll be able to accept jobs once your application is approved.</span>
          </div>
        </div>
      )}

      <p className="group-label">Your active jobs</p>
      {mine.length === 0 ? (
        <div className="glass trip-empty"><p>No active jobs right now.</p></div>
      ) : (
        <div className="trip-list">
          {mine.map((b) => (
            <div key={b.id} className="glass trip-card">
              <span className="trip-art" aria-hidden><Illustration name={b.icon} /></span>
              <div className="trip-body">
                <div className="trip-top">
                  <span className="trip-service">{b.serviceName}</span>
                  <span className="trip-price">{formatZar(b.total * 0.85)}</span>
                </div>
                <div className="trip-route">{b.pickup || 'Pickup'} → {b.dropoff || 'Drop-off'}</div>
                <div className="trip-meta"><span>{b.date || 'Date TBC'}{b.time ? ` · ${b.time}` : ''} · {b.id}</span></div>
                <button className="job-btn job-btn--done" onClick={() => complete(b.id)}>Mark completed</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="group-label">Available now</p>
      {available.length === 0 ? (
        <div className="glass trip-empty">
          <span className="trip-empty-art truck-anim truck-anim--idle" aria-hidden><Illustration name="truck" /></span>
          <h3>No jobs available</h3>
          <p>New booking requests in your area will appear here.</p>
        </div>
      ) : (
        <div className="trip-list">
          {available.map((b) => (
            <div key={b.id} className="glass trip-card">
              <span className="trip-art" aria-hidden><Illustration name={b.icon} /></span>
              <div className="trip-body">
                <div className="trip-top">
                  <span className="trip-service">{b.serviceName}</span>
                  <span className="trip-price">{formatZar(b.total * 0.85)}</span>
                </div>
                <div className="trip-route">{b.pickup || 'Pickup'} → {b.dropoff || 'Drop-off'}</div>
                <div className="trip-meta"><span>{b.date || 'Date TBC'}{b.time ? ` · ${b.time}` : ''}</span><span>Fare {formatZar(b.total)}</span></div>
                <button className="job-btn" onClick={() => accept(b.id)}>Accept job</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
