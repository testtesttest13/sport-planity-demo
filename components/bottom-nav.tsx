'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, Calendar, Inbox, User, Home, LogIn, Settings, UserPlus } from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

export function BottomNav() {
  const pathname = usePathname()
  const { user } = useAuth()
  const supabase = createClient()
  const [userRole, setUserRole] = useState<string>('client')
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean>(true)

  // Fetch user role and onboarding status from profiles table
  useEffect(() => {
    async function fetchUserRole() {
      if (!user) {
        setUserRole('client')
        setIsOnboardingComplete(true)
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', user.id)
        .single()

      if (profile) {
        setUserRole(profile.role || 'client')
        // Check if onboarding is complete
        const complete = profile.full_name && 
          profile.full_name !== user.email && 
          !profile.full_name.includes('@') &&
          profile.role
        setIsOnboardingComplete(!!complete)
      } else {
        setUserRole('client')
        setIsOnboardingComplete(false)
      }
    }

    fetchUserRole()
  }, [user, supabase])

  // Don't show on login/onboarding pages or when not logged in
  if (pathname === '/login' || pathname === '/onboarding' || !user) return null

  // Client navigation
  const clientNav = [
    { href: '/', icon: Search, label: 'Rechercher' },
    { href: '/my-bookings', icon: Inbox, label: 'Mes cours' },
    { href: '/account', icon: User, label: 'Compte' },
  ]

  // If onboarding incomplete, replace last item with onboarding button
  if (!isOnboardingComplete) {
    clientNav[clientNav.length - 1] = { href: '/onboarding', icon: UserPlus, label: 'Compléter' }
  }

  // Coach navigation - "Gestion" instead of "Planning"
  const coachNav = [
    { href: '/coach', icon: Settings, label: 'Gestion' },
    { href: '/coach/schedule', icon: Calendar, label: 'Disponibilités' },
    { href: '/account', icon: User, label: 'Compte' },
  ]

  // Admin navigation
  const adminNav = [
    { href: '/admin', icon: Home, label: 'Dashboard' },
    { href: '/admin/team', icon: Inbox, label: 'Équipe' },
    { href: '/admin/bookings', icon: Calendar, label: 'Réservations' },
    { href: '/admin/settings', icon: Settings, label: 'Club' },
  ]
  
  const navItems =
    userRole === 'coach'
      ? coachNav
      : userRole === 'admin'
      ? adminNav
      : clientNav

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-area-bottom">
      <div className="max-w-lg mx-auto px-2">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            // For /coach, also match /coach/schedule if it's the schedule item
            const isActive = pathname === item.href || (item.href === '/coach/schedule' && pathname.startsWith('/coach/schedule'))
            const Icon = item.icon
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all active:scale-95 min-w-[70px]',
                  isActive
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                <Icon
                  className={cn(
                    'w-6 h-6 transition-all',
                    isActive && 'stroke-[2.5px]'
                  )}
                />
                <span
                  className={cn(
                    'text-xs font-medium',
                    isActive && 'font-semibold'
                  )}
                >
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

