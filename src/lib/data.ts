import type { Service, LoadOption } from './types'

export const SERVICES: Service[] = [
  {
    id: 'local-move',
    name: 'Local Removal',
    tagline: 'Moving across town',
    icon: 'boxes',
    category: 'moves',
    base: 850,
    perKm: 20,
    accent: '#eafaf1',
  },
  {
    id: 'long-distance',
    name: 'Long Distance',
    tagline: 'City to city',
    icon: 'truck',
    category: 'moves',
    base: 1500,
    perKm: 12,
    accent: '#e8f0ff',
  },
  {
    id: 'furniture',
    name: 'Furniture',
    tagline: 'Single items & sets',
    icon: 'sofa',
    category: 'delivery',
    base: 350,
    perKm: 16,
    accent: '#f1ecff',
  },
  {
    id: 'appliance',
    name: 'Appliances',
    tagline: 'Fridges, washers, TVs',
    icon: 'appliance',
    category: 'delivery',
    base: 400,
    perKm: 16,
    accent: '#eaf6fb',
  },
  {
    id: 'rubble',
    name: 'Rubble Removal',
    tagline: 'Site & garden clearing',
    icon: 'rubble',
    category: 'clearing',
    base: 900,
    perKm: 16,
    accent: '#fff4e0',
  },
  {
    id: 'office',
    name: 'Office Move',
    tagline: 'Desks, IT & filing',
    icon: 'office',
    category: 'moves',
    base: 1800,
    perKm: 14,
    accent: '#eafaf4',
  },
]

export const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'moves', label: 'Moves' },
  { id: 'delivery', label: 'Delivery' },
  { id: 'clearing', label: 'Clearing' },
]

// Load tiers tuned so a typical local 1-bed move (~medium, ~20km) lands around
// R3,000, a 2–3 bed around R4,500 — in line with SA removal companies.
export const LOAD_OPTIONS: LoadOption[] = [
  { id: 'small', label: 'Small', detail: 'A few boxes / bakkie load', multiplier: 1, icon: 'box' },
  { id: 'medium', label: 'Medium', detail: '1 bedroom / half truck', multiplier: 2.4, icon: 'box' },
  { id: 'large', label: 'Large', detail: '2–3 bedroom home', multiplier: 3.6, icon: 'truck' },
  { id: 'xl', label: 'Extra Large', detail: 'Full house / large site', multiplier: 5, icon: 'truck' },
]

export const HELPER_RATE = 300 // ZAR per helper

export function serviceById(id: string | null): Service | undefined {
  return SERVICES.find((s) => s.id === id)
}

export function loadById(id: string | null): LoadOption | undefined {
  return LOAD_OPTIONS.find((l) => l.id === id)
}

/**
 * Johannesburg-area places used for address autocomplete, with approximate
 * centre coordinates so quotes use real geography (haversine × road factor)
 * instead of a placeholder. Swap for a maps API when street-level accuracy
 * is needed.
 */
export interface Place {
  name: string
  area: string
  lat: number
  lng: number
}

