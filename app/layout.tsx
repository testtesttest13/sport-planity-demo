import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { BottomNav } from "@/components/bottom-nav"
import { DemoSwitcher } from "@/components/demo-switcher"
import { AuthProvider } from "@/components/providers/auth-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sport Planity - Réservez votre coach",
  description: "La plateforme premium pour réserver vos cours de tennis, padel et équitation",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={cn(inter.className, "antialiased")}>
        <AuthProvider>
          {children}
          <BottomNav />
          <DemoSwitcher />
        </AuthProvider>
      </body>
    </html>
  )
}

