import type { Booking, Quote } from './types'
import { serviceById, loadById, placeByName, HELPER_RATE } from './data'

export function formatZar(amount: number): string {
  return 'R' + Math.round(amount).toLocaleString('en-ZA')
}

/**
 * Distance between two picked places. When both match the suburb list this is
 * real geography: haversine distance × 1.35 road factor. Unknown addresses
 * fall back to a stable pseudo-distance until a maps API is wired in.
 */
export function estimateDistance(pickup: string, dropoff: string): number {
  if (!pickup.trim() || !dropoff.trim()) return 0

  const a = placeByName(pickup)
  const b = placeByName(dropoff)
  if (a && b) {
    const km = haversineKm(a.lat, a.lng, b.lat, b.lng) * 1.35
    return Math.max(3, Math.round(km))
  }

  const text = (pickup + dropoff).toLowerCase().replace(/\s/g, '')
  let hash = 0
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 31 + text.charCodeAt(i)) >>> 0
  }
  const spread = Math.abs(pickup.length - dropoff.length)
  return 6 + (hash % 40) + spread
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const rad = Math.PI / 180
  const dLat = (lat2 - lat1) * rad
  const dLng = (lng2 - lng1) * rad
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLng / 2) ** 2
  return 2 * 6371 * Math.asin(Math.sqrt(s))
}

export function calculateQuote(booking: Booking): Quote {
  const service = serviceById(booking.service)
  const load = loadById(booking.load)
  if (!service || !load) {
    return { base: 0, distance: 0, loadAdjustment: 0, helpers: 0, vat: 0, total: 0 }
  }

  const base = service.base
  const distance = booking.distanceKm * service.perKm
  const subtotalBeforeLoad = base + distance
  const loadAdjustment = subtotalBeforeLoad * (load.multiplier - 1)
  const helpers = booking.helpers * HELPER_RATE

  // VAT is intentionally not added: a pre-revenue startup under the SARS R1m
  // threshold is not VAT-registered, so charging/showing VAT would be a
  // misrepresentation. Prices are quoted inclusive. Re-introduce a VAT line
  // only once Hamba is actually registered.
  const total = base + distance + loadAdjustment + helpers

  return { base, distance, loadAdjustment, helpers, vat: 0, total }
}
