import { useEffect, useState } from 'react'
import Icon from './Icon'

export type IslandState =
  | { kind: 'idle' }
  | { kind: 'quote'; total: string; service: string }
  | { kind: 'processing'; label: string }
  | { kind: 'success'; label: string }
  | { kind: 'tracking'; eta: string; status: string; progress: number }

interface Props {
  state: IslandState
}

/**
 * A Dynamic Island-style morphing pill that lives under the notch and changes
 * shape/content based on what the app is doing.
 */
export default function DynamicIsland({ state }: Props) {
  // Track expansion so the pill can animate its width/height smoothly.
  const [pulse, setPulse] = useState(false)
  useEffect(() => {
    setPulse(true)
    const t = setTimeout(() => setPulse(false), 420)
    return () => clearTimeout(t)
  }, [state.kind])

  const expanded = state.kind !== 'idle'

  return (
    <div className="island-wrap" aria-live="polite">
      <div
        className={`island ${expanded ? 'island--expanded' : ''} ${pulse ? 'island--pulse' : ''} island--${state.kind}`}
      >
        {state.kind === 'idle' && (
          <div className="island-idle">
            <span className="island-dot" />
          </div>
        )}

        {state.kind === 'quote' && (
          <div className="island-row">
            <div className="island-lead">
              <span className="island-mini-label">{state.service}</span>
              <span className="island-mini-sub">Live estimate</span>
            </div>
            <div className="island-trail island-price">{state.total}</div>
          </div>
        )}

        {state.kind === 'processing' && (
          <div className="island-row">
            <span className="island-spinner" />
            <div className="island-trail island-processing-label">{state.label}</div>
          </div>
        )}

        {state.kind === 'success' && (
          <div className="island-row">
            <span className="island-check"><Icon name="check" /></span>
            <div className="island-trail island-processing-label">{state.label}</div>
          </div>
        )}

        {state.kind === 'tracking' && (
          <div className="island-track">
            <div className="island-row">
              <div className="island-lead">
                <span className="island-truck"><Icon name="truck" /></span>
                <div>
                  <div className="island-mini-label">{state.status}</div>
                  <div className="island-mini-sub">ETA {state.eta}</div>
                </div>
              </div>
            </div>
            <div className="island-progress">
              <div className="island-progress-fill" style={{ width: `${state.progress}%` }} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
