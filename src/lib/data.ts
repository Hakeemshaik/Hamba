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

/** Johannesburg-area places used for address autocomplete (offline list). */
export interface Place {
  name: string
  area: string
}

export const PLACES: Place[] = [
  { name: 'Sandton City', area: 'Sandton' },
  { name: 'Sandton', area: 'Sandton' },
  { name: 'Bryanston', area: 'Sandton' },
  { name: 'Morningside', area: 'Sandton' },
  { name: 'Rivonia', area: 'Sandton' },
  { name: 'Sandown', area: 'Sandton' },
  { name: 'Hyde Park', area: 'Sandton' },
  { name: 'Illovo', area: 'Sandton' },
  { name: 'Woodmead', area: 'Sandton' },
  { name: 'Gallo Manor', area: 'Sandton' },
  { name: 'Fourways', area: 'Fourways' },
  { name: 'Lonehill', area: 'Fourways' },
  { name: 'Sunninghill', area: 'Fourways' },
  { name: 'Paulshof', area: 'Fourways' },
  { name: 'Douglasdale', area: 'Fourways' },
  { name: 'Dainfern', area: 'Fourways' },
  { name: 'Midrand', area: 'Midrand' },
  { name: 'Kyalami', area: 'Midrand' },
  { name: 'Waterfall City', area: 'Midrand' },
  { name: 'Randburg', area: 'Randburg' },
  { name: 'Ferndale', area: 'Randburg' },
  { name: 'Cresta', area: 'Randburg' },
  { name: 'Blairgowrie', area: 'Randburg' },
  { name: 'Northcliff', area: 'Randburg' },
  { name: 'Linden', area: 'Randburg' },
  { name: 'Rosebank', area: 'Rosebank' },
  { name: 'Parktown', area: 'Rosebank' },
  { name: 'Parkhurst', area: 'Rosebank' },
  { name: 'Greenside', area: 'Rosebank' },
  { name: 'Melville', area: 'Rosebank' },
  { name: 'Auckland Park', area: 'Rosebank' },
  { name: 'Craighall', area: 'Rosebank' },
  { name: 'Dunkeld', area: 'Rosebank' },
  { name: 'Braamfontein', area: 'Johannesburg CBD' },
  { name: 'Johannesburg CBD', area: 'Johannesburg CBD' },
  { name: 'Maboneng', area: 'Johannesburg CBD' },
  { name: 'Newtown', area: 'Johannesburg CBD' },
  { name: 'Observatory', area: 'Eastern suburbs' },
  { name: 'Kensington', area: 'Eastern suburbs' },
  { name: 'Bedfordview', area: 'Eastern suburbs' },
  { name: 'Edenvale', area: 'Eastern suburbs' },
  { name: 'Germiston', area: 'East Rand' },
  { name: 'Boksburg', area: 'East Rand' },
  { name: 'Benoni', area: 'East Rand' },
  { name: 'Kempton Park', area: 'East Rand' },
  { name: 'Roodepoort', area: 'West Rand' },
  { name: 'Florida', area: 'West Rand' },
  { name: 'Honeydew', area: 'West Rand' },
  { name: 'Ruimsig', area: 'West Rand' },
  { name: 'Krugersdorp', area: 'West Rand' },
  { name: 'Soweto', area: 'Soweto' },
  { name: 'Lenasia', area: 'Southern suburbs' },
  { name: 'Alberton', area: 'Southern suburbs' },
  { name: 'Mondeor', area: 'Southern suburbs' },
  { name: 'Glenvista', area: 'Southern suburbs' },
  { name: 'Southgate', area: 'Southern suburbs' },
  { name: 'Pretoria', area: 'Long distance' },
  { name: 'Centurion', area: 'Long distance' },
  { name: 'OR Tambo Airport', area: 'East Rand' },
]
