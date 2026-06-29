export type ServiceId =
  | 'long-distance'
  | 'local-move'
  | 'rubble'
  | 'furniture'
  | 'appliance'
  | 'office'

export interface Service {
  id: ServiceId
  name: string
  tagline: string
  icon: string
  /** Category bucket for the home filter row */
  category: string
  /** Base call-out fee in ZAR */
  base: number
  /** Price per km in ZAR */
  perKm: number
  accent: string
}

export interface Customer {
  name: string
  phone: string
  email: string
  address: string
}

export type Role = 'customer' | 'driver'

export type DriverStatus = 'incomplete' | 'pending' | 'approved' | 'suspended'

export interface Driver {
  name: string
  phone: string
  email: string
  // Identity
  idType: string // 'ID' | 'Passport'
  idNumber: string
  docId: string
  docSelfie: string
  docAddress: string // proof of address
  // Licence
  licenceNumber: string
  licenceCode: string
  licenceExpiry: string
  hasPrdp: boolean
  docPrdp: string
  // Consent / declarations
  criminalConsent: boolean
  drivingConsent: boolean
  // Vehicle
  vehicleType: string
  vehicleMake: string
  vehicleModel: string
  vehicleReg: string
  vehicleYear: string
  loadCapacity: string
  vehicleDims: string
  assistants: number
  // Vehicle documents
  docRegistration: string
  docDisc: string
  docRoadworthy: string
  docInsurance: string
  commercialCover: boolean
  // Photos
  docTruckPhoto: string
  docEquipment: string
  // References & training
  refName: string
  refPhone: string
  trainingAck: boolean
  // Payout
  bankHolder: string
  bankName: string
  bankAccount: string
  status: DriverStatus
}

export const EMPTY_DRIVER: Driver = {
  name: '', phone: '', email: '',
  idType: 'ID', idNumber: '', docId: '', docSelfie: '', docAddress: '',
  licenceNumber: '', licenceCode: '', licenceExpiry: '', hasPrdp: false, docPrdp: '',
  criminalConsent: false, drivingConsent: false,
  vehicleType: '', vehicleMake: '', vehicleModel: '', vehicleReg: '', vehicleYear: '',
  loadCapacity: '', vehicleDims: '', assistants: 0,
  docRegistration: '', docDisc: '', docRoadworthy: '', docInsurance: '', commercialCover: false,
  docTruckPhoto: '', docEquipment: '',
  refName: '', refPhone: '', trainingAck: false,
  bankHolder: '', bankName: '', bankAccount: '',
  status: 'incomplete',
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
