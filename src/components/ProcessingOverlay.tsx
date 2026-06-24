interface Props {
  label: string | null
}

/**
 * Full-screen frosted overlay shown while a payment is being processed.
 * Replaces the old Dynamic Island status pill.
 */
export default function ProcessingOverlay({ label }: Props) {
  if (!label) return null
  return (
    <div className="overlay" role="status" aria-live="assertive">
      <div className="glass overlay-card">
        <span className="overlay-spinner" />
        <p className="overlay-label">{label}</p>
      </div>
    </div>
  )
}
