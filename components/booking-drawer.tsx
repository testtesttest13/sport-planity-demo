'use client'

import { useState, useEffect } from 'react'
import { Drawer } from 'vaul'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { format, addDays, isSameDay } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Calendar, Clock, CreditCard, X, ChevronLeft, Check, Wallet, Store } from 'lucide-react'
import { Coach } from '@/types'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/auth-provider'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface BookingDrawerProps {
  coach: Coach | null
  open: boolean
  onOpenChange: (open: boolean) => void
  clubName: string
}

type BookingStep = 'date-time' | 'confirmation' | 'success'

// Helper function to format time from "14:00:00" to "14h"
function formatTime(timeSlot: string): string {
  const [hours] = timeSlot.split(':')
  return `${hours}h`
}

export function BookingDrawer({ coach, open, onOpenChange, clubName }: BookingDrawerProps) {
  const [step, setStep] = useState<BookingStep>('date-time')
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [bookedSlots, setBookedSlots] = useState<string[]>([])
  const [paymentMethod, setPaymentMethod] = useState<'on_site' | 'online'>('on_site')
  
  const { user } = useAuth()
  const supabase = createClient()

  // Generate next 7 days starting from today
  const today = new Date()
  const dates = Array.from({ length: 7 }, (_, i) => addDays(today, i))

  // Convert JavaScript day (0=Sunday, 1=Monday...) to SQL day (1=Monday, 2=Tuesday...)
  const jsDayToSqlDay = (jsDay: number): number => {
    return jsDay === 0 ? 7 : jsDay // Sunday 0 -> 7, Monday 1 -> 1, etc.
  }

  // Load available slots from coach_availability and booked slots from bookings
  useEffect(() => {
    async function loadSlots() {
      if (!coach || !open) return

      const jsDay = selectedDate.getDay()
      const sqlDay = jsDayToSqlDay(jsDay) // Convert to SQL format (1=Monday, 7=Sunday)
      const dateStr = format(selectedDate, 'yyyy-MM-dd')

      try {
        // Load coach availability for this day
        // IMPORTANT: coach_id in coach_availability refers to coaches.id (not profile_id)
        const { data: availability, error: availabilityError } = await supabase
          .from('coach_availability')
          .select('time_slot')
          .eq('coach_id', coach.id) // coach.id is coaches.id from club page
          .eq('day_of_week', sqlDay) // Use SQL day format (1=Monday, 7=Sunday)
          .eq('is_available', true)

        if (availabilityError) {
          console.error('Error loading availability:', availabilityError)
          console.error('Coach ID used:', coach.id)
          console.error('SQL Day used:', sqlDay)
        } else {
          console.log('Availability loaded:', availability?.length || 0, 'slots for day', sqlDay, 'coach', coach.id)
        }

        // Load booked slots for this date
        const { data: bookings, error: bookingsError } = await supabase
          .from('bookings')
          .select('time_slot')
          .eq('coach_id', coach.id)
          .eq('booking_date', dateStr)
          .neq('status', 'cancelled')

        if (bookingsError) {
          console.error('Error loading bookings:', bookingsError)
        }

        // Get available time slots - normalize format (remove seconds if present)
        const allSlots = (availability || []).map((a: any) => {
          const time = a.time_slot
          // Normalize: "14:00:00" -> "14:00", "14:00" -> "14:00"
          return time.length > 5 ? time.substring(0, 5) : time
        })
        const booked = (bookings || []).map((b: any) => {
          const time = b.time_slot
          // Normalize: "14:00:00" -> "14:00", "14:00" -> "14:00"
          return time.length > 5 ? time.substring(0, 5) : time
        })
        setBookedSlots(booked)

        // Filter out booked slots (normalized comparison)
        let slots = allSlots.filter((slot: string) => !booked.includes(slot))

        // Filter out past time slots if it's today
        const now = new Date()
        const isToday = format(selectedDate, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd')

        if (isToday) {
          const currentHour = now.getHours()
          const currentMinute = now.getMinutes()

          slots = slots.filter((slot: string) => {
            const [slotHour, slotMinute] = slot.split(':').map(Number)
            // Keep slot only if it's at least 1 hour in the future
            if (slotHour > currentHour + 1) return true
            if (slotHour === currentHour + 1 && slotMinute >= currentMinute) return true
            return false
          })
        }

        // Sort slots
        slots.sort()
        setAvailableSlots(slots)
      } catch (error) {
        console.error('Error loading slots:', error)
      }
    }

    loadSlots()
  }, [coach, selectedDate, open, supabase])

  const handleConfirmBooking = async () => {
    if (!coach || !selectedTime || !user) return

    setLoading(true)

    try {
      const bookingDate = format(selectedDate, 'yyyy-MM-dd')
      
      // Ensure time_slot format is consistent (with seconds for DB)
      const timeSlotForDB = selectedTime.length === 5 ? `${selectedTime}:00` : selectedTime

      // Double-check that the slot is still available (prevent race conditions)
      const { data: existingBooking } = await supabase
        .from('bookings')
        .select('id')
        .eq('coach_id', coach.id)
        .eq('booking_date', bookingDate)
        .eq('time_slot', timeSlotForDB)
        .neq('status', 'cancelled')
        .single()

      if (existingBooking) {
        toast.error('Créneau déjà réservé', {
          description: 'Ce créneau a été réservé entre-temps. Veuillez en choisir un autre.',
        })
        setLoading(false)
        // Refresh available slots
        const jsDay = selectedDate.getDay()
        const sqlDay = jsDayToSqlDay(jsDay)
        const { data: availability } = await supabase
          .from('coach_availability')
          .select('time_slot')
          .eq('coach_id', coach.id)
          .eq('day_of_week', sqlDay)
          .eq('is_available', true)

        const { data: bookings } = await supabase
          .from('bookings')
          .select('time_slot')
          .eq('coach_id', coach.id)
          .eq('booking_date', bookingDate)
          .neq('status', 'cancelled')

        const allSlots = (availability || []).map((a: any) => {
          const time = a.time_slot
          return time.length > 5 ? time.substring(0, 5) : time
        })
        const booked = (bookings || []).map((b: any) => {
          const time = b.time_slot
          return time.length > 5 ? time.substring(0, 5) : time
        })
        const availableSlots = allSlots.filter((slot: string) => !booked.includes(slot))
        setAvailableSlots(availableSlots.sort())
        setSelectedTime(null)
        return
      }

      const { data, error } = await supabase
        .from('bookings')
        .insert({
          client_id: user.id,
          coach_id: coach.id,
          club_id: coach.clubId,
          booking_date: bookingDate,
          time_slot: timeSlotForDB,
          duration_minutes: 60,
          status: 'confirmed',
          total_price: coach.hourlyRate,
          payment_method: paymentMethod,
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating booking:', error)
        
        // Check if it's a duplicate key error
        if (error.code === '23505' || error.message.includes('duplicate key')) {
          toast.error('Créneau déjà réservé', {
            description: 'Ce créneau a été réservé entre-temps. Veuillez en choisir un autre.',
          })
          // Refresh available slots
          const jsDay = selectedDate.getDay()
          const sqlDay = jsDayToSqlDay(jsDay)
          const { data: availability } = await supabase
            .from('coach_availability')
            .select('time_slot')
            .eq('coach_id', coach.id)
            .eq('day_of_week', sqlDay)
            .eq('is_available', true)

          const { data: bookings } = await supabase
            .from('bookings')
            .select('time_slot')
            .eq('coach_id', coach.id)
            .eq('booking_date', bookingDate)
            .neq('status', 'cancelled')

          const allSlots = (availability || []).map((a: any) => {
            const time = a.time_slot
            return time.length > 5 ? time.substring(0, 5) : time
          })
          const booked = (bookings || []).map((b: any) => {
            const time = b.time_slot
            return time.length > 5 ? time.substring(0, 5) : time
          })
          const availableSlots = allSlots.filter((slot: string) => !booked.includes(slot))
          setAvailableSlots(availableSlots.sort())
          setSelectedTime(null)
        } else {
          toast.error('Erreur', {
            description: error.message || 'Impossible de créer la réservation.',
          })
        }
        setLoading(false)
        return
      }

      toast.success('Réservation confirmée !', {
        description: 'Votre cours a été réservé avec succès.',
      })

      setStep('success')
    } catch (error) {
      console.error('Error:', error)
      toast.error('Erreur', {
        description: 'Une erreur est survenue lors de la réservation.',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    // Reset after animation
    setTimeout(() => {
      setStep('date-time')
      setSelectedTime(null)
      setSelectedDate(new Date())
      setPaymentMethod('on_site')
    }, 300)
  }

  if (!coach) return null

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-[2rem] max-h-[90vh] overflow-hidden outline-none">
          {/* Handle */}
          <div className="flex justify-center pt-4 pb-2">
            <div className="w-12 h-1.5 rounded-full bg-gray-300" />
          </div>

          {/* Header */}
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
            {step !== 'date-time' && step !== 'success' && (
              <button
                onClick={() => setStep('date-time')}
                className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-95 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <h2 className="text-lg font-bold flex-1 text-center">
              {step === 'date-time' && 'Choisir un créneau'}
              {step === 'confirmation' && 'Confirmer la réservation'}
              {step === 'success' && 'Réservation confirmée'}
            </h2>
            <button
              onClick={handleClose}
              className="p-2 -mr-2 rounded-full hover:bg-gray-100 active:scale-95 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-120px)] px-6 pb-6">
            <AnimatePresence mode="wait">
              {/* Step 1: Date & Time Selection */}
              {step === 'date-time' && (
                <motion.div
                  key="date-time"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6 pt-4"
                >
                  {/* Coach Info Card */}
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={coach.photoUrl}
                        alt={coach.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg">{coach.name}</h3>
                      <p className="text-sm text-gray-600">{clubName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">{coach.hourlyRate}€</p>
                      <p className="text-xs text-gray-500">/ heure</p>
                    </div>
                  </div>

                  {/* Date Selector */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-5 h-5 text-gray-600" />
                      <h3 className="font-semibold text-base">Date</h3>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
                      {dates.map((date) => {
                        const isSelected = isSameDay(date, selectedDate)
                        const now = new Date()
                        const isPast = date < now && !isSameDay(date, now)
                        
                        return (
                          <button
                            key={date.toISOString()}
                            onClick={() => {
                              setSelectedDate(date)
                              setSelectedTime(null)
                            }}
                            disabled={isPast}
                            className={cn(
                              'flex flex-col items-center justify-center min-w-[70px] h-20 rounded-2xl border-2 transition-all active:scale-95',
                              isSelected
                                ? 'border-blue-500 bg-blue-50'
                                : isPast
                                ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                                : 'border-gray-200 hover:border-gray-300'
                            )}
                          >
                            <span className="text-xs text-gray-600 uppercase font-medium">
                              {format(date, 'EEE', { locale: fr })}
                            </span>
                            <span
                              className={cn(
                                'text-xl font-bold mt-1',
                                isSelected ? 'text-blue-600' : 'text-gray-900'
                              )}
                            >
                              {format(date, 'd')}
                            </span>
                            <span className="text-xs text-gray-500">
                              {format(date, 'MMM', { locale: fr })}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Time Slots */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-5 h-5 text-gray-600" />
                      <h3 className="font-semibold text-base">Horaire</h3>
                    </div>
                    {availableSlots.length > 0 ? (
                      <div className="grid grid-cols-3 gap-3">
                        {availableSlots.map((slot) => {
                          const isSelected = selectedTime === slot
                          return (
                            <button
                              key={slot}
                              onClick={() => setSelectedTime(slot)}
                              className={cn(
                                'py-3 px-4 rounded-xl border-2 font-semibold text-sm transition-all active:scale-95',
                                isSelected
                                  ? 'border-green-500 bg-green-50 text-green-700'
                                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
                              )}
                            >
                              {formatTime(slot)}
                            </button>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8 px-4 bg-gray-50 rounded-2xl">
                        <p className="text-gray-600">
                          Aucun créneau disponible pour cette date
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Continue Button */}
                  <Button
                    onClick={() => setStep('confirmation')}
                    disabled={!selectedTime}
                    className="w-full h-14 text-base mt-4"
                  >
                    Continuer
                  </Button>
                </motion.div>
              )}

              {/* Step 2: Confirmation */}
              {step === 'confirmation' && (
                <motion.div
                  key="confirmation"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6 pt-4"
                >
                  {/* Summary Card */}
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl border-2 border-blue-100 space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                        <Image
                          src={coach.photoUrl}
                          alt={coach.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-xl">{coach.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{clubName}</p>
                        <p className="text-sm text-gray-600">{coach.speciality}</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-blue-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 font-medium">Date</span>
                        <span className="font-semibold">
                          {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 font-medium">Heure</span>
                        <span className="font-semibold">{selectedTime ? formatTime(selectedTime) : ''}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-blue-200">
                        <span className="text-gray-900 font-bold text-lg">Total</span>
                        <span className="font-bold text-2xl text-blue-600">
                          {coach.hourlyRate}€
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method Selection */}
                  <div>
                    <h3 className="font-semibold text-base mb-3">Méthode de paiement</h3>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <button
                        onClick={() => setPaymentMethod('on_site')}
                        className={cn(
                          'p-4 rounded-xl border-2 transition-all text-left',
                          paymentMethod === 'on_site'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            'p-2 rounded-lg',
                            paymentMethod === 'on_site' ? 'bg-blue-100' : 'bg-gray-100'
                          )}>
                            <Store className={cn(
                              'w-5 h-5',
                              paymentMethod === 'on_site' ? 'text-blue-600' : 'text-gray-600'
                            )} />
                          </div>
                          <div>
                            <p className={cn(
                              'font-semibold',
                              paymentMethod === 'on_site' ? 'text-blue-700' : 'text-gray-900'
                            )}>
                              Sur place
                            </p>
                            <p className="text-xs text-gray-600">Paiement au club</p>
                          </div>
                        </div>
                      </button>
                      <button
                        onClick={() => setPaymentMethod('online')}
                        className={cn(
                          'p-4 rounded-xl border-2 transition-all text-left',
                          paymentMethod === 'online'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            'p-2 rounded-lg',
                            paymentMethod === 'online' ? 'bg-blue-100' : 'bg-gray-100'
                          )}>
                            <CreditCard className={cn(
                              'w-5 h-5',
                              paymentMethod === 'online' ? 'text-blue-600' : 'text-gray-600'
                            )} />
                          </div>
                          <div>
                            <p className={cn(
                              'font-semibold',
                              paymentMethod === 'online' ? 'text-blue-700' : 'text-gray-900'
                            )}>
                              En ligne
                            </p>
                            <p className="text-xs text-gray-600">Carte bancaire</p>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Payment Button */}
                  <Button
                    onClick={handleConfirmBooking}
                    disabled={loading}
                    className={cn(
                      'w-full h-14 text-base flex items-center justify-center gap-2',
                      paymentMethod === 'online'
                        ? 'bg-black hover:bg-gray-800'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                    )}
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Réservation en cours...
                      </>
                    ) : paymentMethod === 'online' ? (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Payer {coach.hourlyRate}€ maintenant
                      </>
                    ) : (
                      <>
                        <Wallet className="w-5 h-5" />
                        Réserver (payer sur place)
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-gray-500 px-4">
                    En confirmant, vous acceptez les conditions d&apos;utilisation et la
                    politique d&apos;annulation
                  </p>
                </motion.div>
              )}

              {/* Step 3: Success */}
              {step === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 space-y-6 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mx-auto"
                  >
                    <Check className="w-12 h-12 text-green-600" />
                  </motion.div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">Réservation confirmée !</h3>
                    <p className="text-gray-600">
                      Votre cours avec {coach.name} est confirmé pour le{' '}
                      {format(selectedDate, 'd MMMM', { locale: fr })} à {selectedTime ? formatTime(selectedTime) : ''}
                    </p>
                  </div>

                  <Button onClick={handleClose} className="w-full h-14 text-base">
                    Terminer
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
