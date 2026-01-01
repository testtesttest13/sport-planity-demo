export type Sport = 'tennis' | 'padel' | 'equitation'

export interface TimeSlot {
  time: string // Format: "10:00"
  available: boolean
}

export interface DaySchedule {
  day: number // 0-6 (Sunday-Saturday)
  slots: string[] // Array of time strings like ["10:00", "11:00"]
}

export interface Coach {
  id: string
  name: string
  photoUrl: string
  age: number
  speciality: string // "Expert Terre Battue", "Padel Pro"
  bio: string
  rating: number
  reviewCount: number
  hourlyRate: number
  clubId: string
  weeklySchedule: DaySchedule[]
}

export interface Review {
  id: string
  authorName: string
  authorPhoto: string
  rating: number
  date: string
  comment: string
}

export interface Club {
  id: string
  name: string
  address: string
  city: string
  sport: Sport
  coverUrl: string
  logoUrl: string
  images: string[]
  description: string
  verified: boolean
  rating: number
  reviewCount: number
  amenities: string[]
  coaches: Coach[]
  reviews: Review[]
}

export interface Booking {
  id: string
  coachId: string
  clubId: string
  date: string // ISO format
  time: string // "10:00"
  clientName: string
  status: 'pending' | 'confirmed' | 'cancelled'
  totalPrice: number
}

export type UserRole = 'client' | 'coach' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  photoUrl: string
  role: UserRole
  clubId?: string // For coach and admin
  coachId?: string // For coach
}

