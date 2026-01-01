'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Users,
  Calendar,
  Euro,
  Mail,
  Plus,
  Star,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useStore } from '@/lib/store'
import { mockClubs } from '@/lib/mock-data'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function AdminDashboard() {
  const router = useRouter()
  const { currentUser, bookings } = useStore()
  const [inviteEmail, setInviteEmail] = useState('')
  
  if (!currentUser || currentUser.role !== 'admin') {
    router.push('/')
    return null
  }

  const club = mockClubs.find((c) => c.id === currentUser.clubId)
  const clubBookings = bookings.filter((b) => b.clubId === currentUser.clubId)

  const handleSendInvite = async () => {
    if (!inviteEmail) return
    
    setInviteEmail('')
    
    try {
      const response = await fetch('/api/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: inviteEmail,
          clubId: currentUser.clubId,
          role: 'coach',
        }),
      })

      const data = await response.json()

      if (response.ok) {
        if (data.demo) {
          alert(`✅ Invitation créée !\n\n📧 Email non envoyé (mode démo)\n🔗 Lien : ${data.inviteLink}`)
        } else {
          alert(`✅ Invitation envoyée à ${inviteEmail} !\n\nLe coach recevra un email avec un lien d'inscription.`)
        }
      } else {
        alert(`❌ Erreur : ${data.error}`)
      }
    } catch (error) {
      console.error('Error sending invite:', error)
      alert('❌ Erreur lors de l\'envoi de l\'invitation')
    }
  }

  if (!club) return null

  // Calculate stats
  const totalRevenue = clubBookings.reduce((sum, b) => sum + b.totalPrice, 0)
  const avgRating = club.rating
  const totalCoaches = club.coaches.length

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-6xl mx-auto px-6 pt-12 pb-8">

          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-xl">
              <Image
                src={club.logoUrl}
                alt={club.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{club.name}</h1>
              <p className="text-indigo-100 text-lg">
                Panneau d&apos;Administration
              </p>
              <p className="text-indigo-100">Directeur: {currentUser.name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-blue-100">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{totalCoaches}</p>
                    <p className="text-sm text-gray-600">Coachs</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-green-100">
                    <Calendar className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{clubBookings.length}</p>
                    <p className="text-sm text-gray-600">Réservations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-yellow-100">
                    <Euro className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{totalRevenue}€</p>
                    <p className="text-sm text-gray-600">Revenu</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-purple-100">
                    <Star className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{avgRating}</p>
                    <p className="text-sm text-gray-600">Note moyenne</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="coaches" className="space-y-6">
          <TabsList>
            <TabsTrigger value="coaches">Équipe</TabsTrigger>
            <TabsTrigger value="reservations">Réservations</TabsTrigger>
            <TabsTrigger value="invite">Inviter un coach</TabsTrigger>
          </TabsList>

          {/* Coaches Tab */}
          <TabsContent value="coaches">
            <Card>
              <CardHeader>
                <CardTitle>Votre Équipe de Coachs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {club.coaches.map((coach, idx) => (
                    <motion.div
                      key={coach.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={coach.photoUrl} alt={coach.name} />
                          <AvatarFallback>{coach.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-lg">{coach.name}</p>
                          <p className="text-sm text-gray-600">{coach.speciality}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{coach.rating}</span>
                            </div>
                            <span className="text-sm text-gray-500">
                              {coach.reviewCount} avis
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-xl">{coach.hourlyRate}€</p>
                        <p className="text-sm text-gray-500">/heure</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reservations Tab */}
          <TabsContent value="reservations">
            <Card>
              <CardHeader>
                <CardTitle>Réservations Récentes</CardTitle>
              </CardHeader>
              <CardContent>
                {clubBookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">Aucune réservation pour le moment</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {clubBookings.map((booking) => {
                      const coach = club.coaches.find((c) => c.id === booking.coachId)
                      return (
                        <motion.div
                          key={booking.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl"
                        >
                          <div className="flex items-center gap-4">
                            {coach && (
                              <Avatar className="w-12 h-12">
                                <AvatarImage src={coach.photoUrl} alt={coach.name} />
                                <AvatarFallback>{coach.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                            )}
                            <div>
                              <p className="font-bold">{booking.clientName}</p>
                              <p className="text-sm text-gray-600">
                                avec {coach?.name || 'Coach'}
                              </p>
                              <p className="text-sm text-gray-500">
                                {format(new Date(booking.date), 'EEEE d MMMM', {
                                  locale: fr,
                                })}{' '}
                                • {booking.time}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">{booking.totalPrice}€</p>
                            <Badge
                              className={
                                booking.status === 'confirmed'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }
                            >
                              {booking.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                            </Badge>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Invite Tab */}
          <TabsContent value="invite">
            <Card>
              <CardHeader>
                <CardTitle>Inviter un Nouveau Coach</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-w-md space-y-6">
                  <p className="text-gray-600">
                    Envoyez un lien d&apos;invitation magique pour ajouter un nouveau coach à
                    votre équipe.
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email du coach
                      </label>
                      <div className="flex gap-3">
                        <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border-2 border-gray-200 focus-within:border-blue-500 transition-colors">
                          <Mail className="w-5 h-5 text-gray-400" />
                          <input
                            type="email"
                            placeholder="coach@example.com"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            className="flex-1 bg-transparent border-none outline-none text-gray-900"
                          />
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handleSendInvite}
                      disabled={!inviteEmail}
                      className="w-full h-12"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Envoyer l&apos;invitation
                    </Button>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <p className="text-sm text-blue-900">
                      <strong>💡 Astuce:</strong> Le coach recevra un email avec un lien
                      sécurisé pour créer son compte et rejoindre votre club.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

