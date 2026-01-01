'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Check, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useStore } from '@/lib/store'
import { mockCoaches } from '@/lib/mock-data'
import { DaySchedule } from '@/types'
import { cn } from '@/lib/utils'

const DAYS = [
  { id: 1, label: 'Lundi', short: 'Lun' },
  { id: 2, label: 'Mardi', short: 'Mar' },
  { id: 3, label: 'Mercredi', short: 'Mer' },
  { id: 4, label: 'Jeudi', short: 'Jeu' },
  { id: 5, label: 'Vendredi', short: 'Ven' },
  { id: 6, label: 'Samedi', short: 'Sam' },
  { id: 0, label: 'Dimanche', short: 'Dim' },
]

const TIME_SLOTS = [
  '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00',
]

export default function CoachSchedulePage() {
  const router = useRouter()
  const { currentUser } = useStore()
  const coach = mockCoaches.find((c) => c.id === currentUser?.coachId)
  
  // All hooks must be at the top before any conditions
  const [schedule, setSchedule] = useState<DaySchedule[]>(coach?.weeklySchedule || [])
  const [selectedDay, setSelectedDay] = useState<number>(1)
  const [hasChanges, setHasChanges] = useState(false)
  
  // Early returns after all hooks
  if (!currentUser || currentUser.role !== 'coach') {
    router.push('/')
    return null
  }

  if (!coach) return null

  const currentDaySchedule = schedule.find((s) => s.day === selectedDay)
  const currentSlots = currentDaySchedule?.slots || []

  const toggleSlot = (time: string) => {
    setHasChanges(true)
    setSchedule((prev) => {
      const daySchedule = prev.find((s) => s.day === selectedDay)
      
      if (daySchedule) {
        // Day exists, toggle the slot
        const hasSlot = daySchedule.slots.includes(time)
        return prev.map((s) =>
          s.day === selectedDay
            ? {
                ...s,
                slots: hasSlot
                  ? s.slots.filter((slot) => slot !== time)
                  : [...s.slots, time].sort(),
              }
            : s
        )
      } else {
        // Day doesn't exist, create it with this slot
        return [...prev, { day: selectedDay, slots: [time] }]
      }
    })
  }

  const toggleAllSlots = (enable: boolean) => {
    setHasChanges(true)
    setSchedule((prev) => {
      const daySchedule = prev.find((s) => s.day === selectedDay)
      
      if (enable) {
        if (daySchedule) {
          return prev.map((s) =>
            s.day === selectedDay ? { ...s, slots: [...TIME_SLOTS] } : s
          )
        } else {
          return [...prev, { day: selectedDay, slots: [...TIME_SLOTS] }]
        }
      } else {
        return prev.filter((s) => s.day !== selectedDay)
      }
    })
  }

  const handleSave = () => {
    // In a real app, this would save to backend
    alert('Planning enregistré avec succès !')
    setHasChanges(false)
    // Here you would update the coach in the store/backend
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-95 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold">Mon planning</h1>
              <p className="text-sm text-gray-600">Semaine type</p>
            </div>
          </div>
          {hasChanges && (
            <Button onClick={handleSave} size="sm" className="gap-2">
              <Check className="w-4 h-4" />
              Enregistrer
            </Button>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Day Selector */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {DAYS.map((day) => {
                const daySchedule = schedule.find((s) => s.day === day.id)
                const slotsCount = daySchedule?.slots.length || 0
                const isSelected = selectedDay === day.id
                
                return (
                  <button
                    key={day.id}
                    onClick={() => setSelectedDay(day.id)}
                    className={cn(
                      'flex flex-col items-center min-w-[80px] px-4 py-3 rounded-2xl border-2 transition-all active:scale-95',
                      isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <span
                      className={cn(
                        'text-sm font-semibold mb-1',
                        isSelected ? 'text-blue-600' : 'text-gray-900'
                      )}
                    >
                      {day.short}
                    </span>
                    <span className="text-xs text-gray-600">
                      {slotsCount > 0 ? `${slotsCount} créneaux` : 'Fermé'}
                    </span>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="flex gap-3 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleAllSlots(true)}
            className="flex-1"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tout sélectionner
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleAllSlots(false)}
            className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <X className="w-4 h-4 mr-2" />
            Tout désélectionner
          </Button>
        </div>

        {/* Time Slots Grid */}
        <Card>
          <CardHeader>
            <CardTitle>
              {DAYS.find((d) => d.id === selectedDay)?.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {TIME_SLOTS.map((time) => {
                const isSelected = currentSlots.includes(time)
                
                return (
                  <motion.button
                    key={time}
                    onClick={() => toggleSlot(time)}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      'relative py-4 px-4 rounded-xl border-2 font-semibold text-sm transition-all',
                      isSelected
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    )}
                  >
                    {time}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center"
                      >
                        <Check className="w-3 h-3 text-white" />
                      </motion.div>
                    )}
                  </motion.button>
                )
              })}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-sm text-blue-900">
                <strong>💡 Astuce:</strong> Sélectionnez les créneaux horaires où vous
                êtes disponible. Vos clients pourront réserver uniquement sur ces
                créneaux.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Résumé de la semaine</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {DAYS.map((day) => {
                const daySchedule = schedule.find((s) => s.day === day.id)
                const slotsCount = daySchedule?.slots.length || 0
                
                return (
                  <div
                    key={day.id}
                    className="flex items-center justify-between py-3 border-b last:border-0"
                  >
                    <span className="font-medium">{day.label}</span>
                    <span
                      className={cn(
                        'text-sm font-semibold',
                        slotsCount > 0 ? 'text-green-600' : 'text-gray-400'
                      )}
                    >
                      {slotsCount > 0 ? `${slotsCount} créneaux` : 'Fermé'}
                    </span>
                  </div>
                )
              })}
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Total heures/semaine</span>
                <span className="text-blue-600">
                  ~{schedule.reduce((sum, s) => sum + s.slots.length, 0)}h
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

