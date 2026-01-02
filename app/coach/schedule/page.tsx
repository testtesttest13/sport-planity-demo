'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Check, Plus, X, Clock, Save, HelpCircle, Calendar as CalendarIcon, Grid } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/components/providers/auth-provider'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { format, addDays, startOfWeek, getDay, startOfDay, isBefore, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from 'date-fns'
import { fr } from 'date-fns/locale'
import { HelpTour } from '@/components/help-tour'

const TIME_SLOTS = [
  '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00',
]

// Convert JavaScript day (0=Sunday, 1=Monday...) to SQL day (1=Monday, 2=Tuesday...)
function jsDayToSqlDay(jsDay: number): number {
  return jsDay === 0 ? 7 : jsDay
}

const helpSteps = [
  {
    title: 'Bienvenue ! 👋',
    content: 'Définissez vos horaires de disponibilité récurrents. Les créneaux sélectionnés s&apos;appliquent automatiquement à toutes les semaines.',
  },
  {
    title: '1️⃣ Choisissez un jour',
    content: 'Sélectionnez un jour de la semaine en cliquant sur une carte. Les jours passés sont désactivés. Utilisez les flèches pour naviguer entre les semaines.',
  },
  {
    title: '2️⃣ Sélectionnez vos horaires',
    content: 'Cliquez sur les créneaux horaires pour les activer ou les désactiver. Vous pouvez sélectionner plusieurs créneaux par jour. Les créneaux actifs apparaissent en vert.',
  },
  {
    title: '3️⃣ Enregistrez',
    content: 'Une fois vos modifications terminées, cliquez sur "Enregistrer" en haut à droite. Vos disponibilités seront immédiatement visibles pour vos clients.',
  },
]

type ViewMode = 'week' | 'calendar'

export default function CoachSchedulePage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const supabase = createClient()
  
  const [schedule, setSchedule] = useState<Map<number, Set<string>>>(new Map())
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }))
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [selectedDay, setSelectedDay] = useState<number>(() => {
    const today = new Date()
    const jsDay = today.getDay()
    return jsDayToSqlDay(jsDay)
  })
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [hasChanges, setHasChanges] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [coachId, setCoachId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('week')

  // Generate week days with real dates
  const weekDays = useMemo(() => {
    const days: Array<{ sqlDay: number; jsDay: number; date: Date; label: string; short: string }> = []
    const dayNames = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
    const shortNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
    
    for (let i = 0; i < 7; i++) {
      const date = addDays(currentWeekStart, i)
      const jsDay = getDay(date)
      const sqlDay = jsDayToSqlDay(jsDay)
      days.push({
        sqlDay,
        jsDay,
        date,
        label: dayNames[i],
        short: shortNames[i],
      })
    }
    
    return days
  }, [currentWeekStart])

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
    const calendarEnd = startOfWeek(addDays(monthEnd, 6), { weekStartsOn: 1 })
    
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd })
  }, [currentMonth])

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      router.push('/')
      return
    }

    loadCoachData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, router])

  const loadCoachData = async () => {
    if (!user) return

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!profile || profile.role !== 'coach') {
        router.push('/')
        return
      }

      const { data: coachData, error: coachError } = await supabase
        .from('coaches')
        .select('id')
        .eq('profile_id', user.id)
        .single()

      if (coachError || !coachData) {
        console.error('Error loading coach:', coachError)
        toast.error('Erreur', { description: 'Coach non trouvé.' })
        setLoading(false)
        return
      }

      setCoachId(coachData.id)

      // Load availability
      const { data: availabilityData } = await supabase
        .from('coach_availability')
        .select('day_of_week, time_slot')
        .eq('coach_id', coachData.id)
        .eq('is_available', true)

      if (availabilityData) {
        const scheduleMap = new Map<number, Set<string>>()
        availabilityData.forEach((av: any) => {
          const day = av.day_of_week
          const time = av.time_slot.substring(0, 5)
          
          if (!scheduleMap.has(day)) {
            scheduleMap.set(day, new Set())
          }
          scheduleMap.get(day)!.add(time)
        })

        setSchedule(scheduleMap)
      }
    } catch (error) {
      console.error('Error loading coach data:', error)
      toast.error('Erreur', { description: 'Erreur lors du chargement des données.' })
    } finally {
      setLoading(false)
    }
  }

  const toggleSlot = (day: number, time: string) => {
    setHasChanges(true)
    setSchedule(prev => {
      const newSchedule = new Map<number, Set<string>>()
      
      prev.forEach((slots, d) => {
        if (d !== day) {
          newSchedule.set(d, new Set(slots))
        }
      })
      
      const currentDaySlots = prev.get(day) || new Set<string>()
      const newDaySlots = new Set(currentDaySlots)
      
      if (newDaySlots.has(time)) {
        newDaySlots.delete(time)
        if (newDaySlots.size > 0) {
          newSchedule.set(day, newDaySlots)
        }
      } else {
        newDaySlots.add(time)
        newSchedule.set(day, newDaySlots)
      }
      
      return newSchedule
    })
  }

  const toggleAllSlots = (enable: boolean) => {
    setHasChanges(true)
    setSchedule(prev => {
      const newSchedule = new Map<number, Set<string>>()
      
      prev.forEach((slots, day) => {
        if (day !== selectedDay) {
          newSchedule.set(day, new Set(slots))
        }
      })
      
      if (enable) {
        newSchedule.set(selectedDay, new Set(TIME_SLOTS))
      }
      
      return newSchedule
    })
  }

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeekStart(prev => {
      const newDate = new Date(prev)
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7))
      return newDate
    })
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev)
      if (direction === 'next') {
        newDate.setMonth(newDate.getMonth() + 1)
      } else {
        newDate.setMonth(newDate.getMonth() - 1)
      }
      return newDate
    })
  }

  const handleDateClick = (date: Date) => {
    const jsDay = date.getDay()
    const sqlDay = jsDayToSqlDay(jsDay)
    setSelectedDay(sqlDay)
    setSelectedDate(date)
    setViewMode('week')
    // Navigate to the week containing this date
    setCurrentWeekStart(startOfWeek(date, { weekStartsOn: 1 }))
  }

  const handleSave = async () => {
    if (!coachId) return

    setSaving(true)

    try {
      const { data: currentAvailability } = await supabase
        .from('coach_availability')
        .select('day_of_week, time_slot')
        .eq('coach_id', coachId)

      const currentMap = new Map<string, boolean>()
      currentAvailability?.forEach((av: any) => {
        const key = `${av.day_of_week}-${av.time_slot}`
        currentMap.set(key, true)
      })

      const newMap = new Map<string, boolean>()
      schedule.forEach((slots, day) => {
        slots.forEach(slot => {
          const timeSlot = slot.length === 5 ? `${slot}:00` : slot
          const key = `${day}-${timeSlot}`
          newMap.set(key, true)
        })
      })

      const toDelete: Array<{ day_of_week: number; time_slot: string }> = []
      currentMap.forEach((_, key) => {
        if (!newMap.has(key)) {
          const [day, time] = key.split('-')
          toDelete.push({ day_of_week: parseInt(day), time_slot: time })
        }
      })

      for (const slot of toDelete) {
        await supabase
          .from('coach_availability')
          .delete()
          .eq('coach_id', coachId)
          .eq('day_of_week', slot.day_of_week)
          .eq('time_slot', slot.time_slot)
      }

      const toInsert: Array<{ coach_id: string; day_of_week: number; time_slot: string; is_available: boolean }> = []
      newMap.forEach((_, key) => {
        if (!currentMap.has(key)) {
          const [day, time] = key.split('-')
          toInsert.push({
            coach_id: coachId,
            day_of_week: parseInt(day),
            time_slot: time,
            is_available: true,
          })
        }
      })

      if (toInsert.length > 0) {
        const { error: insertError } = await supabase.from('coach_availability').insert(toInsert)
        if (insertError) {
          console.error('Insert error:', insertError)
          throw insertError
        }
      }

      setHasChanges(false)
      toast.success('Disponibilités enregistrées', {
        description: 'Vos horaires ont été mis à jour avec succès.',
      })
      
      await loadCoachData()
    } catch (error: any) {
      console.error('Error saving schedule:', error)
      toast.error('Erreur', { 
        description: error.message || 'Erreur lors de l\'enregistrement.' 
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!user || !coachId) return null

  const currentDaySlots = schedule.get(selectedDay) || new Set<string>()
  const currentWeekDay = weekDays.find(d => d.sqlDay === selectedDay)
  const today = startOfDay(new Date())

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mes disponibilités</h1>
              <p className="text-sm text-gray-600 mt-1">
                Configurez vos horaires récurrents pour chaque jour de la semaine
              </p>
            </div>
            {hasChanges && (
              <Button 
                onClick={handleSave} 
                size="sm" 
                className="gap-2 shadow-lg"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Enregistrement...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Enregistrer</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* View Mode Toggle */}
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Mode d&apos;affichage</span>
              </div>
              <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode('week')}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    viewMode === 'week'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Grid className="w-4 h-4" />
                    <span className="hidden sm:inline">Semaine</span>
                  </div>
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    viewMode === 'calendar'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">Calendrier</span>
                  </div>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        <AnimatePresence mode="wait">
          {viewMode === 'week' ? (
            <motion.div
              key="week"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Week Navigation */}
              <Card className="shadow-sm">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() => navigateWeek('prev')}
                      className="p-2 rounded-xl hover:bg-gray-100 active:scale-95 transition-all"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 text-center px-4">
                      {format(currentWeekStart, 'd MMM', { locale: fr })} - {format(addDays(currentWeekStart, 6), 'd MMM yyyy', { locale: fr })}
                    </h3>
                    <button
                      onClick={() => navigateWeek('next')}
                      className="p-2 rounded-xl hover:bg-gray-100 active:scale-95 transition-all"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                  
                  {/* Day Selector */}
                  <div className="grid grid-cols-7 gap-2">
                    {weekDays.map((day) => {
                      const daySlots = schedule.get(day.sqlDay) || new Set<string>()
                      const slotsCount = daySlots.size
                      const isSelected = selectedDay === day.sqlDay
                      const dayStart = startOfDay(day.date)
                      const isPast = isBefore(dayStart, today) && !isSameDay(dayStart, today)
                      const isToday = isSameDay(dayStart, today)
                      
                      return (
                        <button
                          key={day.sqlDay}
                          onClick={() => !isPast && setSelectedDay(day.sqlDay)}
                          disabled={isPast}
                          className={cn(
                            'flex flex-col items-center px-2 py-3 rounded-xl border-2 transition-all',
                            isPast && 'opacity-40 cursor-not-allowed',
                            isSelected
                              ? 'border-blue-500 bg-blue-50 shadow-md'
                              : isPast
                              ? 'border-gray-100 bg-gray-50'
                              : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-sm',
                            isToday && !isPast && !isSelected && 'border-blue-200 bg-blue-50/50'
                          )}
                        >
                          <span className={cn(
                            'text-xs font-semibold mb-1',
                            isSelected ? 'text-blue-600' : isPast ? 'text-gray-400' : isToday ? 'text-blue-600' : 'text-gray-900'
                          )}>
                            {day.short}
                          </span>
                          <span className={cn(
                            'text-lg font-bold mb-1',
                            isSelected ? 'text-blue-700' : isPast ? 'text-gray-400' : isToday ? 'text-blue-700' : 'text-gray-900'
                          )}>
                            {day.date.getDate()}
                          </span>
                          <span className={cn('text-[10px] font-medium', isPast ? 'text-gray-400' : slotsCount > 0 ? 'text-green-600' : 'text-gray-400')}>
                            {isPast ? 'Passé' : slotsCount > 0 ? `${slotsCount} créneaux` : '—'}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Selected Day Info */}
              {currentWeekDay && (
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    {currentWeekDay.label} {currentWeekDay.date.getDate()}
                  </h2>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleAllSlots(true)}
                      className="text-xs h-8"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Tout
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleAllSlots(false)}
                      className="text-xs h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Rien
                    </Button>
                  </div>
                </div>
              )}

              {/* Time Slots Grid */}
              <Card className="shadow-sm">
                <CardContent className="p-4 sm:p-6">
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2 sm:gap-3">
                    {TIME_SLOTS.map((time) => {
                      const isSelected = currentDaySlots.has(time)
                      const hour = parseInt(time.split(':')[0])
                      
                      return (
                        <motion.button
                          key={time}
                          onClick={() => toggleSlot(selectedDay, time)}
                          whileTap={{ scale: 0.95 }}
                          className={cn(
                            'relative py-3 px-2 rounded-xl border-2 font-semibold text-sm transition-all',
                            isSelected
                              ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                              : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 text-gray-700'
                          )}
                        >
                          {hour}h
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center shadow-sm"
                            >
                              <Check className="w-3 h-3 text-white" />
                            </motion.div>
                          )}
                        </motion.button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Calendar View */}
              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => navigateMonth('prev')}
                      className="p-2 rounded-xl hover:bg-gray-100 active:scale-95 transition-all"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <CardTitle className="text-lg sm:text-xl">
                      {format(currentMonth, 'MMMM yyyy', { locale: fr })}
                    </CardTitle>
                    <button
                      onClick={() => navigateMonth('next')}
                      className="p-2 rounded-xl hover:bg-gray-100 active:scale-95 transition-all"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  {/* Weekday headers */}
                  <div className="grid grid-cols-7 gap-2 mb-2">
                    {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
                      <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  {/* Calendar grid */}
                  <div className="grid grid-cols-7 gap-2">
                    {calendarDays.map((date, idx) => {
                      const jsDay = date.getDay()
                      const sqlDay = jsDayToSqlDay(jsDay)
                      const daySlots = schedule.get(sqlDay) || new Set<string>()
                      const slotsCount = daySlots.size
                      const isCurrentMonth = isSameMonth(date, currentMonth)
                      const isToday = isSameDay(date, today)
                      const isSelected = isSameDay(date, selectedDate)
                      const isPast = isBefore(startOfDay(date), today) && !isToday
                      
                      return (
                        <button
                          key={idx}
                          onClick={() => !isPast && handleDateClick(date)}
                          disabled={isPast || !isCurrentMonth}
                          className={cn(
                            'aspect-square p-2 rounded-xl border-2 transition-all text-sm font-medium',
                            !isCurrentMonth && 'opacity-30',
                            isPast && 'opacity-40 cursor-not-allowed',
                            isSelected
                              ? 'border-blue-500 bg-blue-50 shadow-md'
                              : isToday
                              ? 'border-blue-200 bg-blue-50/50 hover:border-blue-300'
                              : !isPast && isCurrentMonth
                              ? 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-sm'
                              : 'border-gray-100 bg-gray-50',
                            slotsCount > 0 && 'relative'
                          )}
                        >
                          <div className={cn(
                            'text-center',
                            isSelected ? 'text-blue-700' : isToday ? 'text-blue-600' : 'text-gray-900'
                          )}>
                            {format(date, 'd')}
                          </div>
                          {slotsCount > 0 && (
                            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-green-500" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                  
                  {/* Legend */}
                  <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap items-center justify-center gap-4 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span>Disponibilités définies</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded border-2 border-blue-200 bg-blue-50" />
                      <span>Aujourd&apos;hui</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Time slots for selected day in calendar view */}
              {currentWeekDay && (
                <>
                  <div className="flex items-center justify-between px-1 mt-4">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                      {format(selectedDate, 'EEEE d MMMM', { locale: fr })}
                    </h2>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleAllSlots(true)}
                        className="text-xs h-8"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Tout
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleAllSlots(false)}
                        className="text-xs h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="w-3 h-3 mr-1" />
                        Rien
                      </Button>
                    </div>
                  </div>

                  <Card className="shadow-sm">
                    <CardContent className="p-4 sm:p-6">
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2 sm:gap-3">
                        {TIME_SLOTS.map((time) => {
                          const isSelected = currentDaySlots.has(time)
                          const hour = parseInt(time.split(':')[0])
                          
                          return (
                            <motion.button
                              key={time}
                              onClick={() => toggleSlot(selectedDay, time)}
                              whileTap={{ scale: 0.95 }}
                              className={cn(
                                'relative py-3 px-2 rounded-xl border-2 font-semibold text-sm transition-all',
                                isSelected
                                  ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 text-gray-700'
                              )}
                            >
                              {hour}h
                              {isSelected && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center shadow-sm"
                                >
                                  <Check className="w-3 h-3 text-white" />
                                </motion.div>
                              )}
                            </motion.button>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm sm:text-base text-blue-900 font-medium mb-1">
                Horaires récurrents
              </p>
              <p className="text-xs sm:text-sm text-blue-800 leading-relaxed">
                Les disponibilités que vous configurez s&apos;appliquent automatiquement à <strong>toutes les semaines</strong>. 
                Par exemple, si vous sélectionnez &quot;Lundi 9h-12h&quot;, ces créneaux seront disponibles tous les lundis.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Help Tour */}
      <HelpTour steps={helpSteps} />
    </div>
  )
}
