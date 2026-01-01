'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, Calendar, Inbox, User, Home } from 'lucide-react'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

export function BottomNav() {
  const pathname = usePathname()
  const { currentUser } = useStore()

  if (!currentUser) return null

  // Client navigation
  const clientNav = [
    { href: '/', icon: Search, label: 'Rechercher' },
    { href: '/my-bookings', icon: Inbox, label: 'Mes cours' },
    { href: '/account', icon: User, label: 'Compte' },
  ]

  // Coach navigation
  const coachNav = [
    { href: '/coach', icon: Calendar, label: 'Planning' },
    { href: '/coach/schedule', icon: Home, label: 'Disponibilités' },
    { href: '/account', icon: User, label: 'Compte' },
  ]

  // Admin navigation
  const adminNav = [
    { href: '/admin', icon: Home, label: 'Dashboard' },
    { href: '/admin/team', icon: Inbox, label: 'Équipe' },
    { href: '/account', icon: User, label: 'Compte' },
  ]

  const navItems =
    currentUser.role === 'coach'
      ? coachNav
      : currentUser.role === 'admin'
      ? adminNav
      : clientNav

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-area-bottom">
      <div className="max-w-lg mx-auto px-2">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href
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

