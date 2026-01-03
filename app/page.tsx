'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, MapPin, User, Star, LogIn, ArrowRight, Briefcase, Check, Users, Clock, Shield, Sparkles } from 'lucide-react'
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

        {/* Clubs - Grid on desktop, Slider on mobile */}
        {/* Desktop Grid */}
        <div className="hidden sm:block">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">Les révélations de la semaine</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
        </div>

        {/* Mobile Slider (horizontal scroll) */}
        <div className="sm:hidden -mx-4 px-4 mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 px-4">Les révélations de la semaine</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
            {filteredClubs.map((club) => (
              <div
                key={club.id}
                onClick={() => handleClubClick(club.id)}
                className="group cursor-pointer flex-shrink-0 w-[280px] snap-start"
              >
                {/* Image - Smaller on mobile */}
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-2">
                  <Image
                    src={club.cover_url || '/placeholder-club.jpg'}
                    alt={club.name}
                    fill
                    className="object-cover group-active:scale-105 transition-transform duration-200"
                  />
                </div>

                {/* Info - Compact on mobile */}
                <div className="space-y-0.5 px-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-slate-900 text-sm truncate flex-1">
                      {club.name}
                    </h3>
                    {club.rating > 0 && (
                      <div className="flex items-center gap-0.5 flex-shrink-0">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium text-slate-900">
                          {club.rating.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 truncate">
                    {club.city}
                  </p>
                  <div className="flex items-center justify-between pt-0.5">
                    <p className="text-xs text-gray-500">
                      {club.review_count} avis
                    </p>
                    <p className="text-xs font-semibold text-slate-900">
                      À partir de 50€/h
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
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

        {/* Section : Les clubs les plus actifs */}
        {!selectedCategory && !searchQuery && clubs.length > 0 && (
          <section className="mt-16 md:mt-24">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 md:mb-8">Les clubs les plus actifs</h2>
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {clubs
                .sort((a, b) => (b.review_count || 0) - (a.review_count || 0))
                .slice(0, 8)
                .map((club, idx) => (
                  <motion.div
                    key={club.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
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

            {/* Mobile Slider pour clubs actifs */}
            <div className="sm:hidden -mx-4 px-4">
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                {clubs
                  .sort((a, b) => (b.review_count || 0) - (a.review_count || 0))
                  .slice(0, 8)
                  .map((club) => (
                    <div
                      key={club.id}
                      onClick={() => handleClubClick(club.id)}
                      className="group cursor-pointer flex-shrink-0 w-[280px] snap-start"
                    >
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-2">
                        <Image
                          src={club.cover_url || '/placeholder-club.jpg'}
                          alt={club.name}
                          fill
                          className="object-cover group-active:scale-105 transition-transform duration-200"
                        />
                      </div>
                      <div className="space-y-0.5 px-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-slate-900 text-sm truncate flex-1">
                            {club.name}
                          </h3>
                          {club.rating > 0 && (
                            <div className="flex items-center gap-0.5 flex-shrink-0">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs font-medium text-slate-900">
                                {club.rating.toFixed(1)}
                              </span>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 truncate">
                          {club.city}
                        </p>
                        <div className="flex items-center justify-between pt-0.5">
                          <p className="text-xs text-gray-500">
                            {club.review_count} avis
                          </p>
                          <p className="text-xs font-semibold text-slate-900">
                            À partir de 50€/h
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </section>
        )}

        {/* Pourquoi choisir Simpl. ? */}
        {!user && (
          <section className="py-16 md:py-24 border-t border-gray-200 mt-16 md:mt-24">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Pourquoi choisir Simpl. ?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                La plateforme qui simplifie votre recherche de coach sportif
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Recherche facile
                </h3>
                <p className="text-gray-600">
                  Trouvez le coach parfait près de chez vous en quelques clics. Filtrez par sport, disponibilité et tarifs.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Réservation instantanée
                </h3>
                <p className="text-gray-600">
                  Réservez votre créneau en temps réel. Consultez les disponibilités et confirmez votre séance immédiatement.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Coachs certifiés
                </h3>
                <p className="text-gray-600">
                  Tous nos coachs sont vérifiés et certifiés. Choisissez en toute confiance avec nos avis clients authentiques.
                </p>
              </motion.div>
            </div>
          </section>
        )}

        {/* Témoignages */}
        {!user && (
          <section className="py-16 md:py-24 bg-gradient-to-br from-slate-50 to-blue-50 border-t border-gray-200">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Ce que disent nos clients
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  name: 'Sophie M.',
                  text: 'Enfin une app qui simplifie vraiment la réservation de cours ! J\'adore pouvoir voir les disponibilités en temps réel.',
                  rating: 5,
                },
                {
                  name: 'Thomas L.',
                  text: 'J\'ai trouvé mon coach de tennis en 5 minutes. L\'interface est intuitive et les coachs sont de qualité.',
                  rating: 5,
                },
                {
                  name: 'Marie D.',
                  text: 'Plus besoin de passer des heures à chercher un coach. Simpl. a tout rendu si facile !',
                  rating: 5,
                },
                {
                  name: 'Alexandre P.',
                  text: 'Service client réactif et coachs sérieux. Je recommande à 100% pour tous les sportifs.',
                  rating: 5,
                },
              ].map((testimonial, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                    &quot;{testimonial.text}&quot;
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {testimonial.name}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Pro Section */}
      <section className="bg-white py-16 sm:py-20 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4 md:mb-6">
              Vous êtes Coach ou Gérant de Club ?
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-8 md:mb-12">
              Rejoignez des centaines de professionnels qui font confiance à Simpl. pour gérer leurs réservations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/pro">
                <Button size="lg" className="h-14 px-8 text-base rounded-full bg-blue-600 text-white hover:bg-blue-700 shadow-xl font-semibold">
                  Espace Professionnel
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/pro">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="h-14 px-8 text-base rounded-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold"
                >
                  En savoir plus
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12">
            {/* Logo & Description */}
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="text-2xl font-bold text-blue-600 mb-4 inline-block">
                Simpl.
              </Link>
              <p className="text-sm text-gray-600">
                La plateforme qui simplifie votre recherche de coach sportif.
              </p>
            </div>

            {/* Liens */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Pour les clients</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-sm text-gray-600 hover:text-blue-600 transition-all duration-200 hover:translate-x-1 inline-block">
                    Rechercher un coach
                  </Link>
                </li>
                <li>
                  <Link href="/my-bookings" className="text-sm text-gray-600 hover:text-blue-600 transition-all duration-200 hover:translate-x-1 inline-block">
                    Mes réservations
                  </Link>
                </li>
                <li>
                  <Link href="/account" className="text-sm text-gray-600 hover:text-blue-600 transition-all duration-200 hover:translate-x-1 inline-block">
                    Mon compte
                  </Link>
                </li>
              </ul>
            </div>

            {/* Professionnels */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Professionnels</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/pro" className="text-sm text-gray-600 hover:text-blue-600 transition-all duration-200 hover:translate-x-1 inline-block">
                    Espace Pro
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-sm text-gray-600 hover:text-blue-600 transition-all duration-200 hover:translate-x-1 inline-block">
                    Connexion
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <a href="mailto:contact@simpl.fr" className="text-sm text-gray-600 hover:text-blue-600 transition-all duration-200 hover:translate-x-1 inline-block">
                    Contact
                  </a>
                </li>
                <li>
                  <Link href="/pro" className="text-sm text-gray-600 hover:text-blue-600 transition-all duration-200 hover:translate-x-1 inline-block">
                    Devenir partenaire
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} Simpl. Tous droits réservés.
            </p>
            <div className="flex gap-6">
              <Link href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-all duration-200 hover:underline">
                Mentions légales
              </Link>
              <Link href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-all duration-200 hover:underline">
                Confidentialité
              </Link>
              <Link href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-all duration-200 hover:underline">
                CGU
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Dialog */}
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </div>
  )
}
