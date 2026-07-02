import { useState } from 'react'
import { loadNotifications, clearNotifications } from '../lib/storage'
import Icon from '../components/Icon'

interface Props {
  onBack: () => void
}

function when(at: number): string {
  const mins = Math.round((Date.now() - at) / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs} h ago`
  return new Date(at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })
}

export default function Notifications({ onBack }: Props) {
  const [items, setItems] = useState(() => loadNotifications())

  const clear = () => {
    clearNotifications()
    setItems([])
  }

  return (
    <div className="screen screen--push">
      <div className="topbar">
        <button className="ghost-btn" onClick={onBack} aria-label="Back"><Icon name="back" /></button>
        <span className="topbar-title">Notifications</span>
        {items.length > 0 ? (
          <button className="topbar-action" onClick={clear}>Clear</button>
        ) : (
          <span className="ghost-spacer" />
        )}
      </div>

      {items.length === 0 ? (
        <div className="glass trip-empty">
          <span className="trip-empty-art notif-empty-ico" aria-hidden><Icon name="bell" /></span>
          <h3>You're all caught up</h3>
          <p>Booking confirmations and driver updates will appear here.</p>
        </div>
      ) : (
        <div className="notif-list">
          {items.map((n, i) => (
            <div key={n.id} className="glass notif" style={{ animationDelay: `${i * 45}ms` }}>
              <span className="notif-ico"><Icon name="bell" /></span>
              <div className="notif-body">
                <div className="notif-top">
                  <strong>{n.title}</strong>
                  <span className="notif-when">{when(n.at)}</span>
                </div>
                <p>{n.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
