import type { Customer } from './types'

const KEY_PROFILE = 'hamba.profile.v1'
const KEY_ADDR = 'hamba.addresses.v1'
const KEY_BOOKINGS = 'hamba.bookings.v1'
const KEY_COMPLAINTS = 'hamba.complaints.v1'
const KEY_MESSAGES = 'hamba.messages.v1'

export interface RecentAddress {
  value: string
  count: number
  at: number
}

export interface BookingRecord {
  id: string
  serviceId: string
  serviceName: string
  icon: string
  pickup: string
  dropoff: string
  date: string
  time: string
  total: number
  method: string
  status: 'upcoming' | 'active' | 'completed' | 'cancelled'
  createdAt: number
}

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable (private mode) — fail silently */
  }
}

export function loadProfile(): Customer | null {
  return read<Customer | null>(KEY_PROFILE, null)
}

export function saveProfile(c: Customer): void {
  write(KEY_PROFILE, c)
}

export function clearAccount(): void {
  try {
    localStorage.removeItem(KEY_PROFILE)
  } catch {
    /* ignore */
  }
}

export function loadAddresses(): RecentAddress[] {
  return read<RecentAddress[]>(KEY_ADDR, [])
}

/** Record a used address and return the updated, most-used-first list. */
export function recordAddress(value: string): RecentAddress[] {
  const v = value.trim()
  if (!v) return loadAddresses()
  const list = loadAddresses()
  const existing = list.find((a) => a.value.toLowerCase() === v.toLowerCase())
  if (existing) {
    existing.count += 1
    existing.at = Date.now()
  } else {
    list.push({ value: v, count: 1, at: Date.now() })
  }
  list.sort((a, b) => b.count - a.count || b.at - a.at)
  const trimmed = list.slice(0, 12)
  write(KEY_ADDR, trimmed)
  return trimmed
}

/** Most-used addresses first, as plain strings. */
export function topAddresses(limit = 5): string[] {
  return loadAddresses().slice(0, limit).map((a) => a.value)
}

export function loadBookings(): BookingRecord[] {
  return read<BookingRecord[]>(KEY_BOOKINGS, []).sort((a, b) => b.createdAt - a.createdAt)
}

export function saveBookingLocal(rec: BookingRecord): void {
  const list = read<BookingRecord[]>(KEY_BOOKINGS, [])
  list.push(rec)
  write(KEY_BOOKINGS, list)
}

export function updateBookingStatus(id: string, status: BookingRecord['status']): void {
  const list = read<BookingRecord[]>(KEY_BOOKINGS, [])
  const found = list.find((b) => b.id === id)
  if (found) {
    found.status = status
    write(KEY_BOOKINGS, list)
  }
}

export function latestBooking(): BookingRecord | null {
  return loadBookings()[0] ?? null
}

export interface ComplaintRecord {
  id: string
  category: string
  reference: string
  message: string
  createdAt: number
}

export function saveComplaintLocal(rec: ComplaintRecord): void {
  const list = read<ComplaintRecord[]>(KEY_COMPLAINTS, [])
  list.push(rec)
  write(KEY_COMPLAINTS, list)
}

export interface MessageRecord {
  id: string
  name: string
  message: string
  createdAt: number
}

export function saveMessageLocal(rec: MessageRecord): void {
  const list = read<MessageRecord[]>(KEY_MESSAGES, [])
  list.push(rec)
  write(KEY_MESSAGES, list)
}
