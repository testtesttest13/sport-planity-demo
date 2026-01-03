'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  ChevronRight, 
  ChevronLeft, 
  Upload, 
  Check, 
  User, 
  Phone, 
  Building2, 
  Dumbbell,
  MapPin,
  FileText,
  Image as ImageIcon,
  Sparkles,
  Copy
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/auth-provider'
import Image from 'next/image'
import { toast } from 'sonner'

// Types
type UserRole = 'client' | 'coach' | 'admin' | null
type ClientStep = 'identity' | 'sport' | 'discovery' | 'success'
type CoachStep = 'code' | 'confirm' | 'success'
type AdminStep = 'identity' | 'club-info' | 'amenities' | 'showcase' | 'success'

// Data
const sports = [
  { id: 'tennis', label: 'Tennis', icon: '🎾' },
  { id: 'padel', label: 'Padel', icon: '🏐' },
  { id: 'yoga', label: 'Yoga', icon: '🧘' },
  { id: 'boxe', label: 'Boxe', icon: '🥊' },
  { id: 'fitness', label: 'Fitness', icon: '💪' },
]

const discoverySources = [
  { id: 'google', label: 'Google', icon: '🔍' },
  { id: 'amis', label: 'Amis', icon: '👥' },
  { id: 'pub', label: 'Publicité', icon: '📢' },
  { id: 'autre', label: 'Autre', icon: '💭' },
]

const amenitiesList = [
  { id: 'wifi', label: 'Wifi', icon: '📶' },
  { id: 'parking', label: 'Parking', icon: '🅿️' },
  { id: 'douches', label: 'Douches', icon: '🚿' },
  { id: 'vestiaires', label: 'Vestiaires', icon: '🚪' },
  { id: 'snack', label: 'Snack', icon: '🍫' },
  { id: 'piscine', label: 'Piscine', icon: '🏊' },
  { id: 'materiel', label: 'Matériel', icon: '🎾' },
  { id: 'pmr', label: 'Accès PMR', icon: '♿' },
]

