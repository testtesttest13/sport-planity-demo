'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Check, Calendar, TrendingUp, Users, BarChart3, Smartphone, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function ProPage() {
  const router = useRouter()

  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing')
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              L&apos;outil que les Pros du sport attendaient.
            </h1>
            <p className="text-xl sm:text-2xl text-slate-600 mb-10 leading-relaxed">
              Une gestion unifiée pour les Coachs indépendants et les Clubs ambitieux.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={scrollToPricing}
                size="lg"
                className="h-14 px-8 text-lg rounded-full"
              >
                Commencer maintenant
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                onClick={() => router.push('/')}
                variant="ghost"
                size="lg"
                className="h-14 px-8 text-lg rounded-full"
              >
                Je suis un élève
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pour les Coachs */}
      <section className="py-20 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Visual - Mock Dashboard */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1"
            >
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl p-8 shadow-2xl">
                  <div className="bg-white rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="h-4 bg-blue-200 rounded w-24"></div>
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-100 rounded w-full"></div>
                      <div className="h-3 bg-gray-100 rounded w-3/4"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-4">
                      <div className="h-20 bg-green-50 rounded-xl border-2 border-green-200"></div>
                      <div className="h-20 bg-gray-50 rounded-xl border-2 border-gray-200"></div>
                    </div>
                  </div>
                </div>
                <Smartphone className="absolute -bottom-4 -right-4 w-16 h-16 text-blue-600 opacity-20" />
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-1 lg:order-2"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                Reprenez le contrôle de votre temps.
              </h2>
              <div className="space-y-6 mb-8">
                <div>
                  <p className="text-lg text-slate-600 mb-4">
                    <strong className="text-slate-900">Fini les SMS à 23h</strong> pour réserver un créneau. <strong className="text-slate-900">Fini les annulations de dernière minute oubliées.</strong>
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">Agenda Intelligent</h3>
                      <p className="text-slate-600">Vous définissez vos plages, les clients s&apos;adaptent.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">Validation Manuelle</h3>
                      <p className="text-slate-600">Acceptez ou refusez les demandes en 1 clic.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">Dashboard Dédié</h3>
                      <p className="text-slate-600">&quot;Pensé par des coachs, pour des coachs.&quot; Suivez vos revenus et vos futurs cours en un coup d&apos;œil.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pour les Clubs */}
      <section className="py-20 sm:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                Pilotez votre Club sans la paperasse.
              </h2>
              <div className="space-y-6 mb-8">
                <div>
                  <p className="text-lg text-slate-600 mb-4">
                    <strong className="text-slate-900">Adieu les dossiers Excel incompréhensibles</strong> et les <strong className="text-slate-900">feuilles volantes perdues.</strong>
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <BarChart3 className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">Vue d&apos;ensemble 360°</h3>
                      <p className="text-slate-600">Statistiques en temps réel de tous vos coachs.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">Gestion Financière</h3>
                      <p className="text-slate-600">Suivez le chiffre d&apos;affaires généré par chaque membre de l&apos;équipe.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Calendar className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">Planning Global</h3>
                      <p className="text-slate-600">Visualisez l&apos;occupation de vos terrains/salles instantanément.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Visual - Mock Dashboard */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-50 to-purple-100 rounded-3xl p-8 shadow-2xl">
                  <div className="bg-white rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-5 bg-blue-200 rounded w-32"></div>
                      <div className="h-5 bg-gray-200 rounded w-20"></div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="h-24 bg-blue-50 rounded-xl border-2 border-blue-200"></div>
                      <div className="h-24 bg-green-50 rounded-xl border-2 border-green-200"></div>
                      <div className="h-24 bg-purple-50 rounded-xl border-2 border-purple-200"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-100 rounded w-full"></div>
                      <div className="h-3 bg-gray-100 rounded w-5/6"></div>
                      <div className="h-3 bg-gray-100 rounded w-4/6"></div>
                    </div>
                  </div>
                </div>
                <Monitor className="absolute -bottom-4 -left-4 w-16 h-16 text-blue-600 opacity-20" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action - Pricing */}
      <section id="pricing" className="py-20 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Prêt à passer au niveau supérieur ?
            </h2>
            <p className="text-xl text-slate-600">
              Choisissez votre profil et commencez dès aujourd&apos;hui
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Card Coach */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card className="h-full hover:shadow-xl transition-shadow border-2 hover:border-blue-500">
                <CardContent className="p-8 flex flex-col h-full">
                  <div className="mb-6">
                    <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
                      <Users className="w-7 h-7 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Je suis Coach</h3>
                    <p className="text-slate-600">
                      Gérez vos réservations, votre planning et vos revenus en toute simplicité.
                    </p>
                  </div>
                  <div className="mt-auto pt-6">
                    <Button
                      onClick={() => router.push('/onboarding?role=coach')}
                      className="w-full h-12 text-lg rounded-full"
                      size="lg"
                    >
                      Commencer
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Card Club */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card className="h-full hover:shadow-xl transition-shadow border-2 hover:border-purple-500">
                <CardContent className="p-8 flex flex-col h-full">
                  <div className="mb-6">
                    <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-4">
                      <BarChart3 className="w-7 h-7 text-purple-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Je suis un Club</h3>
                    <p className="text-slate-600">
                      Pilotez votre équipe, vos réservations et votre chiffre d&apos;affaires en un seul endroit.
                    </p>
                  </div>
                  <div className="mt-auto pt-6">
                    <Button
                      onClick={() => router.push('/onboarding?role=admin')}
                      variant="outline"
                      className="w-full h-12 text-lg rounded-full border-2"
                      size="lg"
                    >
                      Commencer
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

