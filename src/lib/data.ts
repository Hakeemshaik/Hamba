import type { Service, LoadOption } from './types'

export const SERVICES: Service[] = [
  {
    id: 'local-move',
    name: 'Local Removal',
    tagline: 'Moving across town',
    icon: 'boxes',
    category: 'moves',
    base: 650,
    perKm: 22,
    accent: '#eafaf1',
  },
  {
    id: 'long-distance',
    name: 'Long Distance',
    tagline: 'City to city',
    icon: 'truck',
    category: 'moves',
    base: 1200,
    perKm: 14,
    accent: '#e8f0ff',
  },
  {
    id: 'furniture',
    name: 'Furniture',
    tagline: 'Single items & sets',
    icon: 'sofa',
    category: 'delivery',
    base: 480,
    perKm: 20,
    accent: '#f1ecff',
  },
  {
    id: 'appliance',
    name: 'Appliances',
    tagline: 'Fridges, washers, TVs',
    icon: 'appliance',
    category: 'delivery',
    base: 520,
    perKm: 20,
    accent: '#eaf6fb',
  },
  {
    id: 'rubble',
    name: 'Rubble Removal',
    tagline: 'Site & garden clearing',
    icon: 'rubble',
    category: 'clearing',
    base: 850,
    perKm: 18,
    accent: '#fff4e0',
  },
  {
    id: 'office',
    name: 'Office Move',
    tagline: 'Desks, IT & filing',
    icon: 'office',
    category: 'moves',
    base: 1400,
    perKm: 16,
    accent: '#eafaf4',
  },
]

export const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'moves', label: 'Moves' },
  { id: 'delivery', label: 'Delivery' },
  { id: 'clearing', label: 'Clearing' },
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
