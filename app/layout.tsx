import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { ClientLayout } from "@/components/client-layout"

const inter = Inter({ subsets: ["latin"] })

export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const revalidate = 0

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
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}

