'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Calendar as CalendarIcon, Clock, User, Euro, Trash2, Phone, Mail, Settings, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useAuth } from '@/components/providers/auth-provider'
import { createClient } from '@/lib/supabase/client'
import { format, startOfWeek, addDays } from 'date-fns'
import { fr } from 'date-fns/locale'
import { toast } from 'sonner'

interface CoachData {
  id: string
  profile_id: string
  club_id: string
  speciality: string | null
  bio: string | null
  hourly_rate: number
  rating: number
  review_count: number
  profile: {
    full_name: string | null
    avatar_url: string | null
  }
  club: {
    id: string
    name: string
    address: string | null
    city: string
  }
}

interface BookingData {
  id: string
  booking_date: string
  time_slot: string
  status: string
  total_price: number
  client_id: string
  client: {
    full_name: string | null
    avatar_url: string | null
    email: string | null
    phone: string | null
  }
}

export default function CoachDashboard() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const supabase = createClient()
  
  const [coach, setCoach] = useState<CoachData | null>(null)
  const [bookings, setBookings] = useState<BookingData[]>([])
  const [availability, setAvailability] = useState<Array<{ day_of_week: number; time_slot: string }>>([])
  const [loading, setLoading] = useState(true)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null)
  const [cancelReason, setCancelReason] = useState('')
  const [cancelling, setCancelling] = useState(false)
  const [editingPrice, setEditingPrice] = useState(false)
  const [newHourlyRate, setNewHourlyRate] = useState<number>(0)
  const [savingPrice, setSavingPrice] = useState(false)

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      router.push('/login')
      return
    }

    loadCoachData()
  }, [user, authLoading, router])

  const loadCoachData = async () => {
    if (!user) return

    try {
      // Check user role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profileError || !profile || profile.role !== 'coach') {
        router.push('/')
        return
      }

      // Load coach data
      const { data: coachData, error: coachError } = await supabase
        .from('coaches')
        .select(`
          id,
          profile_id,
          club_id,
          speciality,
          bio,
          hourly_rate,
          rating,
          review_count,
          profiles (
            full_name,
            avatar_url
          ),
          clubs (
            id,
            name,
            address,
            city
          )
        `)
        .eq('profile_id', user.id)
        .single()

      if (coachError || !coachData) {
        console.error('Error loading coach:', coachError)
        router.push('/')
        return
      }

      setCoach({
        id: coachData.id,
        profile_id: coachData.profile_id,
        club_id: coachData.club_id,
        speciality: coachData.speciality,
        bio: coachData.bio,
        hourly_rate: coachData.hourly_rate || 50,
        rating: coachData.rating,
        review_count: coachData.review_count,
        profile: {
          full_name: (coachData.profiles as any)?.full_name || null,
          avatar_url: (coachData.profiles as any)?.avatar_url || null,
        },
        club: {
          id: (coachData.clubs as any)?.id || '',
          name: (coachData.clubs as any)?.name || '',
          address: (coachData.clubs as any)?.address || null,
          city: (coachData.clubs as any)?.city || '',
        },
      })

      // Load bookings with client profiles
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          id,
          booking_date,
          time_slot,
          status,
          total_price,
          client_id
        `)
        .eq('coach_id', coachData.id)
        .neq('status', 'cancelled')
        .order('booking_date', { ascending: true })
        .order('time_slot', { ascending: true })

      if (bookingsError) {
        console.error('Error loading bookings:', bookingsError)
      } else {
        // Load client profiles for each booking (including email from auth.users)
        const clientIds = [...new Set((bookingsData || []).map((b: any) => b.client_id))]
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url, phone, email')
          .in('id', clientIds)

        const profilesMap = new Map((profilesData || []).map((p: any) => [p.id, p]))

        const transformedBookings = (bookingsData || []).map((b: any) => {
          const profile = profilesMap.get(b.client_id)
          return {
            id: b.id,
            booking_date: b.booking_date,
            time_slot: b.time_slot,
            status: b.status,
            total_price: b.total_price,
            client_id: b.client_id,
            client: {
              full_name: profile?.full_name || null,
              avatar_url: profile?.avatar_url || null,
              email: profile?.email || null,
              phone: profile?.phone || null,
            },
          }
        })
        setBookings(transformedBookings)
      }

      // Load availability
      const { data: availabilityData, error: availabilityError } = await supabase
        .from('coach_availability')
        .select('day_of_week, time_slot')
        .eq('coach_id', coachData.id)
        .eq('is_available', true)

      if (availabilityError) {
        console.error('Error loading availability:', availabilityError)
      } else {
        setAvailability((availabilityData || []) as Array<{ day_of_week: number; time_slot: string }>)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!coach) {
    return null
  }

  // Generate week view
  const weekStart = startOfWeek(new Date(), { locale: fr, weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00',
    '14:00', '15:00', '16:00', '17:00', '18:00',
  ]

  // Helper to format time from "14:00:00" to "14:00"
  const formatTimeDisplay = (time: string) => {
    return time.substring(0, 5)
  }

  const getSlotStatus = (day: Date, time: string) => {
    // getDay() returns: 0=Sunday, 1=Monday, 2=Tuesday, ..., 6=Saturday
    // Database stores: 1=Monday, 2=Tuesday, ..., 5=Friday (no weekends)
    const dayOfWeek = day.getDay()
    
    // Only Monday (1) to Friday (5) have availability
    if (dayOfWeek === 0 || dayOfWeek === 6 || dayOfWeek < 1 || dayOfWeek > 5) {
      return 'unavailable'
    }
    
    // Check if slot is in availability (dayOfWeek is already 1-5 for Mon-Fri)
    const isAvailable = availability.some(
      (av) => av.day_of_week === dayOfWeek && formatTimeDisplay(av.time_slot) === time
    )
    
    if (!isAvailable) {
      return 'unavailable'
    }
    
    // Check if slot is booked
    const booking = bookings.find(
      (b) =>
        b.booking_date === format(day, 'yyyy-MM-dd') &&
        formatTimeDisplay(b.time_slot) === time &&
        b.status !== 'cancelled'
    )
    
    return booking ? 'booked' : 'available'
  }

  // Get upcoming bookings (future or today)
  const upcomingBookings = bookings.filter((b) => {
    const bookingDate = new Date(b.booking_date + 'T' + b.time_slot)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return bookingDate >= today
  })

  const handleCancelBooking = (bookingId: string) => {
    setBookingToCancel(bookingId)
    setCancelDialogOpen(true)
    setCancelReason('')
  }

  const confirmCancelBooking = async () => {
    if (!bookingToCancel || !cancelReason.trim()) {
      toast.error('Erreur', { description: 'Veuillez indiquer une raison.' })
      return
    }

    setCancelling(true)

    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingToCancel)

      if (error) {
        throw error
      }

      // Refresh bookings
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select(`
          id,
          booking_date,
          time_slot,
          status,
          total_price,
          client_id
        `)
        .eq('coach_id', coach!.id)
        .neq('status', 'cancelled')
        .order('booking_date', { ascending: true })
        .order('time_slot', { ascending: true })

      if (bookingsData) {
        const clientIds = [...new Set(bookingsData.map((b: any) => b.client_id))]
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url, phone, email')
          .in('id', clientIds)

        const profilesMap = new Map((profilesData || []).map((p: any) => [p.id, p]))

        const transformedBookings = bookingsData.map((b: any) => {
          const profile = profilesMap.get(b.client_id)
          return {
            id: b.id,
            booking_date: b.booking_date,
            time_slot: b.time_slot,
            status: b.status,
            total_price: b.total_price,
            client_id: b.client_id,
            client: {
              full_name: profile?.full_name || null,
              avatar_url: profile?.avatar_url || null,
              email: profile?.email || null,
              phone: profile?.phone || null,
            },
          }
        })
        setBookings(transformedBookings)
      }

      toast.success('Réservation annulée', {
        description: 'La réservation a été annulée avec succès.',
      })
      setCancelDialogOpen(false)
      setBookingToCancel(null)
      setCancelReason('')
    } catch (error: any) {
      console.error('Error cancelling booking:', error)
      toast.error('Erreur', {
        description: error.message || 'Impossible d\'annuler la réservation.',
      })
    } finally {
      setCancelling(false)
    }
  }

  const handleSavePrice = async () => {
    if (!coach || !newHourlyRate || newHourlyRate <= 0) {
      toast.error('Erreur', { description: 'Veuillez entrer un prix valide.' })
      return
    }

    setSavingPrice(true)

    try {
      const { error } = await supabase
        .from('coaches')
        .update({ hourly_rate: newHourlyRate })
        .eq('id', coach.id)

      if (error) {
        throw error
      }

      setCoach({ ...coach, hourly_rate: newHourlyRate })
      setEditingPrice(false)
      setNewHourlyRate(0)

      toast.success('Prix mis à jour', {
        description: 'Votre tarif horaire a été mis à jour avec succès.',
      })
    } catch (error: any) {
      console.error('Error updating price:', error)
      toast.error('Erreur', {
        description: error.message || 'Erreur lors de la mise à jour du prix.',
      })
    } finally {
      setSavingPrice(false)
    }
  }

  const coachName = coach.profile.full_name || 'Coach'
  const coachPhoto = coach.profile.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-6xl mx-auto px-6 pt-12 pb-8">
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl">
              <Image
                src={coachPhoto}
                alt={coachName}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{coachName}</h1>
              <p className="text-blue-100 text-lg">{coach.speciality || 'Coach'}</p>
              <p className="text-blue-100">{coach.club.name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-blue-100">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{upcomingBookings.length}</p>
                    <p className="text-sm text-gray-600">Réservations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-green-100">
                    <Euro className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{coach.hourly_rate}€</p>
                    <p className="text-sm text-gray-600">Tarif/heure</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-yellow-100">
                    <CalendarIcon className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{coach.review_count}</p>
                    <p className="text-sm text-gray-600">Avis</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-purple-100">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{coach.rating.toFixed(1)}</p>
                    <p className="text-sm text-gray-600">Note</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="planning" className="space-y-6">
          <TabsList>
            <TabsTrigger value="planning">Planning</TabsTrigger>
            <TabsTrigger value="reservations">Réservations</TabsTrigger>
            <TabsTrigger value="parametres">Paramètres</TabsTrigger>
          </TabsList>

          {/* Planning Tab */}
          <TabsContent value="planning">
            <Card>
              <CardHeader>
                <CardTitle>Votre Planning Hebdomadaire</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <div className="inline-block min-w-full">
                    {/* Week Header */}
                    <div className="grid grid-cols-8 gap-2 mb-4">
                      <div className="text-xs font-medium text-gray-600"></div>
                      {weekDays.map((day) => (
                        <div key={day.toISOString()} className="text-center">
                          <p className="text-xs font-medium text-gray-600 uppercase">
                            {format(day, 'EEE', { locale: fr })}
                          </p>
                          <p className="text-lg font-bold">
                            {format(day, 'd')}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Time Slots Grid */}
                    <div className="space-y-2">
                      {timeSlots.map((time) => (
                        <div key={time} className="grid grid-cols-8 gap-2">
                          <div className="flex items-center text-sm font-medium text-gray-600">
                            {time}
                          </div>
                          {weekDays.map((day) => {
                            const status = getSlotStatus(day, time)
                            return (
                              <div
                                key={`${day}-${time}`}
                                className={`
                                  h-12 rounded-xl border-2 flex items-center justify-center text-xs font-medium
                                  ${
                                    status === 'booked'
                                      ? 'bg-blue-100 border-blue-300 text-blue-700'
                                      : status === 'available'
                                      ? 'bg-green-50 border-green-300 text-green-700'
                                      : 'bg-gray-50 border-gray-200 text-gray-400'
                                  }
                                `}
                              >
                                {status === 'booked'
                                  ? '✓ Réservé'
                                  : status === 'available'
                                  ? 'Libre'
                                  : '—'}
                              </div>
                            )
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 mt-6 pt-6 border-t">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-green-100 border-2 border-green-300" />
                    <span className="text-sm text-gray-600">Disponible</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-blue-100 border-2 border-blue-300" />
                    <span className="text-sm text-gray-600">Réservé</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-gray-50 border-2 border-gray-200" />
                    <span className="text-sm text-gray-600">Indisponible</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reservations Tab */}
          <TabsContent value="reservations">
            <Card>
              <CardHeader>
                <CardTitle>Réservations à venir</CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingBookings.length === 0 ? (
                  <div className="text-center py-12">
                    <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">Aucune réservation pour le moment</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingBookings.map((booking) => {
                      const handleAddToCalendar = () => {
                        const startDate = new Date(booking.booking_date + 'T' + booking.time_slot)
                        const endDate = new Date(startDate)
                        endDate.setHours(startDate.getHours() + 1)

                        const clientName = booking.client.full_name || 'Client'
                        const title = `Cours avec ${clientName}`
                        const details = `Cours de ${coach.speciality || 'sport'} - ${coach.club.name}`
                        
                        const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                          title
                        )}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate
                          .toISOString()
                          .replace(/[-:]/g, '')
                          .split('.')[0]}Z&details=${encodeURIComponent(details)}&location=${encodeURIComponent(
                          coach.club.address || coach.club.city
                        )}`

                        window.open(googleCalendarUrl, '_blank')
                      }

                      const clientName = booking.client.full_name || 'Client'
                      const clientInitial = clientName.charAt(0).toUpperCase()
                      const clientPhoto = booking.client.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(clientName)}&background=2563eb&color=fff`

                      return (
                        <motion.div
                          key={booking.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-4">
                              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                                {booking.client.avatar_url ? (
                                  <Image
                                    src={clientPhoto}
                                    alt={clientName}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  clientInitial
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-lg">{clientName}</p>
                                <p className="text-sm text-gray-600">Élève</p>
                                {(booking.client.phone || booking.client.email) && (
                                  <div className="flex flex-col gap-1 mt-1">
                                    {booking.client.phone && (
                                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                        <Phone className="w-3 h-3" />
                                        <span>{booking.client.phone}</span>
                                      </div>
                                    )}
                                    {booking.client.email && (
                                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                        <Mail className="w-3 h-3" />
                                        <span className="truncate max-w-[200px]">{booking.client.email}</span>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <Badge
                              className={
                                booking.status === 'confirmed'
                                  ? 'bg-green-100 text-green-700 border-0'
                                  : 'bg-yellow-100 text-yellow-700 border-0'
                              }
                            >
                              {booking.status === 'confirmed' ? '✓ Confirmé' : 'En attente'}
                            </Badge>
                            <Button
                              onClick={() => handleCancelBooking(booking.id)}
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                            </div>
                          </div>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-gray-700">
                              <CalendarIcon className="w-4 h-4 text-gray-500" />
                              <span className="font-medium">
                                {format(new Date(booking.booking_date), 'EEEE d MMMM yyyy', {
                                  locale: fr,
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700">
                              <Clock className="w-4 h-4 text-gray-500" />
                              <span className="font-medium">
                                {formatTimeDisplay(booking.time_slot)} - {(() => {
                                  const [hours] = booking.time_slot.split(':')
                                  return `${parseInt(hours) + 1}:00`
                                })()}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-blue-200">
                            <div>
                              <p className="text-sm text-gray-600">Montant</p>
                              <p className="font-bold text-xl text-blue-600">{booking.total_price}€</p>
                            </div>
                            <Button
                              onClick={handleAddToCalendar}
                              variant="outline"
                              size="sm"
                              className="bg-white hover:bg-gray-50"
                            >
                              <CalendarIcon className="w-4 h-4 mr-2" />
                              Ajouter au calendrier
                            </Button>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Paramètres Tab */}
          <TabsContent value="parametres">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Paramètres
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Prix horaire */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tarif horaire (€)
                  </label>
                  {editingPrice ? (
                    <div className="space-y-3">
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={newHourlyRate || coach.hourly_rate}
                        onChange={(e) => setNewHourlyRate(parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-3 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-lg font-semibold"
                        placeholder="Ex: 50"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={handleSavePrice}
                          disabled={savingPrice || !newHourlyRate || newHourlyRate <= 0}
                          className="flex-1"
                        >
                          {savingPrice ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              Enregistrement...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              Enregistrer
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEditingPrice(false)
                            setNewHourlyRate(0)
                          }}
                          disabled={savingPrice}
                        >
                          Annuler
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                      <div>
                        <p className="text-2xl font-bold">{coach.hourly_rate}€</p>
                        <p className="text-sm text-gray-600 mt-1">Par heure de cours</p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditingPrice(true)
                          setNewHourlyRate(coach.hourly_rate)
                        }}
                      >
                        Modifier
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Cancel Booking Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Annuler la réservation</DialogTitle>
                        <DialogDescription>
                          Veuillez indiquer la raison de l&apos;annulation. Le client sera informé de cette annulation.
                        </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Raison de l&apos;annulation *
            </label>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Ex: Indisponibilité, annulation du client, etc."
              rows={4}
              className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none resize-none"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCancelDialogOpen(false)
                setCancelReason('')
                setBookingToCancel(null)
              }}
              disabled={cancelling}
            >
              Annuler
            </Button>
            <Button
              onClick={confirmCancelBooking}
              disabled={!cancelReason.trim() || cancelling}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {cancelling ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Annulation...
                </>
              ) : (
                'Confirmer l\'annulation'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
