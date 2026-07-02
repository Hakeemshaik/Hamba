import type { Driver } from '../lib/types'
import type { BookingRecord } from '../lib/storage'

/**
 * Demo driver account — lets the team preview the approved driver experience
 * without completing the vetting application. Only reachable via the
 * clearly-labelled "Preview the driver app" link on sign-in, and the driver
 * shell shows a persistent "Demo mode" banner while active. Nothing here is
 * ever persisted or synced.
 */
export const DEMO_DRIVER: Driver = {
  name: 'Sipho Dlamini',
  phone: '+27 82 555 0147',
  email: 'sipho@example.co.za',
  idType: 'ID',
  idNumber: '8804125800086',
  docId: 'id-document.pdf',
  docSelfie: 'selfie.jpg',
  docAddress: 'municipal-bill.pdf',
  licenceNumber: 'D4472 1180 09',
  licenceCode: 'C1',
  licenceExpiry: '2028-03-14',
  hasPrdp: true,
  docPrdp: 'prdp-permit.pdf',
  criminalConsent: true,
  drivingConsent: true,
  vehicleType: '1.5-ton truck',
  vehicleMake: 'Hyundai',
  vehicleModel: 'H-100 Bakkie',
  vehicleReg: 'JT 44 HG GP',
  vehicleYear: '2019',
  loadCapacity: '1.5 ton / 9 m³',
  vehicleDims: '3.1 × 1.6 × 1.8 m',
  assistants: 2,
  docRegistration: 'registration-papers.pdf',
  docDisc: 'licence-disc.jpg',
  docRoadworthy: 'roadworthy-cert.pdf',
  docInsurance: 'insurance-schedule.pdf',
  commercialCover: true,
  docTruckPhoto: 'truck-front.jpg',
  docEquipment: 'straps-blankets.jpg',
  refName: 'M. van Rensburg — Kensington Removals',
  refPhone: '+27 11 555 0102',
  trainingAck: true,
  bankHolder: 'S Dlamini',
  bankName: 'Capitec',
  bankAccount: '1483022917',
  status: 'approved',
}

const SEED_JOBS: BookingRecord[] = [
  {
    id: 'HMB-204871',
    serviceId: 'local-move',
    serviceName: 'Local Removal',
    icon: 'boxes',
    pickup: 'Bryanston',
    dropoff: 'Fourways',
    date: today(0),
    time: '09:00',
    total: 3150,
    method: 'card',
    status: 'upcoming',
    createdAt: Date.now() - 1000 * 60 * 42,
  },
  {
    id: 'HMB-204866',
    serviceId: 'furniture',
    serviceName: 'Furniture',
    icon: 'sofa',
    pickup: 'Sandton City',
    dropoff: 'Morningside',
    date: today(0),
    time: '13:30',
    total: 780,
    method: 'tap',
    status: 'upcoming',
    createdAt: Date.now() - 1000 * 60 * 18,
  },
  {
    id: 'HMB-204853',
    serviceId: 'rubble',
    serviceName: 'Rubble Removal',
    icon: 'rubble',
    pickup: 'Randburg',
    dropoff: 'Honeydew landfill',
    date: today(0),
    time: '07:30',
    total: 1620,
    method: 'eft',
    status: 'active',
    driverName: DEMO_DRIVER.name,
    createdAt: Date.now() - 1000 * 60 * 60 * 3,
  },
  {
    id: 'HMB-204791',
    serviceId: 'local-move',
    serviceName: 'Local Removal',
    icon: 'boxes',
    pickup: 'Melville',
    dropoff: 'Greenside',
    date: today(-1),
    time: '10:00',
    total: 2840,
    method: 'card',
    status: 'completed',
    driverName: DEMO_DRIVER.name,
    createdAt: Date.now() - 1000 * 60 * 60 * 26,
  },
  {
    id: 'HMB-204760',
    serviceId: 'appliance',
    serviceName: 'Appliances',
    icon: 'appliance',
    pickup: 'Cresta',
    dropoff: 'Northcliff',
    date: today(-2),
    time: '15:00',
    total: 640,
    method: 'tap',
    status: 'completed',
    driverName: DEMO_DRIVER.name,
    createdAt: Date.now() - 1000 * 60 * 60 * 49,
  },
  {
    id: 'HMB-204712',
    serviceId: 'long-distance',
    serviceName: 'Long Distance',
    icon: 'truck',
    pickup: 'Johannesburg',
    dropoff: 'Pretoria',
    date: today(-4),
    time: '06:30',
    total: 4980,
    method: 'card',
    status: 'completed',
    driverName: DEMO_DRIVER.name,
    createdAt: Date.now() - 1000 * 60 * 60 * 97,
  },
]

function today(offsetDays: number): string {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return d.toISOString().split('T')[0]
}

// In-memory only — accepting/completing demo jobs works for the session but
// never touches storage or Supabase.
let demoJobs: BookingRecord[] = []

export function resetDemoJobs(): void {
  demoJobs = SEED_JOBS.map((j) => ({ ...j }))
}

export function getDemoJobs(): BookingRecord[] {
  if (demoJobs.length === 0) resetDemoJobs()
  return demoJobs
}

export function updateDemoJob(id: string, patch: Partial<BookingRecord>): void {
  const found = getDemoJobs().find((j) => j.id === id)
  if (found) Object.assign(found, patch)
}
