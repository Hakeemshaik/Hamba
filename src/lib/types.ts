export type ServiceId = 'long-distance' | 'local-move' | 'rubble'

export interface Service {
  id: ServiceId
  name: string
  tagline: string
  icon: string
  /** Base call-out fee in ZAR */
  base: number
  /** Price per km in ZAR */
  perKm: number
  accent: string
}

export type LoadSize = 'small' | 'medium' | 'large' | 'xl'

export interface LoadOption {
  id: LoadSize
  label: string
  detail: string
  /** Multiplier applied to the distance + base price */
  multiplier: number
  icon: string
}

export interface Booking {
  service: ServiceId | null
  pickup: string
  dropoff: string
  date: string
  time: string
  load: LoadSize | null
  /** Estimated distance in km (stubbed estimate) */
  distanceKm: number
  notes: string
  helpers: number
}

export type PaymentMethod = 'tap' | 'card' | 'eft'

export interface Quote {
  base: number
  distance: number
  loadAdjustment: number
  helpers: number
  vat: number
  total: number
}
