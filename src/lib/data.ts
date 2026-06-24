import type { Service, LoadOption } from './types'

export const SERVICES: Service[] = [
  {
    id: 'long-distance',
    name: 'Long Distance Move',
    tagline: 'City to city, door to door',
    icon: 'truck',
    base: 1200,
    perKm: 14,
    accent: '#e8f0ff',
  },
  {
    id: 'local-move',
    name: 'Local Removal',
    tagline: 'Moving across town',
    icon: 'boxes',
    base: 650,
    perKm: 22,
    accent: '#eafaf1',
  },
  {
    id: 'rubble',
    name: 'Rubble Removal',
    tagline: 'Site clearing & dumping',
    icon: 'rubble',
    base: 850,
    perKm: 18,
    accent: '#fff4e0',
  },
]

export const LOAD_OPTIONS: LoadOption[] = [
  { id: 'small', label: 'Small', detail: 'A few boxes / bakkie load', multiplier: 1, icon: 'box' },
  { id: 'medium', label: 'Medium', detail: '1 bedroom / half truck', multiplier: 1.6, icon: 'box' },
  { id: 'large', label: 'Large', detail: '2–3 bedroom home', multiplier: 2.4, icon: 'truck' },
  { id: 'xl', label: 'Extra Large', detail: 'Full house / large site', multiplier: 3.4, icon: 'truck' },
]

export const HELPER_RATE = 280 // ZAR per helper

export function serviceById(id: string | null): Service | undefined {
  return SERVICES.find((s) => s.id === id)
}

export function loadById(id: string | null): LoadOption | undefined {
  return LOAD_OPTIONS.find((l) => l.id === id)
}
