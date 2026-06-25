/**
 * Shown on the confirmation screen while a real driver is being matched.
 * Deliberately carries no fake identity, rating or verification claim — those
 * appear only once a vetted driver is actually assigned by the backend.
 */
export default function DriverCard() {
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
