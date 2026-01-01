'use client'

export const dynamic = 'force-dynamic'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Star, Calendar, Euro, Mail, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useStore } from '@/lib/store'
import { mockClubs } from '@/lib/mock-data'

export default function AdminTeamPage() {
  const router = useRouter()
  const { currentUser, bookings } = useStore()

  if (!currentUser || currentUser.role !== 'admin') {
    router.push('/')
    return null
  }

  const club = mockClubs.find((c) => c.id === currentUser.clubId)
  if (!club) return null

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-95 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold">Équipe</h1>
            <p className="text-sm text-gray-600">{club.coaches.length} coachs</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {club.coaches.map((coach, idx) => {
            const coachBookings = bookings.filter(
              (b) => b.coachId === coach.id && b.status !== 'cancelled'
            )
            const totalRevenue = coachBookings.reduce((sum, b) => sum + b.totalPrice, 0)

            return (
              <motion.div
                key={coach.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      {/* Coach Photo */}
                      <div className="relative w-full md:w-48 h-64 md:h-auto flex-shrink-0">
                        <Avatar className="w-full h-full rounded-none">
                          <AvatarImage
                            src={coach.photoUrl}
                            alt={coach.name}
                            className="object-cover"
                          />
                          <AvatarFallback className="rounded-none text-4xl">
                            {coach.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      {/* Coach Info */}
                      <div className="flex-1 p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-2xl font-bold mb-1">{coach.name}</h3>
                            <Badge className="bg-blue-100 text-blue-700 border-0">
                              {coach.speciality}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                            <span className="font-bold text-lg">{coach.rating}</span>
                          </div>
                        </div>

                        <p className="text-gray-700 mb-6 leading-relaxed">
                          {coach.bio}
                        </p>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                          <div className="text-center p-3 bg-blue-50 rounded-xl">
                            <Calendar className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                            <p className="text-2xl font-bold text-blue-600">
                              {coachBookings.length}
                            </p>
                            <p className="text-xs text-gray-600">Cours</p>
                          </div>
                          <div className="text-center p-3 bg-green-50 rounded-xl">
                            <Euro className="w-5 h-5 text-green-600 mx-auto mb-1" />
                            <p className="text-2xl font-bold text-green-600">
                              {totalRevenue}€
                            </p>
                            <p className="text-xs text-gray-600">Revenu</p>
                          </div>
                          <div className="text-center p-3 bg-yellow-50 rounded-xl">
                            <Star className="w-5 h-5 text-yellow-600 mx-auto mb-1" />
                            <p className="text-2xl font-bold text-yellow-600">
                              {coach.reviewCount}
                            </p>
                            <p className="text-xs text-gray-600">Avis</p>
                          </div>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-2 pt-4 border-t">
                          <div className="flex items-center gap-3 text-sm text-gray-700">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span>{coach.name.toLowerCase().replace(' ', '.')}@{club.name.toLowerCase().replace(/\s+/g, '')}.fr</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-700">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>+33 6 {Math.floor(Math.random() * 90 + 10)} {Math.floor(Math.random() * 90 + 10)} {Math.floor(Math.random() * 90 + 10)} {Math.floor(Math.random() * 90 + 10)}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 mt-6">
                          <Button variant="outline" className="flex-1" size="sm">
                            Modifier
                          </Button>
                          <Button variant="outline" className="flex-1" size="sm">
                            Statistiques
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

