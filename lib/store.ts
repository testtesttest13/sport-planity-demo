import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, Booking, Club } from '@/types'
import { mockUsers, mockClubs } from './mock-data'

interface AppState {
  // Auth
  currentUser: User | null
  setCurrentUser: (user: User | null) => void
  
  // Bookings
  bookings: Booking[]
  addBooking: (booking: Booking) => void
  cancelBooking: (bookingId: string) => void
  
  // Clubs (for caching)
  clubs: Club[]
  
  // UI State
  selectedCoachId: string | null
  setSelectedCoachId: (coachId: string | null) => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Auth
      currentUser: null,
      setCurrentUser: (user) => set({ currentUser: user }),
      
      // Bookings
      bookings: [],
      addBooking: (booking) =>
        set((state) => ({
          bookings: [...state.bookings, booking],
        })),
      cancelBooking: (bookingId) =>
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === bookingId ? { ...b, status: 'cancelled' } : b
          ),
        })),
      
      // Clubs
      clubs: mockClubs,
      
      // UI State
      selectedCoachId: null,
      setSelectedCoachId: (coachId) => set({ selectedCoachId: coachId }),
    }),
    {
      name: 'sport-planity-storage',
    }
  )
)

// Demo login functions
export const loginAsClient = () => {
  const clientUser = mockUsers.find((u) => u.role === 'client')
  useStore.getState().setCurrentUser(clientUser || null)
}

export const loginAsCoach = () => {
  const coachUser = mockUsers.find((u) => u.role === 'coach')
  useStore.getState().setCurrentUser(coachUser || null)
}

export const loginAsAdmin = () => {
  const adminUser = mockUsers.find((u) => u.role === 'admin')
  useStore.getState().setCurrentUser(adminUser || null)
}

export const logout = () => {
  useStore.getState().setCurrentUser(null)
}

