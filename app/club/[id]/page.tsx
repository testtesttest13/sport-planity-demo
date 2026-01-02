'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Star, MapPin, Shield, ChevronLeft, Phone, Mail, Wifi, Car, Coffee, LogIn, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { CoachCard } from '@/components/coach-card'
import { BookingDrawer } from '@/components/booking-drawer'
import { AuthDialog } from '@/components/auth-dialog'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/auth-provider'
import { Coach } from '@/types'

const amenityIcons: Record<string, any> = {
  'Wifi Gratuit': Wifi,
  'Parking Privé': Car,
  'Bar & Restaurant': Coffee,
}

interface ClubData {
  id: string
  name: string
  address: string | null
  city: string
  sport: string | null
  cover_url: string | null
  logo_url: string | null
  description: string | null
  verified: boolean
  rating: number
  review_count: number
}


export default function ClubPage() {
  const params = useParams()
  const clubId = params.id as string
  const supabase = createClient()
  const { user } = useAuth()

  const [club, setClub] = useState<ClubData | null>(null)
  const [coaches, setCoaches] = useState<Coach[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [authDialogOpen, setAuthDialogOpen] = useState(false)
  const [shareCopied, setShareCopied] = useState(false)

  useEffect(() => {
    async function fetchClubData() {
      try {
        // Fetch club
        const { data: clubData, error: clubError } = await supabase
          .from('clubs')
          .select('*')
          .eq('id', clubId)
          .single()

        if (clubError || !clubData) {
          console.error('Error fetching club:', clubError)
          setLoading(false)
          return
        }

        setClub(clubData)

        // Fetch coaches for this club with profile data
        const { data: coachesData, error: coachesError } = await supabase
          .from('coaches')
          .select(`
            id,
            profile_id,
            club_id,
            speciality,
            bio,
            age,
            rating,
            review_count,
            hourly_rate,
            profiles (
              id,
              full_name,
              avatar_url
            )
          `)
          .eq('club_id', clubId)

        if (coachesError) {
          console.error('Error fetching coaches:', coachesError)
        } else {
          // Transform coaches data to match Coach interface and load availability
          const transformedCoachesPromises = (coachesData || []).map(async (coach: any) => {
            const profile = coach.profiles || {}
            
            // Load weekly schedule from coach_availability
            // IMPORTANT: coach_id in coach_availability refers to coaches.id, not profile_id
            const { data: coachEntry } = await supabase
              .from('coaches')
              .select('id')
              .eq('profile_id', coach.profile_id)
              .single()

            const actualCoachId = coachEntry?.id || coach.id

            const { data: availability } = await supabase
              .from('coach_availability')
              .select('day_of_week, time_slot')
              .eq('coach_id', actualCoachId)
              .eq('is_available', true)

            // Transform availability to weeklySchedule format
            const weeklySchedule: { day: number; slots: string[] }[] = []
            if (availability) {
              const groupedByDay: Record<number, string[]> = {}
              availability.forEach((av: any) => {
                if (!groupedByDay[av.day_of_week]) {
                  groupedByDay[av.day_of_week] = []
                }
                groupedByDay[av.day_of_week].push(av.time_slot)
              })
              Object.entries(groupedByDay).forEach(([day, slots]) => {
                weeklySchedule.push({
                  day: Number(day),
                  slots: (slots as string[]).sort(),
                })
              })
            }

            return {
              id: actualCoachId, // Use coaches.id for booking drawer compatibility
              name: profile.full_name || 'Coach',
              photoUrl: profile.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
              age: coach.age || 30,
              speciality: coach.speciality || 'Coach',
              bio: coach.bio || '',
              rating: Number(coach.rating) || 0,
              reviewCount: coach.review_count || 0,
              hourlyRate: coach.hourly_rate || 50,
              clubId: coach.club_id,
              weeklySchedule,
            }
          })
          
          const transformedCoaches = await Promise.all(transformedCoachesPromises)
          setCoaches(transformedCoaches)
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    if (clubId) {
      fetchClubData()
    }
  }, [clubId, supabase])

  const handleBookCoach = (coach: Coach) => {
    if (!user) {
      // If not authenticated, show auth dialog
      setAuthDialogOpen(true)
      return
    }
    setSelectedCoach(coach)
    setDrawerOpen(true)
  }

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    
    try {
      // Try Web Share API if available (mobile)
      if (navigator.share) {
        await navigator.share({
          title: club?.name || 'Club',
          text: `Découvrez ${club?.name} sur Simpl.`,
          url: url,
        })
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(url)
        setShareCopied(true)
        setTimeout(() => setShareCopied(false), 2000)
      }
    } catch (error) {
      // User cancelled share or error occurred
      if (error instanceof Error && error.name !== 'AbortError') {
        // If Web Share failed, try clipboard
        try {
          await navigator.clipboard.writeText(url)
          setShareCopied(true)
          setTimeout(() => setShareCopied(false), 2000)
        } catch (clipboardError) {
          console.error('Failed to copy to clipboard:', clipboardError)
        }
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!club) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-xl md:text-2xl font-bold mb-4">Club non trouvé</h1>
          <Link href="/">
            <Button>Retour à l&apos;accueil</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Default amenities based on sport
  const defaultAmenities: string[] = ['Parking Privé', 'Wifi Gratuit']
  const amenities = defaultAmenities

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header with Cover Image */}
      <div className="relative">
        {/* Cover Image - Smaller on mobile */}
        <div className="relative h-64 sm:h-80 md:h-96">
          <Image
            src={club.cover_url || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b231b?w=1200&h=800&fit=crop'}
            alt={club.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

          {/* Back Button - Smaller on mobile */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
            <Link href="/">
              <Button
                variant="secondary"
                size="icon"
                className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white active:scale-95 transition-transform"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </Link>
          </div>

          {/* Share and Login Buttons - Optimized for mobile */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 flex gap-2">
            <Button
              onClick={handleShare}
              variant="secondary"
              size="sm"
              className="h-9 px-3 sm:px-4 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white active:scale-95 transition-transform gap-1.5 sm:gap-2 text-xs sm:text-sm"
            >
              <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{shareCopied ? 'Copié !' : 'Partager'}</span>
            </Button>
            {!user && (
              <Button
                onClick={() => setAuthDialogOpen(true)}
                variant="secondary"
                size="sm"
                className="h-9 px-3 sm:px-4 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white active:scale-95 transition-transform gap-1.5 sm:gap-2 text-xs sm:text-sm"
              >
                <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Connexion</span>
              </Button>
            )}
          </div>
        </div>

        {/* Club Info Overlay - Better mobile spacing */}
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 -mt-16 sm:-mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8"
          >
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              {/* Logo - Smaller on mobile */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg flex-shrink-0 border-4 border-white">
                <Image
                  src={club.logo_url || club.cover_url || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b231b?w=200&h=200&fit=crop'}
                  alt={`${club.name} logo`}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold break-words">{club.name}</h1>
                      {club.verified && (
                        <Badge className="bg-blue-100 text-blue-700 border-0 text-xs">
                          <Shield className="w-3 h-3 mr-1" />
                          Vérifié
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="text-xs sm:text-sm">{club.city}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                        <span className="font-bold text-xs sm:text-sm">{club.rating.toFixed(1)}</span>
                        <span className="text-xs sm:text-sm">({club.review_count} avis)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Amenities - Better wrapping */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {amenities.map((amenity) => {
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

      {/* Content - Better mobile padding */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12">
        <Tabs defaultValue="coaches" className="space-y-6 sm:space-y-8">
          {/* Sticky Tabs - Better mobile */}
          <div className="sticky top-0 z-20 bg-gray-50/80 backdrop-blur-lg py-3 sm:py-4 -mx-4 sm:-mx-6 px-4 sm:px-6">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="coaches" className="flex-1 sm:flex-none text-sm sm:text-base">
                Coachs
              </TabsTrigger>
              <TabsTrigger value="infos" className="flex-1 sm:flex-none text-sm sm:text-base">
                Infos
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Coaches Tab */}
          <TabsContent value="coaches" className="space-y-4 sm:space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Nos Coachs</h2>
              <p className="text-sm sm:text-base text-gray-600">
                {coaches.length} coach{coaches.length > 1 ? 's' : ''} disponible{coaches.length > 1 ? 's' : ''}
              </p>
            </div>

            {coaches.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-sm sm:text-base">Aucun coach disponible pour le moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {coaches.map((coach, idx) => (
                  <motion.div
                    key={coach.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <CoachCard coach={coach} onBook={handleBookCoach} />
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Infos Tab */}
          <TabsContent value="infos" className="space-y-6 sm:space-y-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">À propos</h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
                {club.description || 'Aucune description disponible.'}
              </p>
            </div>

            <div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Coordonnées</h3>
              <div className="space-y-3 text-sm sm:text-base text-gray-700">
                {club.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 text-gray-400 flex-shrink-0" />
                    <span className="break-words">{club.address}</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                  <span>+33 X XX XX XX XX</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                  <span className="break-all">contact@{club.name.toLowerCase().replace(/\s+/g, '')}.fr</span>
                </div>
              </div>
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

      {/* Auth Dialog */}
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </div>
  )
}
