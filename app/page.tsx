'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, MapPin, ChevronRight, Star, Users, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/components/providers/auth-provider'
import { mockClubs } from '@/lib/mock-data'

export default function HomePage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [searchCity, setSearchCity] = useState('')
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  const handleSearch = () => {
    if (searchCity.trim()) {
      // In a real app, this would navigate to a search results page
      const filtered = mockClubs.filter((club) =>
        club.city.toLowerCase().includes(searchCity.toLowerCase()) ||
        club.address.toLowerCase().includes(searchCity.toLowerCase())
      )
      
      if (filtered.length > 0) {
        router.push(`/club/${filtered[0].id}`)
      } else {
        alert(`Aucun club trouvé pour "${searchCity}"`)
      }
    }
  }

  const featuredClubs = mockClubs.slice(0, 3)

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, will redirect to login
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=2000&auto=format&fit=crop"
            alt="Tennis court"
            fill
            className="object-cover brightness-50"
            priority
          />
        </div>

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 z-[1]" />

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              Trouvez votre
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                coach parfait
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto">
              Tennis • Padel • Équitation
            </p>

            {/* Search Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="max-w-2xl mx-auto mt-12"
            >
              <Card className="p-6 glass border-white/20 shadow-2xl">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-white/90 rounded-xl">
                    <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="Ville ou code postal"
                      value={searchCity}
                      onChange={(e) => setSearchCity(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder:text-gray-400 font-medium"
                    />
                  </div>
                  <Button 
                    size="lg" 
                    className="w-full md:w-auto px-8"
                    onClick={handleSearch}
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Rechercher
                  </Button>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-6 h-10 border-2 border-white/50 rounded-full p-1"
          >
            <div className="w-1.5 h-3 bg-white/70 rounded-full mx-auto" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Pourquoi Sport Planity ?
            </h2>
            <p className="text-xl text-gray-600">
              La plateforme de référence pour le coaching sportif
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Coachs Certifiés',
                description: 'Tous nos coachs sont diplômés d\'État et vérifiés',
              },
              {
                icon: Star,
                title: 'Meilleurs Clubs',
                description: 'Accédez aux installations premium de votre région',
              },
              {
                icon: Users,
                title: 'Réservation Simple',
                description: 'Trouvez et réservez votre créneau en quelques clics',
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="p-8 text-center hover:shadow-xl transition-shadow h-full">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white mb-6">
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Clubs */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <h2 className="text-4xl font-bold mb-2">Les clubs populaires</h2>
              <p className="text-gray-600">Découvrez nos établissements partenaires</p>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredClubs.map((club, idx) => (
              <motion.div
                key={club.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link href={`/club/${club.id}`}>
                  <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 group cursor-pointer">
                    <div className="relative aspect-[16/10]">
                      <Image
                        src={club.coverUrl}
                        alt={club.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {club.verified && (
                        <Badge className="absolute top-4 right-4 bg-white/95 text-blue-600 border-0">
                          <Shield className="w-3 h-3 mr-1" />
                          Vérifié
                        </Badge>
                      )}
                    </div>
                    <div className="p-6 space-y-3">
                      <h3 className="text-xl font-bold">{club.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {club.city}
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-bold">{club.rating}</span>
                          <span className="text-sm text-gray-500">
                            ({club.reviewCount} avis)
                          </span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}

