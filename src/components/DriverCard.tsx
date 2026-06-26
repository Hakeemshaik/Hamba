import Icon from './Icon'
import Illustration from './Illustration'
import { whatsappLink } from '../lib/contact'

/**
 * Shows the assigned driver once one accepts the job; otherwise an honest
 * "assigning" state with no invented identity or verification claim.
 */
export default function DriverCard({ name }: { name?: string }) {
  if (!name) {
    return (
      <div className="glass driver-card">
        <div className="driver-head">
          <span className="driver-avatar driver-avatar--pending" aria-hidden>
            <span className="driver-spinner" />
          </span>
          <div className="driver-info">
            <div className="driver-name">Assigning your driver…</div>
            <div className="driver-meta">We’re matching you with a nearby Hamba driver.</div>
          </div>
        </div>
        <p className="driver-note">
          Their name, vehicle and rating will appear here once they accept. Every Hamba driver signs an
          agreement and is reviewed before joining.
        </p>
      </div>
    )
  }

  return (
    <div className="glass driver-card">
      <div className="driver-head">
        <span className="driver-avatar" aria-hidden><Illustration name="driver" /></span>
        <div className="driver-info">
          <div className="driver-name">{name}</div>
          <div className="driver-meta">Your Hamba driver · on the way</div>
        </div>
      </div>
      <a className="action-btn action-btn--primary" href={whatsappLink} target="_blank" rel="noopener">
        <Icon name="message" /> Message driver
      </a>
    </div>
  )
}
