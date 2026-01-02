'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Users,
  Calendar,
  Euro,
  TrendingUp,
  Copy,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Star,
  Building2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/auth-provider'
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval } from 'date-fns'
import { fr } from 'date-fns/locale'
import { toast } from 'sonner'

interface Club {
  id: string
  name: string
  cover_url: string | null
  logo_url: string | null
  join_code: string | null
  city: string | null
  rating: number
  review_count: number
}

interface Coach {
  id: string
  profile_id: string
  speciality: string
  hourly_rate: number
  rating: number
  review_count: number
  profile: {
    full_name: string | null
    avatar_url: string | null
    email: string
  }
}

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
  }
}

export default function AdminDashboard() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const supabase = createClient()
  
  const [club, setClub] = useState<Club | null>(null)
  const [coaches, setCoaches] = useState<Coach[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month')

  useEffect(() => {
    async function fetchData() {
      if (!user) return

      // Get profile with club_id
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, club_id')
        .eq('id', user.id)
        .single()

      if (!profile || profile.role !== 'admin' || !profile.club_id) {
        router.push('/')
        return
      }

      // Fetch club
      const { data: clubData } = await supabase
        .from('clubs')
        .select('*')
        .eq('id', profile.club_id)
        .single()

      if (clubData) {
        setClub(clubData)
      }

      // Fetch coaches with profiles
      const { data: coachesData } = await supabase
        .from('coaches')
        .select(`
          id,
          profile_id,
          speciality,
          hourly_rate,
          rating,
          review_count,
          profile:profiles!coaches_profile_id_fkey (
            full_name,
            avatar_url,
            email
          )
        `)
        .eq('club_id', profile.club_id)

      if (coachesData) {
        setCoaches(coachesData as unknown as Coach[])
      }

      // Fetch all bookings for coaches in this club
      if (coachesData && coachesData.length > 0) {
        const coachIds = coachesData.map(c => c.id) // Use coaches.id, not profile_id!
        
        if (coachIds.length === 0) {
          setBookings([])
        } else {
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
                avatar_url
              )
            `)
            .in('coach_id', coachIds)
            .order('booking_date', { ascending: false })

          if (bookingsData) {
            setBookings(bookingsData as unknown as Booking[])
          } else {
            setBookings([])
          }
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

  const copyJoinCode = () => {
    if (club?.join_code) {
      navigator.clipboard.writeText(club.join_code)
      toast.success('Code copié !')
    }
  }

  // Calculate stats based on period
  const getDateRange = () => {
    const now = new Date()
    if (period === 'week') {
      return { start: startOfWeek(now, { locale: fr }), end: endOfWeek(now, { locale: fr }) }
    } else if (period === 'month') {
      return { start: startOfMonth(now), end: endOfMonth(now) }
    } else {
      return { start: startOfYear(now), end: endOfYear(now) }
    }
  }

  const { start, end } = getDateRange()
  
  const periodBookings = bookings.filter(b => {
    const bookingDate = new Date(b.booking_date)
    return isWithinInterval(bookingDate, { start, end })
  })

  const totalRevenue = periodBookings.reduce((sum, b) => sum + (b.total_price || 0), 0)
  const confirmedBookings = periodBookings.filter(b => b.status === 'confirmed').length
  const pendingBookings = periodBookings.filter(b => b.status === 'pending').length

  // Recent bookings (last 5)
  const recentBookings = bookings.slice(0, 5)

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!club) return null

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white">
        <div className="max-w-6xl mx-auto px-6 pt-12 pb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              {club.logo_url ? (
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/30 shadow-lg">
                  <Image src={club.logo_url} alt={club.name} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold">{club.name}</h1>
                <p className="text-purple-200">{club.city || 'Mon club'}</p>
              </div>
            </div>
          </div>

          {/* Join Code Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm mb-1">Code d&apos;invitation coachs</p>
              <p className="text-2xl font-bold tracking-widest">{club.join_code || '-----'}</p>
            </div>
            <Button
              onClick={copyJoinCode}
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 text-white border-0"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copier
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-4">
        {/* Period Selector */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { value: 'week', label: 'Cette semaine' },
            { value: 'month', label: 'Ce mois' },
            { value: 'year', label: 'Cette année' },
          ].map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value as 'week' | 'month' | 'year')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                period === p.value
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-green-100">
                    <Euro className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                    <ArrowUpRight className="w-4 h-4" />
                    +12%
                  </div>
                </div>
                <p className="text-2xl font-bold text-slate-900">{totalRevenue}€</p>
                <p className="text-sm text-gray-500">Revenus</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-blue-100">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-slate-900">{confirmedBookings}</p>
                <p className="text-sm text-gray-500">Réservations confirmées</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-yellow-100">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-slate-900">{pendingBookings}</p>
                <p className="text-sm text-gray-500">En attente</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-purple-100">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-slate-900">{coaches.length}</p>
                <p className="text-sm text-gray-500">Coachs actifs</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Link href="/admin/team">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardContent className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-purple-100 group-hover:bg-purple-200 transition-colors">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Mon équipe</p>
                    <p className="text-sm text-gray-500">{coaches.length} coachs</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/bookings">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardContent className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-blue-100 group-hover:bg-blue-200 transition-colors">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Réservations</p>
                    <p className="text-sm text-gray-500">{bookings.length} total</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Team Preview */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Mon équipe</h2>
            <Link href="/admin/team" className="text-sm text-purple-600 font-medium hover:underline">
              Voir tout
            </Link>
          </div>
          
          {coaches.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Aucun coach dans votre équipe</p>
                <p className="text-sm text-gray-500 mb-4">
                  Partagez votre code <span className="font-bold text-purple-600">{club.join_code}</span> avec vos coachs
                </p>
                <Button onClick={copyJoinCode} variant="outline">
                  <Copy className="w-4 h-4 mr-2" />
                  Copier le code
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {coaches.map((coach) => (
                <Card key={coach.id} className="flex-shrink-0 w-48">
                  <CardContent className="p-4 text-center">
                    <Avatar className="w-16 h-16 mx-auto mb-3">
                      <AvatarImage src={coach.profile?.avatar_url || ''} />
                      <AvatarFallback className="bg-purple-100 text-purple-600 text-lg">
                        {coach.profile?.full_name?.charAt(0) || 'C'}
                      </AvatarFallback>
                    </Avatar>
                    <p className="font-semibold text-slate-900 truncate">
                      {coach.profile?.full_name || 'Coach'}
                    </p>
                    <p className="text-sm text-gray-500 mb-2">{coach.speciality}</p>
                    <div className="flex items-center justify-center gap-1 text-sm">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{coach.rating || '-'}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Recent Bookings */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Réservations récentes</h2>
            <Link href="/admin/bookings" className="text-sm text-purple-600 font-medium hover:underline">
              Voir tout
            </Link>
          </div>

          {recentBookings.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Aucune réservation pour le moment</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0 divide-y divide-gray-100">
                {recentBookings.map((booking) => {
                  const coach = coaches.find(c => c.id === booking.coach_id)
                  return (
                    <div key={booking.id} className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={booking.client?.avatar_url || ''} />
                          <AvatarFallback className="bg-gray-100">
                            {booking.client?.full_name?.charAt(0) || 'C'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-slate-900">
                            {booking.client?.full_name || 'Client'}
                          </p>
                          <p className="text-sm text-gray-500">
                            avec {coach?.profile?.full_name || 'Coach'} • {format(new Date(booking.booking_date), 'd MMM', { locale: fr })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-900">{booking.total_price}€</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          booking.status === 'confirmed' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {booking.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
