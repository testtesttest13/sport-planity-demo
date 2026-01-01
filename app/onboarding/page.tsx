'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ChevronRight, ChevronLeft, Upload, Check, User, Briefcase, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/auth-provider'
import Image from 'next/image'

type OnboardingStep = 1 | 2 | 3

export default function OnboardingPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const supabase = createClient()

  const [step, setStep] = useState<OnboardingStep>(1)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleComplete = async () => {
    if (!user) return
    setUploading(true)

    try {
      let avatarUrl = null

      // Upload photo if provided
      if (photoFile) {
        const fileExt = photoFile.name.split('.').pop()
        const fileName = `${user.id}-${Date.now()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, photoFile)

        if (!uploadError) {
          const { data } = supabase.storage.from('avatars').getPublicUrl(fileName)
          avatarUrl = data.publicUrl
        }
      }

      // Update profile
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: `${firstName} ${lastName}`,
          avatar_url: avatarUrl,
        })
        .eq('id', user.id)

      if (error) {
        alert(`Erreur: ${error.message}`)
        setUploading(false)
        return
      }

      // Redirect to account page
      router.push('/account')
    } catch (error) {
      console.error('Onboarding error:', error)
      alert('Une erreur est survenue')
      setUploading(false)
    }
  }

  const canContinue = () => {
    if (step === 1) return firstName.trim().length > 0
    if (step === 2) return lastName.trim().length > 0
    return true
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Chargement...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-0 overflow-hidden">
          {/* Progress Bar */}
          <div className="h-2 bg-gray-100">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
              initial={{ width: '0%' }}
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white mb-4">
                <span className="text-2xl font-bold">{step}/3</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {step === 1 && 'Bienvenue ! 👋'}
                {step === 2 && 'Enchanté ! 😊'}
                {step === 3 && 'Photo de profil 📸'}
              </h1>
              <p className="text-gray-600">
                {step === 1 && 'Commençons par votre prénom'}
                {step === 2 && 'Et votre nom de famille ?'}
                {step === 3 && 'Ajoutez une photo (facultatif)'}
              </p>
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
              {/* Step 1: First Name */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom
                    </label>
                    <div className="flex items-center gap-3 px-4 py-4 bg-gray-50 rounded-2xl border-2 border-gray-200 focus-within:border-blue-500 transition-colors">
                      <User className="w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Sophie"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        autoFocus
                        className="flex-1 bg-transparent border-none outline-none text-gray-900 text-lg"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Last Name */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom
                    </label>
                    <div className="flex items-center gap-3 px-4 py-4 bg-gray-50 rounded-2xl border-2 border-gray-200 focus-within:border-blue-500 transition-colors">
                      <User className="w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Durand"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        autoFocus
                        className="flex-1 bg-transparent border-none outline-none text-gray-900 text-lg"
                      />
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <p className="text-sm text-blue-900">
                      <strong>Bonjour {firstName} !</strong> Ravi de vous connaître 😊
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Photo */}
              {step === 3 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    {photoPreview ? (
                      <div className="relative w-32 h-32 mx-auto mb-4">
                        <Image
                          src={photoPreview}
                          alt="Preview"
                          fill
                          className="rounded-full object-cover border-4 border-blue-500"
                        />
                      </div>
                    ) : (
                      <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <User className="w-16 h-16 text-gray-400" />
                      </div>
                    )}

                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                      <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-full font-semibold text-gray-700 transition-colors active:scale-95">
                        <Upload className="w-5 h-5" />
                        {photoPreview ? 'Changer la photo' : 'Ajouter une photo'}
                      </div>
                    </label>

                    <p className="text-sm text-gray-500 mt-4">
                      Facultatif - Vous pourrez l&apos;ajouter plus tard
                    </p>
                  </div>

                  <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                    <p className="text-sm text-green-900 text-center">
                      <strong>✨ Presque terminé !</strong>
                      <br />
                      {firstName} {lastName}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex gap-3 mt-8">
              {step > 1 && (
                <Button
                  onClick={() => setStep((step - 1) as OnboardingStep)}
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  disabled={uploading}
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Retour
                </Button>
              )}

              {step < 3 ? (
                <Button
                  onClick={() => setStep((step + 1) as OnboardingStep)}
                  disabled={!canContinue()}
                  size="lg"
                  className={step === 1 ? 'w-full' : 'flex-1'}
                >
                  Continuer
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleComplete}
                  disabled={uploading}
                  size="lg"
                  className="flex-1"
                >
                  {uploading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Finalisation...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Terminer
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Skip button on photo step */}
            {step === 3 && !uploading && (
              <button
                onClick={handleComplete}
                className="w-full mt-4 text-sm text-gray-600 hover:text-gray-900 font-medium"
              >
                Passer cette étape
              </button>
            )}
          </div>
        </Card>

        {/* Step Indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all ${
                s === step
                  ? 'w-8 bg-white'
                  : s < step
                  ? 'w-2 bg-white/70'
                  : 'w-2 bg-white/30'
              }`}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}

