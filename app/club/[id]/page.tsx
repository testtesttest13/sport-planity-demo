'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Star, MapPin, Shield, ChevronLeft, Phone, Mail, Wifi, Car, Coffee } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { CoachCard } from '@/components/coach-card'
import { BookingDrawer } from '@/components/booking-drawer'
import { mockClubs } from '@/lib/mock-data'
import { Coach } from '@/types'

const amenityIcons: Record<string, any> = {
  'Wifi Gratuit': Wifi,
  'Parking Privé': Car,
  'Bar & Restaurant': Coffee,
}

export default function ClubPage() {
  const params = useParams()
  const clubId = params.id as string
  const club = mockClubs.find((c) => c.id === clubId)

  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  if (!club) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Club non trouvé</h1>
          <Link href="/">
            <Button>Retour à l&apos;accueil</Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleBookCoach = (coach: Coach) => {
    setSelectedCoach(coach)
    setDrawerOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header with Cover Image */}
      <div className="relative">
        {/* Cover Image */}
        <div className="relative h-80 md:h-96">
          <Image
            src={club.coverUrl}
            alt={club.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

          {/* Back Button */}
          <div className="absolute top-6 left-6 z-10">
            <Link href="/">
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full bg-white/90 backdrop-blur-sm hover:bg-white active:scale-95 transition-transform"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Club Info Overlay */}
        <div className="relative max-w-6xl mx-auto px-6 -mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-2xl p-6 md:p-8"
          >
            <div className="flex flex-col md:flex-row gap-6">
              {/* Logo */}
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-lg flex-shrink-0 border-4 border-white">
                <Image
                  src={club.logoUrl}
                  alt={`${club.name} logo`}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h1 className="text-3xl md:text-4xl font-bold">{club.name}</h1>
                      {club.verified && (
                        <Badge className="bg-blue-100 text-blue-700 border-0">
                          <Shield className="w-3 h-3 mr-1" />
                          Vérifié
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{club.city}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold">{club.rating}</span>
                        <span className="text-sm">({club.reviewCount} avis)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                <div className="flex flex-wrap gap-2">
                  {club.amenities.map((amenity) => {
                    const Icon = amenityIcons[amenity]
                    return (
                      <Badge
                        key={amenity}
                        variant="secondary"
                        className="text-xs font-medium"
                      >
                        {Icon && <Icon className="w-3 h-3 mr-1" />}
                        {amenity}
                      </Badge>
                    )
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Tabs defaultValue="coaches" className="space-y-8">
          {/* Sticky Tabs */}
          <div className="sticky top-0 z-20 bg-gray-50/80 backdrop-blur-lg py-4 -mx-6 px-6">
            <TabsList className="w-full md:w-auto">
              <TabsTrigger value="coaches" className="flex-1 md:flex-none">
                Coachs
              </TabsTrigger>
              <TabsTrigger value="infos" className="flex-1 md:flex-none">
                Infos
              </TabsTrigger>
              <TabsTrigger value="avis" className="flex-1 md:flex-none">
                Avis
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Coaches Tab */}
          <TabsContent value="coaches" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Nos Coachs</h2>
              <p className="text-gray-600">
                {club.coaches.length} coach{club.coaches.length > 1 ? 's' : ''} disponible
                {club.coaches.length > 1 ? 's' : ''}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {club.coaches.map((coach, idx) => (
                <motion.div
                  key={coach.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <CoachCard coach={coach} onBook={handleBookCoach} />
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Infos Tab */}
          <TabsContent value="infos" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">À propos</h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {club.description}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Coordonnées</h3>
              <div className="space-y-3 text-gray-700">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 mt-0.5 text-gray-400" />
                  <span>{club.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span>+33 4 78 XX XX XX</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span>contact@{club.name.toLowerCase().replace(/\s+/g, '')}.fr</span>
                </div>
              </div>
            </div>

            {/* Gallery */}
            {club.images.length > 0 && (
              <div>
                <h3 className="text-xl font-bold mb-4">Galerie</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {club.images.map((image, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square rounded-2xl overflow-hidden"
                    >
                      <Image
                        src={image}
                        alt={`${club.name} photo ${idx + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="avis" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Avis clients</h2>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-1">
                  <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  <span className="text-3xl font-bold">{club.rating}</span>
                </div>
                <span className="text-gray-600">sur {club.reviewCount} avis</span>
              </div>
            </div>

            <div className="space-y-6">
              {club.reviews.map((review) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border"
                >
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={review.authorPhoto} alt={review.authorName} />
                      <AvatarFallback>
                        {review.authorName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold">{review.authorName}</h4>
                        <span className="text-sm text-gray-500">
                          {new Date(review.date).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mb-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Booking Drawer */}
      <BookingDrawer
        coach={selectedCoach}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        clubName={club.name}
      />
    </div>
  )
}

