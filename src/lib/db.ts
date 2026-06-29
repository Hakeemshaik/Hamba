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
import type { Customer, Driver } from './types'

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
