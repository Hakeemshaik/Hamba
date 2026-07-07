import {
  saveBookingLocal,
  loadBookings,
  saveComplaintLocal,
  saveMessageLocal,
  saveInsuranceLeadLocal,
  type BookingRecord,
  type ComplaintRecord,
  type MessageRecord,
  type InsuranceLead,
} from './storage'
import { remoteInsert, remoteSelect, remoteUpdate } from './supabase'
import { serviceById } from './data'
import type { Customer, Driver } from './types'

interface BookingRow {
  id: string
  service_id: string
  service_name: string
  pickup: string | null
  dropoff: string | null
  move_date: string | null
  move_time: string | null
  total: number | string
  method: string | null
  status: BookingRecord['status']
  driver_name: string | null
  created_at: string
}

function rowToRecord(r: BookingRow): BookingRecord {
  return {
    id: r.id,
    serviceId: r.service_id,
    serviceName: r.service_name,
    icon: serviceById(r.service_id)?.icon ?? 'boxes',
    pickup: r.pickup ?? '',
    dropoff: r.dropoff ?? '',
    date: r.move_date ?? '',
    time: r.move_time ?? '',
    total: Number(r.total),
    method: r.method ?? '',
    status: r.status,
    driverName: r.driver_name ?? undefined,
    createdAt: Date.parse(r.created_at) || Date.now(),
  }
}

/** Open + active jobs from the cloud so drivers on other phones see them. */
export async function fetchOpenJobs(): Promise<BookingRecord[] | null> {
  const rows = await remoteSelect<BookingRow>(
    'bookings',
    'status=in.(upcoming,active)&order=created_at.desc&limit=50',
  )
  return rows ? rows.map(rowToRecord) : null
}

/** One booking's latest cloud state, for customer-side live tracking. */
export async function fetchBooking(id: string): Promise<BookingRecord | null> {
  const rows = await remoteSelect<BookingRow>('bookings', `id=eq.${encodeURIComponent(id)}&limit=1`)
  return rows && rows[0] ? rowToRecord(rows[0]) : null
}

export function updateBookingRemote(id: string, patch: { status?: string; driverName?: string }): void {
  const row: Record<string, unknown> = {}
  if (patch.status) row.status = patch.status
  if (patch.driverName !== undefined) row.driver_name = patch.driverName
  void remoteUpdate('bookings', `id=eq.${encodeURIComponent(id)}`, row)
}

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

export function persistDriver(d: Driver): void {
  remoteInsert('drivers', {
    name: d.name,
    phone: d.phone,
    email: d.email,
    id_type: d.idType,
    id_number: d.idNumber,
    licence_number: d.licenceNumber,
    licence_code: d.licenceCode,
    licence_expiry: d.licenceExpiry || null,
    has_prdp: d.hasPrdp,
    criminal_consent: d.criminalConsent,
    driving_consent: d.drivingConsent,
    vehicle_type: d.vehicleType,
    vehicle_make: d.vehicleMake,
    vehicle_model: d.vehicleModel,
    vehicle_reg: d.vehicleReg,
    vehicle_year: d.vehicleYear,
    load_capacity: d.loadCapacity,
    vehicle_dims: d.vehicleDims,
    assistants: d.assistants,
    commercial_cover: d.commercialCover,
    ref_name: d.refName,
    ref_phone: d.refPhone,
    training_ack: d.trainingAck,
    bank_holder: d.bankHolder,
    bank_name: d.bankName,
    bank_account: d.bankAccount,
    status: d.status,
  })
}

export function persistInsuranceLead(lead: InsuranceLead): void {
  saveInsuranceLeadLocal(lead)
  remoteInsert('insurance_leads', {
    id: lead.id,
    name: lead.name,
    phone: lead.phone,
    email: lead.email,
    booking_ref: lead.bookingRef || null,
    note: lead.note || null,
    created_at: new Date(lead.createdAt).toISOString(),
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
