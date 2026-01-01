'use client'

import { AuthProvider } from '@/components/providers/auth-provider'
import { BottomNav } from '@/components/bottom-nav'
import { DemoSwitcher } from '@/components/demo-switcher'

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <BottomNav />
      <DemoSwitcher />
    </AuthProvider>
  )
}

