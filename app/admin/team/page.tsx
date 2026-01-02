'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Users,
  Mail,
  Copy,
  Star,
  Calendar,
  Euro,
  ChevronLeft,
  Search,
  TrendingUp,
  Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/auth-provider'
import { toast } from 'sonner'

interface Coach {
  id: string
  profile_id: string
  speciality: string
  hourly_rate: number
  rating: number
  review_count: number
  bio: string | null
  profile: {
    full_name: string | null
    avatar_url: string | null
    email: string
    phone: string | null
  }
  bookings_count: number
  revenue: number
}

interface Club {
  id: string
  name: string
  join_code: string | null
}

export default function AdminTeamPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const supabase = createClient()
  
  const [club, setClub] = useState<Club | null>(null)
  const [coaches, setCoaches] = useState<Coach[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [showInvite, setShowInvite] = useState(false)

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

      // Fetch club
      const { data: clubData } = await supabase
        .from('clubs')
        .select('id, name, join_code')
        .eq('id', profile.club_id)
        .single()

      if (clubData) {
        setClub(clubData)
      }

      // Fetch coaches with stats
      const { data: coachesData } = await supabase
        .from('coaches')
        .select(`
          id,
          profile_id,
          speciality,
          hourly_rate,
          rating,
          review_count,
          bio,
          profile:profiles!coaches_profile_id_fkey (
            full_name,
            avatar_url,
            email,
            phone
          )
        `)
        .eq('club_id', profile.club_id)

      if (coachesData) {
        // Fetch bookings count for each coach
        const coachesWithStats = await Promise.all(
          coachesData.map(async (coach) => {
            const { count, data: bookingsData } = await supabase
              .from('bookings')
              .select('total_price', { count: 'exact' })
              .eq('coach_id', coach.profile_id)

            const revenue = bookingsData?.reduce((sum, b) => sum + (b.total_price || 0), 0) || 0

            return {
              ...coach,
              bookings_count: count || 0,
              revenue,
            }
          })
        )

        setCoaches(coachesWithStats as unknown as Coach[])
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

  const handleInvite = async () => {
    if (!inviteEmail || !club) return

    try {
      const response = await fetch('/api/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: inviteEmail,
          clubId: club.id,
          clubName: club.name,
          joinCode: club.join_code,
        }),
      })

      if (response.ok) {
        toast.success('Invitation envoyée !', {
          description: `Un email a été envoyé à ${inviteEmail}`,
        })
        setInviteEmail('')
        setShowInvite(false)
      } else {
        toast.error('Erreur lors de l\'envoi')
      }
    } catch (error) {
      toast.error('Erreur lors de l\'envoi')
    }
  }

  const filteredCoaches = coaches.filter(coach =>
    coach.profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coach.profile?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coach.speciality?.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
                <h1 className="text-xl font-bold text-slate-900">Mon équipe</h1>
                <p className="text-sm text-gray-500">{coaches.length} coachs</p>
              </div>
            </div>
            <Button onClick={() => setShowInvite(true)} className="bg-purple-600 hover:bg-purple-700">
              <Mail className="w-4 h-4 mr-2" />
              Inviter
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Join Code Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-5 text-white mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm mb-1">Code d&apos;invitation pour vos coachs</p>
              <p className="text-3xl font-bold tracking-widest">{club?.join_code || '-----'}</p>
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
        </motion.div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un coach..."
            className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-purple-500 outline-none"
          />
        </div>

        {/* Coaches List */}
        {filteredCoaches.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {searchTerm ? 'Aucun résultat' : 'Aucun coach'}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm 
                  ? 'Essayez une autre recherche'
                  : 'Partagez votre code d\'invitation avec vos coachs'
                }
              </p>
              {!searchTerm && (
                <Button onClick={copyJoinCode} variant="outline">
                  <Copy className="w-4 h-4 mr-2" />
                  Copier le code
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredCoaches.map((coach, idx) => (
              <motion.div
                key={coach.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="p-5">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={coach.profile?.avatar_url || ''} />
                          <AvatarFallback className="bg-purple-100 text-purple-600 text-xl">
                            {coach.profile?.full_name?.charAt(0) || 'C'}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-bold text-slate-900">
                                {coach.profile?.full_name || 'Coach'}
                              </h3>
                              <p className="text-purple-600 font-medium">{coach.speciality}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-slate-900">{coach.hourly_rate}€</p>
                              <p className="text-sm text-gray-500">/heure</p>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-500 mt-1">{coach.profile?.email}</p>
                          
                          {coach.bio && (
                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{coach.bio}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Stats Bar */}
                    <div className="grid grid-cols-3 divide-x divide-gray-100 border-t border-gray-100 bg-gray-50">
                      <div className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5 text-yellow-600 mb-1">
                          <Star className="w-4 h-4 fill-yellow-400" />
                          <span className="font-bold">{coach.rating || '-'}</span>
                        </div>
                        <p className="text-xs text-gray-500">{coach.review_count} avis</p>
                      </div>
                      <div className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5 text-blue-600 mb-1">
                          <Calendar className="w-4 h-4" />
                          <span className="font-bold">{coach.bookings_count}</span>
                        </div>
                        <p className="text-xs text-gray-500">réservations</p>
                      </div>
                      <div className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5 text-green-600 mb-1">
                          <Euro className="w-4 h-4" />
                          <span className="font-bold">{coach.revenue}€</span>
                        </div>
                        <p className="text-xs text-gray-500">revenus</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {showInvite && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-bold text-slate-900 mb-2">Inviter un coach</h3>
            <p className="text-gray-600 text-sm mb-6">
              Envoyez une invitation par email avec le code de votre club.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email du coach
                </label>
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-purple-500">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="coach@example.com"
                    className="flex-1 bg-transparent border-none outline-none"
                  />
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-xl">
                <p className="text-sm text-purple-900">
                  <strong>Code inclus :</strong> {club?.join_code}
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowInvite(false)}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleInvite}
                  disabled={!inviteEmail}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  Envoyer
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
