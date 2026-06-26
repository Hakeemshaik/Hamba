import {
  saveBookingLocal,
  loadBookings,
  saveComplaintLocal,
  saveMessageLocal,
  type BookingRecord,
  type ComplaintRecord,
  type MessageRecord,
} from './storage'
import { remoteInsert } from './supabase'
import type { Customer } from './types'

/**
 * Persistence layer. Writes to local storage always (so the app works with
 * zero setup) and best-effort mirrors to Supabase when it's configured.
 */
export function persistBooking(rec: BookingRecord): void {
  saveBookingLocal(rec)
  remoteInsert('bookings', {
    id: rec.id,
    service_id: rec.serviceId,
    service_name: rec.serviceName,
    pickup: rec.pickup,
    dropoff: rec.dropoff,
    move_date: rec.date,
    move_time: rec.time,
    total: rec.total,
    method: rec.method,
    status: rec.status,
    created_at: new Date(rec.createdAt).toISOString(),
  })
}

export function persistCustomer(c: Customer): void {
  remoteInsert('customers', { name: c.name, phone: c.phone, email: c.email, address: c.address })
}

export function persistComplaint(rec: ComplaintRecord): void {
  saveComplaintLocal(rec)
  remoteInsert('complaints', {
    id: rec.id,
    category: rec.category,
    booking_ref: rec.reference,
    message: rec.message,
    created_at: new Date(rec.createdAt).toISOString(),
  })
}

export function persistMessage(rec: MessageRecord): void {
  saveMessageLocal(rec)
  remoteInsert('messages', {
    id: rec.id,
    name: rec.name,
    message: rec.message,
    created_at: new Date(rec.createdAt).toISOString(),
  })
}

export { loadBookings }
