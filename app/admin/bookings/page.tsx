'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Calendar,
  ChevronLeft,
  Search,
  Filter,
  Euro,
  Clock,
  Check,
  X,
  User,
  Download,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/auth-provider'
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Booking {
  id: string
  coach_id: string
  client_id: string
  booking_date: string
  time_slot: string
  status: string
  total_price: number
  created_at: string
  client: {
    full_name: string | null
    avatar_url: string | null
    email: string
  }
  coach_name: string
}

interface Coach {
  profile_id: string
  profile: {
    full_name: string | null
  }
}

type Period = 'week' | 'month' | 'year' | 'all'
type Status = 'all' | 'confirmed' | 'pending' | 'cancelled'

export default function AdminBookingsPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const supabase = createClient()
  
  const [bookings, setBookings] = useState<Booking[]>([])
  const [coaches, setCoaches] = useState<Coach[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [period, setPeriod] = useState<Period>('month')
  const [statusFilter, setStatusFilter] = useState<Status>('all')
  const [coachFilter, setCoachFilter] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)

  // Date range picker
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')

  useEffect(() => {
    async function fetchData() {
      if (!user) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('role, club_id')
        .eq('id', user.id)
        .single()

      if (!profile || profile.role !== 'admin' || !profile.club_id) {
        router.push('/')
        return
      }

      // Fetch coaches
      const { data: coachesData } = await supabase
        .from('coaches')
        .select(`
          id,
          profile_id,
          profile:profiles!coaches_profile_id_fkey (
            full_name
          )
        `)
        .eq('club_id', profile.club_id)

      if (coachesData) {
        setCoaches(coachesData as unknown as Coach[])

        // Fetch bookings using coaches.id (not profile_id!)
        const coachIds = coachesData.map(c => c.id)
        
        if (coachIds.length === 0) {
          setBookings([])
          setLoading(false)
          return
        }
        
        const { data: bookingsData } = await supabase
          .from('bookings')
          .select(`
            id,
            coach_id,
            client_id,
            booking_date,
            time_slot,
            status,
            total_price,
            created_at,
            client:profiles!bookings_client_id_fkey (
              full_name,
              avatar_url,
              email
            )
          `)
          .in('coach_id', coachIds)
          .order('booking_date', { ascending: false })

        if (bookingsData) {
          // Add coach name to each booking
          const bookingsWithCoach = bookingsData.map(b => {
            const coach = coachesData.find(c => c.id === b.coach_id)
            // Handle profile as object or array
            const profile = coach?.profile
            let coachName = 'Coach'
            if (profile) {
              if (Array.isArray(profile)) {
                coachName = (profile[0] as { full_name?: string | null })?.full_name || 'Coach'
              } else {
                coachName = (profile as { full_name?: string | null })?.full_name || 'Coach'
              }
            }
            return {
              ...b,
              coach_name: coachName
            }
          })
          setBookings(bookingsWithCoach as unknown as Booking[])
        } else {
          setBookings([])
        }
      } else {
        setBookings([])
      }

      setLoading(false)
    }

    if (!authLoading) {
      fetchData()
    }
  }, [user, authLoading, supabase, router])

  // Filter bookings
  const getDateRange = () => {
    const now = new Date()
    if (period === 'week') {
      return { start: startOfWeek(now, { locale: fr }), end: endOfWeek(now, { locale: fr }) }
    } else if (period === 'month') {
      return { start: startOfMonth(now), end: endOfMonth(now) }
    } else if (period === 'year') {
      return { start: startOfYear(now), end: endOfYear(now) }
    } else if (customStart && customEnd) {
      return { start: parseISO(customStart), end: parseISO(customEnd) }
    }
    return null
  }

  const dateRange = getDateRange()
  
  const filteredBookings = bookings.filter(b => {
    // Date filter
    if (dateRange) {
      const bookingDate = new Date(b.booking_date)
      if (!isWithinInterval(bookingDate, { start: dateRange.start, end: dateRange.end })) {
        return false
      }
    }

    // Status filter
    if (statusFilter !== 'all' && b.status !== statusFilter) {
      return false
    }

    // Coach filter
    if (coachFilter !== 'all' && b.coach_id !== coachFilter) {
      return false
    }

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      return (
        b.client?.full_name?.toLowerCase().includes(search) ||
        b.client?.email?.toLowerCase().includes(search) ||
        b.coach_name?.toLowerCase().includes(search)
      )
    }

    return true
  })

  // Stats
  const totalRevenue = filteredBookings.reduce((sum, b) => sum + (b.total_price || 0), 0)
  const confirmedCount = filteredBookings.filter(b => b.status === 'confirmed').length
  const pendingCount = filteredBookings.filter(b => b.status === 'pending').length

  const formatTime = (time: string) => {
    const hour = time.split(':')[0]
    return `${parseInt(hour)}h`
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="p-2 -ml-2 rounded-xl hover:bg-gray-100">
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Réservations</h1>
                <p className="text-sm text-gray-500">{filteredBookings.length} résultats</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? 'bg-purple-50 border-purple-200' : ''}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Period Selector */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {[
            { value: 'week', label: 'Semaine' },
            { value: 'month', label: 'Mois' },
            { value: 'year', label: 'Année' },
            { value: 'all', label: 'Tout' },
          ].map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value as Period)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                period === p.value
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-2xl p-5 mb-6 border border-gray-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Statut</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as Status)}
                  className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-purple-500 outline-none"
                >
                  <option value="all">Tous</option>
                  <option value="confirmed">Confirmé</option>
                  <option value="pending">En attente</option>
                  <option value="cancelled">Annulé</option>
                </select>
              </div>

              {/* Coach Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Coach</label>
                <select
                  value={coachFilter}
                  onChange={(e) => setCoachFilter(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-purple-500 outline-none"
                >
                  <option value="all">Tous les coachs</option>
                  {coaches.map((coach) => (
                    <option key={coach.profile_id} value={coach.profile_id}>
                      {coach.profile?.full_name || 'Coach'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Custom Date Range */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Période personnalisée</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={customStart}
                    onChange={(e) => { setCustomStart(e.target.value); setPeriod('all'); }}
                    className="flex-1 px-3 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-purple-500 outline-none text-sm"
                  />
                  <input
                    type="date"
                    value={customEnd}
                    onChange={(e) => { setCustomEnd(e.target.value); setPeriod('all'); }}
                    className="flex-1 px-3 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-purple-500 outline-none text-sm"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un client ou coach..."
            className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-purple-500 outline-none"
          />
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-green-600 mb-1">
                <Euro className="w-5 h-5" />
                <span className="text-2xl font-bold">{totalRevenue}€</span>
              </div>
              <p className="text-sm text-gray-500">Revenus</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-blue-600 mb-1">
                <Check className="w-5 h-5" />
                <span className="text-2xl font-bold">{confirmedCount}</span>
              </div>
              <p className="text-sm text-gray-500">Confirmées</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-yellow-600 mb-1">
                <Clock className="w-5 h-5" />
                <span className="text-2xl font-bold">{pendingCount}</span>
              </div>
              <p className="text-sm text-gray-500">En attente</p>
            </CardContent>
          </Card>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Aucune réservation</h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'all' || coachFilter !== 'all'
                  ? 'Essayez de modifier vos filtres'
                  : 'Aucune réservation pour cette période'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredBookings.map((booking, idx) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.02 }}
              >
                <Card className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={booking.client?.avatar_url || ''} />
                          <AvatarFallback className="bg-gray-100">
                            {booking.client?.full_name?.charAt(0) || 'C'}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <p className="font-semibold text-slate-900">
                            {booking.client?.full_name || 'Client'}
                          </p>
                          <p className="text-sm text-gray-500">
                            avec {booking.coach_name}
                          </p>
                          <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {format(new Date(booking.booking_date), 'd MMM yyyy', { locale: fr })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {formatTime(booking.time_slot)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-xl font-bold text-slate-900">{booking.total_price}€</p>
                        <span className={`inline-block text-xs px-2.5 py-1 rounded-full font-medium mt-1 ${
                          booking.status === 'confirmed'
                            ? 'bg-green-100 text-green-700'
                            : booking.status === 'cancelled'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {booking.status === 'confirmed' ? 'Confirmé' : 
                           booking.status === 'cancelled' ? 'Annulé' : 'En attente'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

