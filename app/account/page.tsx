'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Star,
  Calendar,
  LogOut,
  ChevronRight,
  Bell,
  CreditCard,
  Settings,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useStore, logout } from '@/lib/store'
import { mockCoaches, mockClubs } from '@/lib/mock-data'

export default function AccountPage() {
  const router = useRouter()
  const { currentUser, bookings } = useStore()

  if (!currentUser) {
    router.push('/')
    return null
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const coach = currentUser.role === 'coach' 
    ? mockCoaches.find((c) => c.id === currentUser.coachId)
    : null

  const club = currentUser.clubId 
    ? mockClubs.find((c) => c.id === currentUser.clubId)
    : null

  const userBookings = bookings.filter(
    (b) =>
      (currentUser.role === 'client' && b.status !== 'cancelled') ||
      (currentUser.role === 'coach' && b.coachId === currentUser.coachId)
  )

  const menuItems = [
    {
      icon: Bell,
      label: 'Notifications',
      description: 'Gérer vos notifications',
      action: () => alert('Fonctionnalité à venir'),
    },
    {
      icon: CreditCard,
      label: 'Paiements',
      description: 'Moyens de paiement',
      action: () => alert('Fonctionnalité à venir'),
    },
    {
      icon: Settings,
      label: 'Paramètres',
      description: 'Préférences du compte',
      action: () => alert('Fonctionnalité à venir'),
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 pt-12 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-white shadow-xl">
            <AvatarImage src={currentUser.photoUrl} alt={currentUser.name} />
            <AvatarFallback className="text-2xl font-bold">
              {currentUser.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-bold mb-1">{currentUser.name}</h1>
          <p className="text-indigo-100">
            {currentUser.role === 'client' && 'Client'}
            {currentUser.role === 'coach' && 'Coach professionnel'}
            {currentUser.role === 'admin' && 'Administrateur'}
          </p>
        </motion.div>
      </div>

      <div className="max-w-2xl mx-auto px-6 -mt-8">
        {/* Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-6 overflow-hidden shadow-lg">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mx-auto mb-2">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {userBookings.length}
                  </p>
                  <p className="text-sm text-gray-600">
                    {currentUser.role === 'client' ? 'Cours réservés' : 'Cours donnés'}
                  </p>
                </div>
                {coach && (
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 mx-auto mb-2">
                      <Star className="w-6 h-6 text-yellow-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{coach.rating}</p>
                    <p className="text-sm text-gray-600">Note moyenne</p>
                  </div>
                )}
                {!coach && club && (
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mx-auto mb-2">
                      <MapPin className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-lg font-bold text-gray-900">{club.city}</p>
                    <p className="text-sm text-gray-600">Ville préférée</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Profile Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="mb-6">
            <CardContent className="p-6 space-y-4">
              <h2 className="font-bold text-lg mb-4">Informations personnelles</h2>
              
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{currentUser.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Téléphone</p>
                  <p className="font-medium">+33 6 12 34 56 78</p>
                </div>
              </div>

              {club && (
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      {currentUser.role === 'client' ? 'Ville' : 'Club'}
                    </p>
                    <p className="font-medium">{club.name}</p>
                  </div>
                </div>
              )}

              {coach && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-2">Spécialité</p>
                  <p className="font-semibold text-blue-600">{coach.speciality}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Menu Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3 mb-6"
        >
          {menuItems.map((item, idx) => (
            <Card
              key={idx}
              className="cursor-pointer hover:shadow-md transition-shadow active:scale-[0.98]"
              onClick={item.action}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full h-14 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Déconnexion
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

