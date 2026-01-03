'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User, Mail, Phone, Edit, LogOut, Building2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useAuth } from '@/components/providers/auth-provider'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

interface Profile {
  full_name: string | null
  email: string | null
  phone: string | null
  avatar_url: string | null
  sport: string | null
  discovery_source: string | null
  role: string | null
  club_id: string | null
  club_name: string | null
}

const sportLabels: Record<string, string> = {
  tennis: '🎾 Tennis',
  padel: '🏐 Padel',
  yoga: '🧘 Yoga',
  boxe: '🥊 Boxe',
  fitness: '💪 Fitness',
}

const discoveryLabels: Record<string, string> = {
  google: '🔍 Google',
  amis: '👥 Amis',
  pub: '📢 Publicité',
  autre: '💭 Autre',
}

export default function AccountPage() {
  const router = useRouter()
  const { user, loading: authLoading, signOut } = useAuth()
  const supabase = createClient()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
      return
    }

    if (user) {
      loadProfile()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, router])

  const loadProfile = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, email, phone, avatar_url, sport, discovery_source, role, club_id')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Error loading profile:', error)
      } else {
        let clubName = null
        if (data?.club_id) {
          const { data: clubData } = await supabase
            .from('clubs')
            .select('name')
            .eq('id', data.club_id)
            .single()
          clubName = clubData?.name || null
        }

        setProfile({
          full_name: data?.full_name || null,
          email: data?.email || user.email || null,
          phone: data?.phone || null,
          avatar_url: data?.avatar_url || null,
          sport: data?.sport || null,
          discovery_source: data?.discovery_source || null,
          role: data?.role || null,
          club_id: data?.club_id || null,
          club_name: clubName,
        })
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await signOut()
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
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

  // Use profile data if available, otherwise use user email
  const displayName = profile?.full_name || user.email?.split('@')[0] || 'Utilisateur'
  const displayEmail = profile?.email || user.email || ''

  // Check if onboarding is incomplete
  const isOnboardingIncomplete = !profile?.full_name || 
    profile.full_name === user.email || 
    profile.full_name.includes('@') ||
    !profile?.role

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-slate-900">Mon compte</h1>
            <Link
              href="/account/edit"
              className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <Edit className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-slate-900">Modifier</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="relative w-24 h-24 mx-auto mb-4">
            {profile?.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={displayName}
                fill
                className="rounded-full object-cover border-4 border-blue-600"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center border-4 border-blue-100">
                <span className="text-3xl font-bold text-white">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">{displayName}</h2>
          {displayEmail && (
            <p className="text-gray-600 text-sm">{displayEmail}</p>
          )}
        </motion.div>

        {/* Profile Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-6 border border-gray-200">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-lg text-slate-900 mb-4">
                Informations personnelles
              </h3>

              {/* Email */}
              <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">
                    Email
                  </p>
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {displayEmail || 'Non renseigné'}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">
                    Téléphone
                  </p>
                  <p className="text-sm font-medium text-slate-900">
                    {profile?.phone || 'Non renseigné'}
                  </p>
                </div>
              </div>

              {/* Club (for coaches/admins) or Sport (for clients) */}
              {profile?.role === 'coach' || profile?.role === 'admin' ? (
                profile?.club_name && (
                  <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 uppercase font-medium mb-1">
                        Club
                      </p>
                      <p className="text-sm font-medium text-slate-900">
                        {profile.club_name}
                      </p>
                    </div>
                  </div>
                )
              ) : (
                profile?.sport && (
                  <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">
                        {sportLabels[profile?.sport || '']?.split(' ')[0] || '🎾'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 uppercase font-medium mb-1">
                        Sport favori
                      </p>
                      <p className="text-sm font-medium text-slate-900">
                        {sportLabels[profile?.sport || ''] || profile?.sport}
                      </p>
                    </div>
                  </div>
                )
              )}

              {/* Discovery Source */}
              {profile?.discovery_source && (
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">
                      {discoveryLabels[profile?.discovery_source || '']?.split(' ')[0] || '💭'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 uppercase font-medium mb-1">
                      Comment avez-vous connu Simpl. ?
                    </p>
                    <p className="text-sm font-medium text-slate-900">
                      {discoveryLabels[profile?.discovery_source || ''] || profile?.discovery_source}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Onboarding Button (if incomplete) */}
        {isOnboardingIncomplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-6"
          >
            <Link href="/onboarding">
              <Button className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-base font-semibold shadow-lg">
                <span className="flex items-center justify-between w-full">
                  <span className="flex items-center gap-2">
                    Parlez-nous de vous
                  </span>
                  <ArrowRight className="w-5 h-5" />
                </span>
              </Button>
            </Link>
          </motion.div>
        )}

        {/* Edit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Link href="/account/edit">
            <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white">
              <Edit className="w-5 h-5 mr-2" />
              Modifier mon profil
            </Button>
          </Link>
        </motion.div>

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full h-12 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Déconnexion
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
