import Illustration from '../components/Illustration'
import Icon from '../components/Icon'

interface Props {
  onNew: () => void
}

export default function Activity({ onNew }: Props) {
  return (
    <div className="screen screen--tabbed">
      <div className="app-bar">
        <span className="wordmark">Your trips</span>
      </div>

      <div className="glass trip-empty">
        <span className="trip-empty-art" aria-hidden><Illustration name="truck" /></span>
        <h3>No trips yet</h3>
        <p>Your bookings and their status will show up here once you make your first one.</p>
      </div>

      <button className="glass new-trip" onClick={onNew}>
        <Icon name="plus" /> Book a move
      </button>
    </div>
  )
}
