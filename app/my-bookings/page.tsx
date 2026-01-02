'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Calendar, Clock, MapPin, Download, Trash2, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/auth-provider'
import { format, isPast, isFuture } from 'date-fns'
import { fr } from 'date-fns/locale'
import { toast } from 'sonner'

interface Booking {
  id: string
  booking_date: string
  time_slot: string
  status: string
  total_price: number
  coach_id: string
  club_id: string
  coach: {
    id: string
    profile: {
      full_name: string | null
      avatar_url: string | null
    }
    speciality: string | null
  }
  club: {
    id: string
    name: string
    address: string | null
    city: string
  }
}

export default function MyBookingsPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const supabase = createClient()
  
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'upcoming' | 'past'>('upcoming')
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBookings() {
      if (!user) return

      try {
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            id,
            booking_date,
            time_slot,
            status,
            total_price,
            coach_id,
            club_id,
            coaches (
              id,
              speciality,
              profiles (
                full_name,
                avatar_url
              )
            ),
            clubs (
              id,
              name,
              address,
              city
            )
          `)
          .eq('client_id', user.id)
          .order('booking_date', { ascending: true })
          .order('time_slot', { ascending: true })

        if (error) {
          console.error('Error fetching bookings:', error)
          toast.error('Erreur', {
            description: 'Impossible de charger vos réservations.',
          })
        } else {
          setBookings(data || [])
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchBookings()
    }
  }, [user, supabase])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const myBookings = bookings.filter((b) => b.status !== 'cancelled')
  
  const upcomingBookings = myBookings.filter((b) => {
    const bookingDate = new Date(b.booking_date + 'T' + b.time_slot)
    return isFuture(bookingDate) || format(bookingDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  })
  
  const pastBookings = myBookings.filter((b) => {
    const bookingDate = new Date(b.booking_date + 'T' + b.time_slot)
    return isPast(bookingDate) && format(bookingDate, 'yyyy-MM-dd') !== format(new Date(), 'yyyy-MM-dd')
  })

  const displayedBookings = filter === 'upcoming' ? upcomingBookings : pastBookings

  const handleAddToCalendar = (booking: Booking) => {
    const coachName = booking.coach?.profile?.full_name || 'Coach'
    const clubName = booking.club?.name || 'Club'
    const clubAddress = booking.club?.address || booking.club?.city || ''
    const sport = booking.coach?.speciality || 'sport'

    const startDate = new Date(booking.booking_date + 'T' + booking.time_slot)
    const endDate = new Date(startDate)
    endDate.setHours(startDate.getHours() + 1)

    const title = `Cours de ${sport} avec ${coachName}`
    const details = `${clubName} - ${clubAddress}`
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      title
    )}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate
      .toISOString()
      .replace(/[-:]/g, '')
      .split('.')[0]}Z&details=${encodeURIComponent(details)}&location=${encodeURIComponent(
      clubAddress
    )}`

    window.open(googleCalendarUrl, '_blank')
  }

  const handleCancelBooking = (bookingId: string) => {
    setBookingToCancel(bookingId)
    setCancelDialogOpen(true)
  }

  const confirmCancelBooking = async () => {
    if (!bookingToCancel) return

    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingToCancel)

      if (error) {
        toast.error('Erreur', {
          description: 'Impossible d\'annuler la réservation.',
        })
      } else {
        toast.success('Réservation annulée', {
          description: 'Votre réservation a été annulée avec succès.',
        })
        // Refresh bookings
        const { data } = await supabase
          .from('bookings')
          .select(`
            id,
            booking_date,
            time_slot,
            status,
            total_price,
            coach_id,
            club_id,
            coaches (
              id,
              speciality,
              profiles (
                full_name,
                avatar_url
              )
            ),
            clubs (
              id,
              name,
              address,
              city
            )
          `)
          .eq('client_id', user.id)
          .order('booking_date', { ascending: true })

        if (data) {
          setBookings(data)
        }
      }
    } catch (error) {
      console.error('Error cancelling booking:', error)
      toast.error('Erreur', {
        description: 'Une erreur est survenue.',
      })
    } finally {
      setCancelDialogOpen(false)
      setBookingToCancel(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 pt-12 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-2">Mes cours</h1>
          <p className="text-blue-100">
            {upcomingBookings.length} cours à venir
          </p>
        </motion.div>
      </div>

      <div className="max-w-2xl mx-auto px-6 -mt-6">
        {/* Filter Tabs */}
        <Card className="mb-6 overflow-hidden">
          <div className="grid grid-cols-2">
            <button
              onClick={() => setFilter('upcoming')}
              className={`py-4 text-sm font-semibold transition-colors ${
                filter === 'upcoming'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              À venir ({upcomingBookings.length})
            </button>
            <button
              onClick={() => setFilter('past')}
              className={`py-4 text-sm font-semibold transition-colors ${
                filter === 'past'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Passés ({pastBookings.length})
            </button>
          </div>
        </Card>

        {/* Bookings List */}
        {displayedBookings.length === 0 ? (
          <Card className="p-12 text-center border border-gray-200">
            <Calendar className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              Aucun cours enregistré
            </h3>
            <p className="text-gray-600 mb-8 max-w-sm mx-auto">
              Vous n&apos;avez aucun cours programmé ou passé pour le moment. Découvrez nos clubs et réservez votre premier cours !
            </p>
            <Link href="/">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-base font-semibold">
                Réserver un cours
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {displayedBookings.map((booking, idx) => {
              const coachName = booking.coach?.profile?.full_name || 'Coach'
              const coachPhoto = booking.coach?.profile?.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
              const coachSpeciality = booking.coach?.speciality || 'Coach'
              const clubName = booking.club?.name || 'Club'
              const bookingDate = new Date(booking.booking_date + 'T' + booking.time_slot)

              return (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <div className="flex">
                        {/* Coach Image */}
                        <div className="relative w-32 h-40 flex-shrink-0">
                          <Image
                            src={coachPhoto}
                            alt={coachName}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Booking Info */}
                        <div className="flex-1 p-4 flex flex-col">
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-bold text-lg">{coachName}</h3>
                                <p className="text-sm text-gray-600">
                                  {coachSpeciality}
                                </p>
                              </div>
                              {filter === 'upcoming' && (
                                <Badge className="bg-green-100 text-green-700 border-0">
                                  Confirmé
                                </Badge>
                              )}
                            </div>

                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2 text-gray-700">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span className="font-medium">
                                  {format(bookingDate, 'EEEE d MMMM yyyy', {
                                    locale: fr,
                                  })}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-700">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span>{booking.time_slot}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-700">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span className="line-clamp-1">{clubName}</span>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          {filter === 'upcoming' && (
                            <div className="flex gap-2 mt-3 pt-3 border-t">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAddToCalendar(booking)}
                                className="flex-1"
                              >
                                <Download className="w-4 h-4 mr-1" />
                                Calendrier
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCancelBooking(booking.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          )}

                          {filter === 'past' && (
                            <Link href={`/club/${booking.club_id}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full mt-3"
                              >
                                Réserver à nouveau
                                <ChevronRight className="w-4 h-4 ml-1" />
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Annuler la réservation</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir annuler cette réservation ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setCancelDialogOpen(false)
                setBookingToCancel(null)
              }}
            >
              Garder la réservation
            </Button>
            <Button
              variant="destructive"
              onClick={confirmCancelBooking}
            >
              Annuler la réservation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
