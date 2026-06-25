import type { Booking, Quote } from './types'
import { serviceById, loadById, HELPER_RATE } from './data'

export function formatZar(amount: number): string {
  return 'R' + Math.round(amount).toLocaleString('en-ZA')
}

/**
 * Rough distance estimate from two address strings. With no maps API wired up
 * yet we derive a stable, plausible pseudo-distance from the text so the quote
 * feels real during demos. Swap this for a Google/Mapbox Distance Matrix call.
 */
export function estimateDistance(pickup: string, dropoff: string): number {
  const text = (pickup + dropoff).toLowerCase().replace(/\s/g, '')
  if (!pickup.trim() || !dropoff.trim()) return 0
  let hash = 0
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 31 + text.charCodeAt(i)) >>> 0
  }
  // Longer / more different addresses → larger distance, capped sensibly.
  const spread = Math.abs(pickup.length - dropoff.length)
  return 6 + (hash % 60) + spread * 2
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
