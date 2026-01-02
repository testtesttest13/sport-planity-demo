'use client'

import { AuthProvider } from '@/components/providers/auth-provider'
import { BottomNav } from '@/components/bottom-nav'
import { Toaster } from '@/components/ui/toast'

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <BottomNav />
      <Toaster />
    </AuthProvider>
  )
}