// Generate random 5-char code
function generateJoinCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export default function OnboardingPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const supabase = createClient()

  // Role selection
  const [selectedRole, setSelectedRole] = useState<UserRole>(null)

  // Client flow state
  const [clientStep, setClientStep] = useState<ClientStep>('identity')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [selectedSport, setSelectedSport] = useState<string | null>(null)
  const [discoverySource, setDiscoverySource] = useState<string | null>(null)

  // Coach flow state
  const [coachStep, setCoachStep] = useState<CoachStep>('code')
  const [joinCode, setJoinCode] = useState(['', '', '', '', ''])
  const [foundClub, setFoundClub] = useState<{ id: string; name: string } | null>(null)
  const [codeError, setCodeError] = useState(false)
  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Admin flow state
  const [adminStep, setAdminStep] = useState<AdminStep>('identity')
  const [clubName, setClubName] = useState('')
  const [siret, setSiret] = useState('')
  const [address, setAddress] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [city, setCity] = useState('')
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [clubDescription, setClubDescription] = useState('')
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [generatedCode, setGeneratedCode] = useState('')

  // Common state
  const [saving, setSaving] = useState(false)

  // Read role from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const roleParam = params.get('role')
    if (roleParam && (roleParam === 'coach' || roleParam === 'admin' || roleParam === 'client')) {
      setSelectedRole(roleParam as UserRole)
      // Clean URL
      const url = new URL(window.location.href)
      url.searchParams.delete('role')
      window.history.replaceState({}, '', url.pathname)
    }
  }, [])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  // ============= HANDLERS =============

  // Handle code input for coach
  const handleCodeInput = (index: number, value: string) => {
    const newValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '')
    if (newValue.length <= 1) {
      const newCode = [...joinCode]
      newCode[index] = newValue
      setJoinCode(newCode)
      setCodeError(false)

      // Auto-focus next input
      if (newValue && index < 4) {
        codeInputRefs.current[index + 1]?.focus()
      }

      // Auto-verify when all filled
      if (newCode.every(c => c) && newCode.join('').length === 5) {
        verifyClubCode(newCode.join(''))
      }
    }
  }

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !joinCode[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus()
    }
  }

  const verifyClubCode = async (code: string) => {
    const { data, error } = await supabase
      .from('clubs')
      .select('id, name')
      .eq('join_code', code)
      .single()

    if (error || !data) {
      setCodeError(true)
      setFoundClub(null)
      toast.error('Code invalide', {
        description: 'Ce code ne correspond à aucun club.',
      })
    } else {
      setFoundClub(data)
      setCoachStep('confirm')
    }
  }

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCoverFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setCoverPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const toggleAmenity = (id: string) => {
    setSelectedAmenities(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    )
  }

  // ============= SAVE HANDLERS =============

  const saveClientProfile = async () => {
    if (!user) return
    setSaving(true)

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: `${firstName} ${lastName}`.trim(),
        sport: selectedSport,
        discovery_source: discoverySource,
        role: 'client',
      })
      .eq('id', user.id)

    if (error) {
      toast.error('Erreur', { description: error.message })
      setSaving(false)
      return
    }

    setClientStep('success')
    setSaving(false)
  }

  const saveCoachProfile = async () => {
    if (!user || !foundClub) return
    setSaving(true)

    // Update profile
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        role: 'coach',
        club_id: foundClub.id,
      })
      .eq('id', user.id)

    if (profileError) {
      toast.error('Erreur', { description: profileError.message })
      setSaving(false)
      return
    }

    // Create coach entry
    const { error: coachError } = await supabase
      .from('coaches')
      .insert({
        profile_id: user.id,
        club_id: foundClub.id,
        speciality: 'Coach',
        bio: '',
        hourly_rate: 50,
        rating: 0,
        review_count: 0,
      })

    if (coachError && !coachError.message.includes('duplicate')) {
      toast.error('Erreur', { description: coachError.message })
      setSaving(false)
      return
    }

    setCoachStep('success')
    setSaving(false)
  }

  const saveAdminAndClub = async () => {
    if (!user) return
    setSaving(true)

    try {
      // Generate join code
      const newJoinCode = generateJoinCode()
      setGeneratedCode(newJoinCode)

      // Upload cover image if provided
      let coverUrl = null
      if (coverFile) {
        const fileExt = coverFile.name.split('.').pop()
        const fileName = `club-${Date.now()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, coverFile)

        if (!uploadError) {
          const { data } = supabase.storage.from('avatars').getPublicUrl(fileName)
          coverUrl = data.publicUrl
        }
      }

      // Create club
      const { data: clubData, error: clubError } = await supabase
        .from('clubs')
        .insert({
          name: clubName,
          siret: siret || null,
          address: address,
          zip_code: zipCode,
          city: city,
          description: clubDescription || null,
          amenities: selectedAmenities,
          cover_url: coverUrl,
          join_code: newJoinCode,
          verified: false,
          rating: 0,
          review_count: 0,
        })
        .select()
        .single()

      if (clubError) {
        toast.error('Erreur', { description: clubError.message })
        setSaving(false)
        return
      }

      // Update profile as admin
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: `${firstName} ${lastName}`.trim(),
          role: 'admin',
          club_id: clubData.id,
        })
        .eq('id', user.id)

      if (profileError) {
        toast.error('Erreur', { description: profileError.message })
        setSaving(false)
        return
      }

      setAdminStep('success')
    } catch (error) {
      console.error(error)
      toast.error('Une erreur est survenue')
    }

    setSaving(false)
  }

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode)
    toast.success('Code copié !')
  }

  // ============= RENDER =============

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  // ============= ROLE SELECTION =============
  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg"
        >
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-slate-900 mb-3">
              Bienvenue sur Simpl.
            </h1>
            <p className="text-gray-600 text-lg">
              Qui êtes-vous ?
            </p>
          </div>

          <div className="space-y-4">
            {/* Client Card */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedRole('client')}
              className="w-full p-6 bg-white border-2 border-gray-200 rounded-2xl hover:border-blue-500 hover:shadow-lg transition-all text-left flex items-center gap-5"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Je suis un Élève</h3>
                <p className="text-gray-600">Je veux réserver des cours de sport</p>
              </div>
              <ChevronRight className="w-6 h-6 text-gray-400 ml-auto" />
            </motion.button>

            {/* Coach Card */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedRole('coach')}
              className="w-full p-6 bg-white border-2 border-gray-200 rounded-2xl hover:border-green-500 hover:shadow-lg transition-all text-left flex items-center gap-5"
            >
              <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center flex-shrink-0">
                <Dumbbell className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Je suis un Coach</h3>
                <p className="text-gray-600">Je veux gérer mon planning et mes cours</p>
              </div>
              <ChevronRight className="w-6 h-6 text-gray-400 ml-auto" />
            </motion.button>

            {/* Admin Card */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedRole('admin')}
              className="w-full p-6 bg-white border-2 border-gray-200 rounded-2xl hover:border-purple-500 hover:shadow-lg transition-all text-left flex items-center gap-5"
            >
              <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">J&apos;inscris mon Club</h3>
                <p className="text-gray-600">Je veux créer et gérer mon établissement</p>
              </div>
              <ChevronRight className="w-6 h-6 text-gray-400 ml-auto" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    )
  }

  // ============= CLIENT FLOW =============
  if (selectedRole === 'client') {
    const clientSteps: ClientStep[] = ['identity', 'sport', 'discovery', 'success']
    const currentIndex = clientSteps.indexOf(clientStep)
    const progress = ((currentIndex + 1) / clientSteps.length) * 100

    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-lg border border-gray-200 overflow-hidden">
            {/* Progress */}
            <div className="h-1.5 bg-gray-100">
              <motion.div className="h-full bg-blue-600" animate={{ width: `${progress}%` }} />
            </div>

            <div className="p-8">
              <AnimatePresence mode="wait">
                {/* Identity */}
                {clientStep === 'identity' && (
                  <motion.div
                    key="identity"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">Qui êtes-vous ?</h2>
                    <p className="text-gray-600 text-sm text-center mb-6">Commençons par votre nom</p>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Prénom</label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Sophie"
                          className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-600 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Nom</label>
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Durand"
                          className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-600 outline-none"
                        />
                      </div>
                    </div>

                    <Button
                      onClick={() => setClientStep('sport')}
                      disabled={!firstName.trim() || !lastName.trim()}
                      className="w-full mt-6 h-12 bg-blue-600 hover:bg-blue-700"
                    >
                      Continuer <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  </motion.div>
                )}

                {/* Sport */}
                {clientStep === 'sport' && (
                  <motion.div
                    key="sport"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">Votre passion</h2>
                    <p className="text-gray-600 text-sm text-center mb-6">Quel sport vous intéresse ?</p>

                    <div className="grid grid-cols-2 gap-3">
                      {sports.map((sport) => (
                        <button
                          key={sport.id}
                          onClick={() => setSelectedSport(sport.id)}
                          className={`p-4 rounded-2xl border-2 transition-all ${
                            selectedSport === sport.id
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-3xl mb-2">{sport.icon}</div>
                          <div className={`text-sm font-medium ${selectedSport === sport.id ? 'text-blue-600' : 'text-slate-700'}`}>
                            {sport.label}
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-3 mt-6">
                      <Button variant="outline" onClick={() => setClientStep('identity')} className="flex-1">
                        <ChevronLeft className="w-5 h-5 mr-2" /> Retour
                      </Button>
                      <Button
                        onClick={() => setClientStep('discovery')}
                        disabled={!selectedSport}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                      >
                        Continuer <ChevronRight className="w-5 h-5 ml-2" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Discovery */}
                {clientStep === 'discovery' && (
                  <motion.div
                    key="discovery"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">Comment nous avez-vous connu ?</h2>
                    <p className="text-gray-600 text-sm text-center mb-6">Aidez-nous à améliorer</p>

                    <div className="grid grid-cols-2 gap-3">
                      {discoverySources.map((source) => (
                        <button
                          key={source.id}
                          onClick={() => setDiscoverySource(source.id)}
                          className={`p-4 rounded-2xl border-2 transition-all ${
                            discoverySource === source.id
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-2xl mb-2">{source.icon}</div>
                          <div className={`text-sm font-medium ${discoverySource === source.id ? 'text-blue-600' : 'text-slate-700'}`}>
                            {source.label}
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-3 mt-6">
                      <Button variant="outline" onClick={() => setClientStep('sport')} className="flex-1">
                        <ChevronLeft className="w-5 h-5 mr-2" /> Retour
                      </Button>
                      <Button
                        onClick={saveClientProfile}
                        disabled={!discoverySource || saving}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                      >
                        {saving ? 'Enregistrement...' : 'Terminer'}
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Success */}
                {clientStep === 'success' && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-20 h-20 mx-auto rounded-full bg-blue-600 flex items-center justify-center mb-6">
                      <Check className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Bienvenue {firstName} ! 👋</h2>
                    <p className="text-gray-600 mb-6">Votre profil est prêt. Commençons !</p>
                    <Button onClick={() => router.push('/')} className="w-full h-12 bg-blue-600 hover:bg-blue-700">
                      Découvrir les clubs
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>

          {/* Back to role selection */}
          {clientStep !== 'success' && (
            <button
              onClick={() => setSelectedRole(null)}
              className="w-full mt-4 text-sm text-gray-500 hover:text-gray-700"
            >
              ← Changer de profil
            </button>
          )}
        </motion.div>
      </div>
    )
  }

  // ============= COACH FLOW =============
  if (selectedRole === 'coach') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-8">
              <AnimatePresence mode="wait">
                {/* Code Input */}
                {coachStep === 'code' && (
                  <motion.div
                    key="code"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-green-100 flex items-center justify-center mb-6">
                      <Dumbbell className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Rejoignez votre Club</h2>
                    <p className="text-gray-600 text-sm mb-8">Entrez le code à 5 caractères fourni par votre club</p>

                    {/* PIN Input */}
                    <div className="flex justify-center gap-3 mb-6">
                      {[0, 1, 2, 3, 4].map((index) => (
                        <input
                          key={index}
                          ref={(el) => { codeInputRefs.current[index] = el }}
                          type="text"
                          maxLength={1}
                          value={joinCode[index]}
                          onChange={(e) => handleCodeInput(index, e.target.value)}
                          onKeyDown={(e) => handleCodeKeyDown(index, e)}
                          className={`w-14 h-16 text-center text-2xl font-bold rounded-xl border-2 outline-none transition-all ${
                            codeError
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-200 focus:border-green-500 bg-gray-50'
                          }`}
                        />
                      ))}
                    </div>

                    {codeError && (
                      <p className="text-red-500 text-sm mb-4">Code invalide. Vérifiez et réessayez.</p>
                    )}

                    <p className="text-gray-500 text-sm">
                      Je n&apos;ai pas de code ?{' '}
                      <button className="text-green-600 font-medium hover:underline">
                        Demandez-le à votre administrateur
                      </button>
                    </p>
                  </motion.div>
                )}

                {/* Confirm Club */}
                {coachStep === 'confirm' && foundClub && (
                  <motion.div
                    key="confirm"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-green-100 flex items-center justify-center mb-6">
                      <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Club trouvé !</h2>
                    <p className="text-gray-600 mb-6">Confirmez-vous rejoindre ce club ?</p>

                    <div className="p-6 bg-gray-50 rounded-2xl mb-6">
                      <p className="text-xl font-bold text-slate-900">{foundClub.name}</p>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setCoachStep('code')
                          setJoinCode(['', '', '', '', ''])
                          setFoundClub(null)
                        }}
                        className="flex-1"
                      >
                        Annuler
                      </Button>
                      <Button
                        onClick={saveCoachProfile}
                        disabled={saving}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        {saving ? 'Enregistrement...' : 'Confirmer'}
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Success */}
                {coachStep === 'success' && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-20 h-20 mx-auto rounded-full bg-green-600 flex items-center justify-center mb-6">
                      <Check className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Bienvenue Coach ! 🎉</h2>
                    <p className="text-gray-600 mb-6">Vous avez rejoint {foundClub?.name}</p>
                    <Button onClick={() => router.push('/coach')} className="w-full h-12 bg-green-600 hover:bg-green-700">
                      Accéder à mon Dashboard
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>

          {/* Back to role selection */}
          {coachStep === 'code' && (
            <button
              onClick={() => setSelectedRole(null)}
              className="w-full mt-4 text-sm text-gray-500 hover:text-gray-700"
            >
              ← Changer de profil
            </button>
          )}
        </motion.div>
      </div>
    )
  }

  // ============= ADMIN FLOW =============
  if (selectedRole === 'admin') {
    const adminSteps: AdminStep[] = ['identity', 'club-info', 'amenities', 'showcase', 'success']
    const currentIndex = adminSteps.indexOf(adminStep)
    const progress = ((currentIndex + 1) / adminSteps.length) * 100

    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-lg border border-gray-200 overflow-hidden">
            {/* Progress */}
            <div className="h-1.5 bg-gray-100">
              <motion.div className="h-full bg-purple-600" animate={{ width: `${progress}%` }} />
            </div>

            <div className="p-8">
              <AnimatePresence mode="wait">
                {/* Identity */}
                {adminStep === 'identity' && (
                  <motion.div
                    key="identity"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">Qui êtes-vous ?</h2>
                    <p className="text-gray-600 text-sm text-center mb-6">Vos informations personnelles</p>

                    <div className="space-y-4">
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Prénom"
                        className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-purple-600 outline-none"
                      />
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Nom"
                        className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-purple-600 outline-none"
                      />
                    </div>

                    <Button
                      onClick={() => setAdminStep('club-info')}
                      disabled={!firstName.trim() || !lastName.trim()}
                      className="w-full mt-6 h-12 bg-purple-600 hover:bg-purple-700"
                    >
                      Continuer <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  </motion.div>
                )}

                {/* Club Info */}
                {adminStep === 'club-info' && (
                  <motion.div
                    key="club-info"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">Votre Club</h2>
                    <p className="text-gray-600 text-sm text-center mb-6">Informations légales</p>

                    <div className="space-y-4">
                      <input
                        type="text"
                        value={clubName}
                        onChange={(e) => setClubName(e.target.value)}
                        placeholder="Nom du club *"
                        className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-purple-600 outline-none"
                      />
                      <input
                        type="text"
                        value={siret}
                        onChange={(e) => setSiret(e.target.value)}
                        placeholder="SIRET (facultatif)"
                        className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-purple-600 outline-none"
                      />
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Adresse *"
                        className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-purple-600 outline-none"
                      />
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={zipCode}
                          onChange={(e) => setZipCode(e.target.value)}
                          placeholder="Code postal *"
                          className="w-1/3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-purple-600 outline-none"
                        />
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Ville *"
                          className="flex-1 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-purple-600 outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <Button variant="outline" onClick={() => setAdminStep('identity')} className="flex-1">
                        <ChevronLeft className="w-5 h-5 mr-2" /> Retour
                      </Button>
                      <Button
                        onClick={() => setAdminStep('amenities')}
                        disabled={!clubName.trim() || !address.trim() || !zipCode.trim() || !city.trim()}
                        className="flex-1 bg-purple-600 hover:bg-purple-700"
                      >
                        Continuer <ChevronRight className="w-5 h-5 ml-2" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Amenities */}
                {adminStep === 'amenities' && (
                  <motion.div
                    key="amenities"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">Équipements</h2>
                    <p className="text-gray-600 text-sm text-center mb-6">Sélectionnez ce que propose votre club</p>

                    <div className="grid grid-cols-4 gap-3">
                      {amenitiesList.map((amenity) => (
                        <button
                          key={amenity.id}
                          onClick={() => toggleAmenity(amenity.id)}
                          className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center ${
                            selectedAmenities.includes(amenity.id)
                              ? 'border-purple-600 bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <span className="text-2xl mb-1">{amenity.icon}</span>
                          <span className={`text-xs font-medium ${selectedAmenities.includes(amenity.id) ? 'text-purple-600' : 'text-gray-600'}`}>
                            {amenity.label}
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-3 mt-6">
                      <Button variant="outline" onClick={() => setAdminStep('club-info')} className="flex-1">
                        <ChevronLeft className="w-5 h-5 mr-2" /> Retour
                      </Button>
                      <Button
                        onClick={() => setAdminStep('showcase')}
                        className="flex-1 bg-purple-600 hover:bg-purple-700"
                      >
                        Continuer <ChevronRight className="w-5 h-5 ml-2" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Showcase */}
                {adminStep === 'showcase' && (
                  <motion.div
                    key="showcase"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">Vitrine</h2>
                    <p className="text-gray-600 text-sm text-center mb-6">Photo et description de votre club</p>

                    <div className="space-y-4">
                      {/* Cover Upload */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Photo de couverture</label>
                        {coverPreview ? (
                          <div className="relative aspect-video rounded-xl overflow-hidden mb-2">
                            <Image src={coverPreview} alt="Cover" fill className="object-cover" />
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center h-32 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 cursor-pointer hover:border-purple-400">
                            <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500">Ajouter une photo</span>
                            <input type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
                          </label>
                        )}
                        {coverPreview && (
                          <label className="text-sm text-purple-600 cursor-pointer hover:underline">
                            Changer la photo
                            <input type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
                          </label>
                        )}
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Description (facultatif)</label>
                        <textarea
                          value={clubDescription}
                          onChange={(e) => setClubDescription(e.target.value)}
                          placeholder="Décrivez votre club en quelques mots..."
                          rows={3}
                          className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-purple-600 outline-none resize-none"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <Button variant="outline" onClick={() => setAdminStep('amenities')} className="flex-1">
                        <ChevronLeft className="w-5 h-5 mr-2" /> Retour
                      </Button>
                      <Button
                        onClick={saveAdminAndClub}
                        disabled={saving}
                        className="flex-1 bg-purple-600 hover:bg-purple-700"
                      >
                        {saving ? 'Création...' : 'Créer mon club'}
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Success */}
                {adminStep === 'success' && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-6"
                  >
                    <div className="w-20 h-20 mx-auto rounded-full bg-purple-600 flex items-center justify-center mb-6">
                      <Sparkles className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Votre club est créé ! 🎉</h2>
                    <p className="text-gray-600 mb-6">Partagez ce code avec vos coachs</p>

                    {/* Code Display */}
                    <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-6 mb-6">
                      <p className="text-sm text-purple-600 font-medium mb-2">CODE CLUB</p>
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-4xl font-bold text-purple-700 tracking-widest">{generatedCode}</span>
                        <button
                          onClick={copyCode}
                          className="p-2 rounded-lg bg-purple-100 hover:bg-purple-200 transition-colors"
                        >
                          <Copy className="w-5 h-5 text-purple-600" />
                        </button>
                      </div>
                    </div>

                    <Button onClick={() => router.push('/admin')} className="w-full h-12 bg-purple-600 hover:bg-purple-700">
                      Accéder à mon Dashboard
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>

          {/* Back to role selection */}
          {adminStep !== 'success' && (
            <button
              onClick={() => setSelectedRole(null)}
              className="w-full mt-4 text-sm text-gray-500 hover:text-gray-700"
            >
              ← Changer de profil
            </button>
          )}
        </motion.div>
      </div>
    )
  }

  return null
}