export const PLACES: Place[] = [
  { name: 'Sandton City', area: 'Sandton', lat: -26.107, lng: 28.052 },
  { name: 'Sandton', area: 'Sandton', lat: -26.107, lng: 28.056 },
  { name: 'Bryanston', area: 'Sandton', lat: -26.05, lng: 28.02 },
  { name: 'Morningside', area: 'Sandton', lat: -26.09, lng: 28.06 },
  { name: 'Rivonia', area: 'Sandton', lat: -26.06, lng: 28.06 },
  { name: 'Sandown', area: 'Sandton', lat: -26.1, lng: 28.05 },
  { name: 'Hyde Park', area: 'Sandton', lat: -26.12, lng: 28.03 },
  { name: 'Illovo', area: 'Sandton', lat: -26.13, lng: 28.05 },
  { name: 'Woodmead', area: 'Sandton', lat: -26.05, lng: 28.09 },
  { name: 'Gallo Manor', area: 'Sandton', lat: -26.08, lng: 28.09 },
  { name: 'Fourways', area: 'Fourways', lat: -26.01, lng: 28.01 },
  { name: 'Lonehill', area: 'Fourways', lat: -26.02, lng: 28.03 },
  { name: 'Sunninghill', area: 'Fourways', lat: -26.03, lng: 28.07 },
  { name: 'Paulshof', area: 'Fourways', lat: -26.03, lng: 28.05 },
  { name: 'Douglasdale', area: 'Fourways', lat: -26.02, lng: 28.01 },
  { name: 'Dainfern', area: 'Fourways', lat: -25.99, lng: 27.99 },
  { name: 'Midrand', area: 'Midrand', lat: -25.99, lng: 28.13 },
  { name: 'Kyalami', area: 'Midrand', lat: -25.99, lng: 28.08 },
  { name: 'Waterfall City', area: 'Midrand', lat: -26.02, lng: 28.11 },
  { name: 'Randburg', area: 'Randburg', lat: -26.09, lng: 28.0 },
  { name: 'Ferndale', area: 'Randburg', lat: -26.1, lng: 28.0 },
  { name: 'Cresta', area: 'Randburg', lat: -26.13, lng: 27.97 },
  { name: 'Blairgowrie', area: 'Randburg', lat: -26.11, lng: 28.0 },
  { name: 'Northcliff', area: 'Randburg', lat: -26.14, lng: 27.96 },
  { name: 'Linden', area: 'Randburg', lat: -26.14, lng: 27.98 },
  { name: 'Rosebank', area: 'Rosebank', lat: -26.15, lng: 28.04 },
  { name: 'Parktown', area: 'Rosebank', lat: -26.18, lng: 28.03 },
  { name: 'Parkhurst', area: 'Rosebank', lat: -26.14, lng: 28.02 },
  { name: 'Greenside', area: 'Rosebank', lat: -26.15, lng: 28.01 },
  { name: 'Melville', area: 'Rosebank', lat: -26.17, lng: 28.01 },
  { name: 'Auckland Park', area: 'Rosebank', lat: -26.18, lng: 28.0 },
  { name: 'Craighall', area: 'Rosebank', lat: -26.12, lng: 28.02 },
  { name: 'Dunkeld', area: 'Rosebank', lat: -26.14, lng: 28.03 },
  { name: 'Braamfontein', area: 'Johannesburg CBD', lat: -26.19, lng: 28.03 },
  { name: 'Johannesburg CBD', area: 'Johannesburg CBD', lat: -26.2, lng: 28.04 },
  { name: 'Maboneng', area: 'Johannesburg CBD', lat: -26.2, lng: 28.06 },
  { name: 'Newtown', area: 'Johannesburg CBD', lat: -26.2, lng: 28.03 },
  { name: 'Observatory', area: 'Eastern suburbs', lat: -26.17, lng: 28.08 },
  { name: 'Kensington', area: 'Eastern suburbs', lat: -26.19, lng: 28.11 },
  { name: 'Bedfordview', area: 'Eastern suburbs', lat: -26.18, lng: 28.13 },
  { name: 'Edenvale', area: 'Eastern suburbs', lat: -26.14, lng: 28.15 },
  { name: 'Germiston', area: 'East Rand', lat: -26.22, lng: 28.16 },
  { name: 'Boksburg', area: 'East Rand', lat: -26.21, lng: 28.26 },
  { name: 'Benoni', area: 'East Rand', lat: -26.19, lng: 28.32 },
  { name: 'Kempton Park', area: 'East Rand', lat: -26.1, lng: 28.23 },
  { name: 'Roodepoort', area: 'West Rand', lat: -26.16, lng: 27.87 },
  { name: 'Florida', area: 'West Rand', lat: -26.17, lng: 27.91 },
  { name: 'Honeydew', area: 'West Rand', lat: -26.06, lng: 27.92 },
  { name: 'Ruimsig', area: 'West Rand', lat: -26.06, lng: 27.86 },
  { name: 'Krugersdorp', area: 'West Rand', lat: -26.1, lng: 27.77 },
  { name: 'Soweto', area: 'Soweto', lat: -26.27, lng: 27.86 },
  { name: 'Lenasia', area: 'Southern suburbs', lat: -26.32, lng: 27.83 },
  { name: 'Alberton', area: 'Southern suburbs', lat: -26.27, lng: 28.12 },
  { name: 'Mondeor', area: 'Southern suburbs', lat: -26.28, lng: 28.01 },
  { name: 'Glenvista', area: 'Southern suburbs', lat: -26.3, lng: 28.05 },
  { name: 'Southgate', area: 'Southern suburbs', lat: -26.27, lng: 27.99 },
  { name: 'Pretoria', area: 'Long distance', lat: -25.75, lng: 28.19 },
  { name: 'Centurion', area: 'Long distance', lat: -25.86, lng: 28.19 },
  { name: 'OR Tambo Airport', area: 'East Rand', lat: -26.14, lng: 28.23 },
]

export function placeByName(name: string): Place | undefined {
  const n = name.trim().toLowerCase()
  return PLACES.find((p) => p.name.toLowerCase() === n) ?? PLACES.find((p) => n.includes(p.name.toLowerCase()))
}
