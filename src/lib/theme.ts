export type ThemePref = 'system' | 'light' | 'dark'

const KEY = 'hamba.theme.v1'
const BAR = { light: '#f3f1ec', dark: '#101013' }

export function getThemePref(): ThemePref {
  try {
    const v = localStorage.getItem(KEY)
    if (v === 'light' || v === 'dark' || v === 'system') return v
  } catch { /* ignore */ }
  return 'system'
}

function resolve(pref: ThemePref): 'light' | 'dark' {
  if (pref !== 'system') return pref
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function applyTheme(): void {
  const mode = resolve(getThemePref())
  document.documentElement.dataset.theme = mode
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', BAR[mode])
}

export function setThemePref(pref: ThemePref): void {
  try { localStorage.setItem(KEY, pref) } catch { /* ignore */ }
  applyTheme()
}

/** Call once at startup: applies the saved theme and follows OS changes. */
export function initTheme(): void {
  applyTheme()
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (getThemePref() === 'system') applyTheme()
  })
}
