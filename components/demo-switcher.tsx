'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, ChevronUp, User, Briefcase, Building } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useStore, loginAsClient, loginAsCoach, loginAsAdmin } from '@/lib/store'
import { cn } from '@/lib/utils'

export function DemoSwitcher() {
  const router = useRouter()
  const { currentUser } = useStore()
  const [isOpen, setIsOpen] = useState(false)

  const handleSwitch = (role: 'client' | 'coach' | 'admin') => {
    if (role === 'client') {
      loginAsClient()
      router.push('/')
    } else if (role === 'coach') {
      loginAsCoach()
      router.push('/coach')
    } else if (role === 'admin') {
      loginAsAdmin()
      router.push('/admin')
    }
    setIsOpen(false)
  }

  const roles = [
    {
      type: 'client' as const,
      icon: User,
      label: 'Client',
      name: 'Sophie',
      color: 'from-blue-500 to-cyan-500',
      route: '/',
    },
    {
      type: 'coach' as const,
      icon: Briefcase,
      label: 'Coach',
      name: 'Mathis',
      color: 'from-green-500 to-emerald-500',
      route: '/coach',
    },
    {
      type: 'admin' as const,
      icon: Building,
      label: 'Admin',
      name: 'Pierre',
      color: 'from-purple-500 to-pink-500',
      route: '/admin',
    },
  ]

  const currentRole = roles.find((r) => r.type === currentUser?.role) || roles[0]

  return (
    <div className="fixed bottom-24 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-3 space-y-2"
          >
            {roles
              .filter((r) => r.type !== currentUser?.role)
              .map((role) => {
                const Icon = role.icon
                return (
                  <motion.button
                    key={role.type}
                    onClick={() => handleSwitch(role.type)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all"
                  >
                    <div
                      className={cn(
                        'w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center text-white',
                        role.color
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">{role.name}</p>
                      <p className="text-xs text-gray-600">{role.label}</p>
                    </div>
                  </motion.button>
                )
              })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-3 px-5 py-4 bg-white rounded-2xl shadow-2xl border border-gray-200 hover:shadow-3xl transition-all"
      >
        <div
          className={cn(
            'w-12 h-12 rounded-full bg-gradient-to-br flex items-center justify-center text-white',
            currentRole.color
          )}
        >
          <currentRole.icon className="w-6 h-6" />
        </div>
        <div className="text-left min-w-[80px]">
          <p className="text-xs text-gray-500 font-medium">🎭 Mode Démo</p>
          <p className="font-bold text-gray-900">{currentRole.name}</p>
        </div>
        <div className="ml-2">
          {isOpen ? (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </motion.button>
    </div>
  )
}

