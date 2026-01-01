'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Calendar, Clock, MapPin, Download, Trash2, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useStore } from '@/lib/store'
import { mockClubs, mockCoaches } from '@/lib/mock-data'
import { format, isPast, isFuture } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function MyBookingsPage() {
  const router = useRouter()
  const { currentUser, bookings, cancelBooking } = useStore()
  const [filter, setFilter] = useState<'upcoming' | 'past'>('upcoming')

  if (!currentUser) {
    router.push('/')
    return null
  }

  const myBookings = bookings.filter((b) => b.status !== 'cancelled')
  
  const upcomingBookings = myBookings.filter((b) =>
    isFuture(new Date(b.date)) || format(new Date(b.date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  )
  
  const pastBookings = myBookings.filter((b) =>
    isPast(new Date(b.date)) && format(new Date(b.date), 'yyyy-MM-dd') !== format(new Date(), 'yyyy-MM-dd')
  )

  const displayedBookings = filter === 'upcoming' ? upcomingBookings : pastBookings

  const handleAddToCalendar = (booking: any) => {
    const coach = mockCoaches.find((c) => c.id === booking.coachId)
    const club = mockClubs.find((c) => c.id === booking.clubId)
    
    if (!coach || !club) return

    const startDate = new Date(booking.date)
    const [hours, minutes] = booking.time.split(':')
    startDate.setHours(parseInt(hours), parseInt(minutes))
    
    const endDate = new Date(startDate)
    endDate.setHours(startDate.getHours() + 1)

    const title = `Cours de ${club.sport} avec ${coach.name}`
    const details = `${club.name} - ${club.address}`
    
    // Create Google Calendar URL
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      title
    )}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate
      .toISOString()
      .replace(/[-:]/g, '')
      .split('.')[0]}Z&details=${encodeURIComponent(details)}&location=${encodeURIComponent(
      club.address
    )}`

    window.open(googleCalendarUrl, '_blank')
  }

  const handleCancelBooking = (bookingId: string) => {
    if (confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      cancelBooking(bookingId)
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
          <Card className="p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {filter === 'upcoming' ? 'Aucun cours à venir' : 'Aucun cours passé'}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'upcoming'
                ? 'Réservez votre premier cours avec nos coachs'
                : 'Vos cours passés apparaîtront ici'}
            </p>
            {filter === 'upcoming' && (
              <Link href="/">
                <Button>Rechercher un coach</Button>
              </Link>
            )}
          </Card>
        ) : (
          <div className="space-y-4">
            {displayedBookings.map((booking, idx) => {
              const coach = mockCoaches.find((c) => c.id === booking.coachId)
              const club = mockClubs.find((c) => c.id === booking.clubId)

              if (!coach || !club) return null

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
                            src={coach.photoUrl}
                            alt={coach.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Booking Info */}
                        <div className="flex-1 p-4 flex flex-col">
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-bold text-lg">{coach.name}</h3>
                                <p className="text-sm text-gray-600">
                                  {coach.speciality}
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
                                  {format(new Date(booking.date), 'EEEE d MMMM yyyy', {
                                    locale: fr,
                                  })}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-700">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span>{booking.time}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-700">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span className="line-clamp-1">{club.name}</span>
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
                            <Link href={`/club/${club.id}`}>
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
    </div>
  )
}

