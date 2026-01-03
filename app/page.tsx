'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, MapPin, User, Star, LogIn, ArrowRight, Briefcase } from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { AuthDialog } from '@/components/auth-dialog'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

const categories = [
  { id: 'tennis', label: 'Tennis', icon: '🎾' },
  { id: 'padel', label: 'Padel', icon: '🏐' },
  { id: 'yoga', label: 'Yoga', icon: '🧘' },
  { id: 'boxe', label: 'Boxe', icon: '🥊' },
  { id: 'fitness', label: 'Fitness', icon: '💪' },
]

interface Club {
  id: string
  name: string
  city: string
  cover_url: string | null
  rating: number
  review_count: number
  sport: string | null
}

export default function HomePage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const supabase = createClient()
  
  const [clubs, setClubs] = useState<Club[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [authDialogOpen, setAuthDialogOpen] = useState(false)
  const [userProfile, setUserProfile] = useState<{ avatar_url: string | null; role: string | null } | null>(null)

  // Fetch user profile for avatar
  useEffect(() => {
    async function fetchUserProfile() {
      if (!user) {
        setUserProfile(null)
        return
      }

      try {
        const { data } = await supabase
          .from('profiles')
          .select('avatar_url, role')
          .eq('id', user.id)
          .single()

        if (data) {
          setUserProfile(data)
        }
      } catch (error) {
        console.error('Error fetching user profile:', error)
      }
    }

    fetchUserProfile()
  }, [user, supabase])

  // Fetch clubs from Supabase (accessible without auth)
  useEffect(() => {
    async function fetchClubs() {
      try {
        const { data, error } = await supabase
          .from('clubs')
          .select('id, name, city, cover_url, rating, review_count, sport')
          .order('rating', { ascending: false })

        if (error) {
          console.error('Error fetching clubs:', error)
        } else {
          setClubs(data || [])
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchClubs()
  }, [supabase])

  const filteredClubs = clubs.filter((club) => {
    const matchesCategory = !selectedCategory || club.sport === selectedCategory
    const matchesSearch = !searchQuery || 
      club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.city.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleClubClick = (clubId: string) => {
    if (!user) {
      setAuthDialogOpen(true)
      return
    }
    router.push(`/club/${clubId}`)
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold text-blue-600">
              Simpl.
            </Link>

            {/* User Menu / Auth Button */}
            {user ? (
              <div className="flex items-center gap-3">
                {/* CTA "Je suis pro" pour les clients seulement */}
                {userProfile?.role === 'client' && (
                  <Link
                    href="/pro"
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
                  >
                    <Briefcase className="w-4 h-4" />
                    <span>Je suis pro</span>
                  </Link>
                )}
                {/* Avatar ou icône User */}
                <Link
                  href="/account"
                  className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-gray-200 hover:border-gray-300 transition-colors overflow-hidden"
                >
                  {userProfile?.avatar_url ? (
                    <Avatar className="w-full h-full">
                      <AvatarImage src={userProfile.avatar_url} alt="Profile" />
                      <AvatarFallback>
                        <User className="w-5 h-5 text-gray-600" />
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                  )}
                </Link>
              </div>
            ) : (
              <Button
                onClick={() => setAuthDialogOpen(true)}
                variant="outline"
                className="gap-2"
              >
                <LogIn className="w-4 h-4" />
                Connexion
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section for non-authenticated users */}
        {!user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Réservez votre coach
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Trouvez les meilleurs coachs sportifs près de chez vous et réservez en quelques clics.
            </p>
          </motion.div>
        )}

        {/* Search Pill */}
        <div className="flex justify-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-3xl"
          >
            <div className="bg-white border border-gray-200 rounded-full shadow-lg hover:shadow-xl transition-shadow p-2">
              <div className="flex items-center gap-3 px-4">
                <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Rechercher un club ou une ville..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-slate-900 placeholder:text-gray-400 py-2"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === category.id ? null : category.id
                  )
                }
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all ${
                  selectedCategory === category.id
                    ? 'border-blue-600 bg-blue-50 text-blue-600'
                    : 'border-gray-200 bg-white text-slate-700 hover:border-gray-300'
                }`}
              >
                <span className="text-xl">{category.icon}</span>
                <span className="text-sm font-medium whitespace-nowrap">
                  {category.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Clubs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredClubs.map((club, idx) => (
            <motion.div
              key={club.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <div 
                onClick={() => handleClubClick(club.id)}
                className="group cursor-pointer"
              >
                {/* Image */}
                <div className="relative aspect-square rounded-2xl overflow-hidden mb-3">
                  <Image
                    src={club.cover_url || '/placeholder-club.jpg'}
                    alt={club.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {!user && (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                        <span className="text-sm font-medium text-slate-900">Voir le club</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-slate-900 text-base truncate flex-1">
                      {club.name}
                    </h3>
                    {club.rating > 0 && (
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium text-slate-900">
                          {club.rating.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {club.city}
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <p className="text-sm text-gray-500">
                      {club.review_count} avis
                    </p>
                    <p className="text-sm font-semibold text-slate-900">
                      À partir de 50€/h
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredClubs.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-600 text-lg">
              {selectedCategory
                ? 'Aucun club trouvé pour cette catégorie'
                : 'Aucun club disponible'}
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Essayez une autre recherche ou catégorie
            </p>
          </div>
        )}
      </main>

      {/* Pro Section */}
      <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-16 sm:py-20 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-gray-100"
            >
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                  Vous êtes Coach ou Gérant de Club ?
                </h2>
                <p className="text-lg text-slate-600 mb-8">
                  Découvrez comment Simpl. révolutionne votre quotidien.
                </p>
                <Link href="/pro">
                  <Button size="lg" className="h-12 px-8 text-base rounded-full">
                    Espace Professionnel
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

      {/* Auth Dialog */}
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </div>
  )
}
