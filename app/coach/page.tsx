'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Calendar as CalendarIcon, Clock, User, Euro } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { useStore } from '@/lib/store'
import { mockCoaches, mockClubs } from '@/lib/mock-data'
import { format, startOfWeek, addDays } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function CoachDashboard() {
  const router = useRouter()
  const { currentUser, bookings } = useStore()
  
  if (!currentUser || currentUser.role !== 'coach') {
    router.push('/')
    return null
  }

  const coach = mockCoaches.find((c) => c.id === currentUser.coachId)
  const club = mockClubs.find((c) => c.id === currentUser.clubId)
  const coachBookings = bookings.filter((b) => b.coachId === currentUser.coachId)

  if (!coach || !club) return null

  // Generate week view
  const weekStart = startOfWeek(new Date(), { locale: fr, weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const timeSlots = [
    '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00',
  ]

  const getSlotStatus = (day: Date, time: string) => {
    const daySchedule = coach.weeklySchedule.find((s) => s.day === day.getDay())
    if (!daySchedule || !daySchedule.slots.includes(time)) {
      return 'unavailable'
    }
    
    const booking = coachBookings.find(
      (b) =>
        format(new Date(b.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd') &&
        b.time === time &&
        b.status !== 'cancelled'
    )
    
    return booking ? 'booked' : 'available'
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-6xl mx-auto px-6 pt-12 pb-8">

          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl">
              <Image
                src={coach.photoUrl}
                alt={coach.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{coach.name}</h1>
              <p className="text-blue-100 text-lg">{coach.speciality}</p>
              <p className="text-blue-100">{club.name}</p>
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
                    <p className="text-2xl font-bold">{coachBookings.length}</p>
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
                    <p className="text-2xl font-bold">{coach.hourlyRate}€</p>
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
                    <p className="text-2xl font-bold">{coach.reviewCount}</p>
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
                    <p className="text-2xl font-bold">{coach.rating}</p>
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
                {coachBookings.length === 0 ? (
                  <div className="text-center py-12">
                    <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">Aucune réservation pour le moment</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {coachBookings.map((booking) => {
                      const handleAddToCalendar = () => {
                        const startDate = new Date(booking.date)
                        const [hours, minutes] = booking.time.split(':')
                        startDate.setHours(parseInt(hours), parseInt(minutes))
                        
                        const endDate = new Date(startDate)
                        endDate.setHours(startDate.getHours() + 1)

                        const title = `Cours avec ${booking.clientName}`
                        const details = `Cours de tennis - ${club.name}`
                        
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

                      return (
                        <motion.div
                          key={booking.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                                {booking.clientName.charAt(0)}
                              </div>
                              <div>
                                <p className="font-bold text-lg">{booking.clientName}</p>
                                <p className="text-sm text-gray-600">Élève</p>
                              </div>
                            </div>
                            <Badge
                              className={
                                booking.status === 'confirmed'
                                  ? 'bg-green-100 text-green-700 border-0'
                                  : 'bg-yellow-100 text-yellow-700 border-0'
                              }
                            >
                              {booking.status === 'confirmed' ? '✓ Confirmé' : 'En attente'}
                            </Badge>
                          </div>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-gray-700">
                              <CalendarIcon className="w-4 h-4 text-gray-500" />
                              <span className="font-medium">
                                {format(new Date(booking.date), 'EEEE d MMMM yyyy', {
                                  locale: fr,
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700">
                              <Clock className="w-4 h-4 text-gray-500" />
                              <span className="font-medium">{booking.time} - {parseInt(booking.time.split(':')[0]) + 1}:00</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-blue-200">
                            <div>
                              <p className="text-sm text-gray-600">Montant</p>
                              <p className="font-bold text-xl text-blue-600">{booking.totalPrice}€</p>
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
        </Tabs>
      </div>
    </div>
  )
}

