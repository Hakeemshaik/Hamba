import type { Service, LoadOption } from './types'

export const SERVICES: Service[] = [
  {
    id: 'long-distance',
    name: 'Long Distance Move',
    tagline: 'City to city, door to door',
    icon: '🚚',
    base: 1200,
    perKm: 14,
    accent: '#5b8cff',
  },
  {
    id: 'local-move',
    name: 'Local Removal',
    tagline: 'Moving across town',
    icon: '📦',
    base: 650,
    perKm: 22,
    accent: '#34d399',
  },
  {
    id: 'rubble',
    name: 'Rubble Removal',
    tagline: 'Site clearing & dumping',
    icon: '🪨',
    base: 850,
    perKm: 18,
    accent: '#fbbf24',
  },
]

export const LOAD_OPTIONS: LoadOption[] = [
  { id: 'small', label: 'Small', detail: 'A few boxes / bakkie load', multiplier: 1, icon: '🛻' },
  { id: 'medium', label: 'Medium', detail: '1 bedroom / half truck', multiplier: 1.6, icon: '🚐' },
  { id: 'large', label: 'Large', detail: '2–3 bedroom home', multiplier: 2.4, icon: '🚚' },
  { id: 'xl', label: 'Extra Large', detail: 'Full house / large site', multiplier: 3.4, icon: '🚛' },
]

export const HELPER_RATE = 280 // ZAR per helper

export function serviceById(id: string | null): Service | undefined {
  return SERVICES.find((s) => s.id === id)
}

export function loadById(id: string | null): LoadOption | undefined {
  return LOAD_OPTIONS.find((l) => l.id === id)
}
