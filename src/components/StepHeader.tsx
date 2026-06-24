import Icon from './Icon'

interface Props {
  step: 1 | 2 | 3
  title: string
  onBack?: () => void
}

const LABELS = ['Details', 'Payment', 'Done']

/**
 * Shared screen header: back button, centered title, and a 3-step progress
 * bar so people always know where they are in the booking flow.
 */
export default function StepHeader({ step, title, onBack }: Props) {
  return (
    <header className="step-header">
      <div className="topbar">
        {onBack ? (
          <button className="ghost-btn" onClick={onBack} aria-label="Back">
            <Icon name="back" />
          </button>
        ) : (
          <span className="ghost-spacer" />
        )}
        <span className="topbar-title">{title}</span>
        <span className="ghost-spacer" />
      </div>

      <div className="progress" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={3}>
        {LABELS.map((label, i) => {
          const n = i + 1
          const state = n < step ? 'done' : n === step ? 'active' : 'todo'
          return (
            <div key={label} className={`progress-step progress-step--${state}`}>
              <span className="progress-dot">{n < step ? <Icon name="check" /> : n}</span>
              <span className="progress-label">{label}</span>
            </div>
          )
        })}
      </div>
    </header>
  )
}
