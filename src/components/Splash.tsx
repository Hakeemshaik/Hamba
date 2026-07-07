import { useEffect, useState } from 'react'
import { LogoMark } from './Logo'
import Illustration from './Illustration'

/**
 * Opening splash: the logo drops in with a bounce, the wordmark rises,
 * then the whole layer fades away to reveal the app.
 */
export default function Splash({ onDone }: { onDone: () => void }) {
  const [hiding, setHiding] = useState(false)

  useEffect(() => {
    const hide = window.setTimeout(() => setHiding(true), 1450)
    const done = window.setTimeout(onDone, 1900)
    return () => {
      window.clearTimeout(hide)
      window.clearTimeout(done)
    }
  }, [onDone])

  return (
    <div className={`splash ${hiding ? 'splash--hide' : ''}`} aria-hidden>
      <div className="splash-logo">
        <LogoMark size={96} />
      </div>
      <span className="splash-word">Hamba</span>
      <span className="splash-tag">Moves &amp; Removals</span>

      <div className="splash-road">
        <span className="splash-truck truck-anim">
          <Illustration name="truck" />
        </span>
      </div>
    </div>
  )
}
