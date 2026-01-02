'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  ChevronLeft,
  Building2,
  MapPin,
  Copy,
  Save,
  Upload,
  Check,
  FileText,
  Globe,
  Phone,
  Mail,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/auth-provider'
import { toast } from 'sonner'

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

interface Club {
  id: string
  name: string
  siret: string | null
  address: string | null
  zip_code: string | null
  city: string | null
  description: string | null
  cover_url: string | null
  logo_url: string | null
  join_code: string | null
  amenities: string[] | null
  sport: string | null
  verified: boolean
}

export default function AdminSettingsPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const supabase = createClient()
  
  const [club, setClub] = useState<Club | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Form state
  const [name, setName] = useState('')
  const [siret, setSiret] = useState('')
  const [address, setAddress] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [city, setCity] = useState('')
  const [description, setDescription] = useState('')
  const [sport, setSport] = useState('')
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      if (!user) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('role, club_id')
        .eq('id', user.id)
        .single()

      if (!profile || profile.role !== 'admin' || !profile.club_id) {
        router.push('/')
        return
      }

      const { data: clubData } = await supabase
        .from('clubs')
        .select('*')
        .eq('id', profile.club_id)
        .single()

      if (clubData) {
        setClub(clubData)
        setName(clubData.name || '')
        setSiret(clubData.siret || '')
        setAddress(clubData.address || '')
        setZipCode(clubData.zip_code || '')
        setCity(clubData.city || '')
        setDescription(clubData.description || '')
        setSport(clubData.sport || '')
        setSelectedAmenities(clubData.amenities || [])
        if (clubData.cover_url) {
          setCoverPreview(clubData.cover_url)
        }
      }

      setLoading(false)
    }

    if (!authLoading) {
      fetchData()
    }
  }, [user, authLoading, supabase, router])

  const copyJoinCode = () => {
    if (club?.join_code) {
      navigator.clipboard.writeText(club.join_code)
      toast.success('Code copié !')
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

  const handleSave = async () => {
    if (!club) return
    setSaving(true)

    try {
      let coverUrl = club.cover_url

      // Upload new cover if provided
      if (coverFile) {
        const fileExt = coverFile.name.split('.').pop()
        const fileName = `club-${club.id}-${Date.now()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, coverFile)

        if (!uploadError) {
          const { data } = supabase.storage.from('avatars').getPublicUrl(fileName)
          coverUrl = data.publicUrl
        }
      }

      // Update club
      const { error } = await supabase
        .from('clubs')
        .update({
          name,
          siret: siret || null,
          address: address || null,
          zip_code: zipCode || null,
          city: city || null,
          description: description || null,
          sport: sport || null,
          amenities: selectedAmenities,
          cover_url: coverUrl,
        })
        .eq('id', club.id)

      if (error) {
        toast.error('Erreur', { description: error.message })
      } else {
        toast.success('Modifications enregistrées !')
        setClub({ ...club, name, siret, address, zip_code: zipCode, city, description, sport, amenities: selectedAmenities, cover_url: coverUrl })
        setCoverFile(null)
      }
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde')
    }

    setSaving(false)
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!club) return null

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="p-2 -ml-2 rounded-xl hover:bg-gray-100">
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Paramètres du club</h1>
              </div>
            </div>
            <Button onClick={handleSave} disabled={saving} className="bg-purple-600 hover:bg-purple-700">
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Enregistrer
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-6 space-y-6">
        {/* Join Code Card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm mb-1">Code d&apos;invitation</p>
                  <p className="text-3xl font-bold tracking-widest">{club.join_code || '-----'}</p>
                  <p className="text-purple-200 text-sm mt-2">
                    Partagez ce code avec vos coachs
                  </p>
                </div>
                <Button
                  onClick={copyJoinCode}
                  variant="secondary"
                  size="lg"
                  className="bg-white/20 hover:bg-white/30 text-white border-0"
                >
                  <Copy className="w-5 h-5 mr-2" />
                  Copier
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Cover Image */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Upload className="w-5 h-5 text-purple-600" />
                Photo de couverture
              </CardTitle>
            </CardHeader>
            <CardContent>
              {coverPreview ? (
                <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
                  <Image src={coverPreview} alt="Cover" fill className="object-cover" />
                </div>
              ) : (
                <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                  <Building2 className="w-16 h-16 text-gray-300" />
                </div>
              )}
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverChange}
                  className="hidden"
                />
                <div className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl cursor-pointer transition-colors text-gray-700 font-medium">
                  <Upload className="w-5 h-5" />
                  {coverPreview ? 'Changer la photo' : 'Ajouter une photo'}
                </div>
              </label>
            </CardContent>
          </Card>
        </motion.div>

        {/* Basic Info */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="w-5 h-5 text-purple-600" />
                Informations générales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nom du club</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-purple-500 outline-none resize-none"
                  placeholder="Décrivez votre club..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Sport principal</label>
                <select
                  value={sport}
                  onChange={(e) => setSport(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-purple-500 outline-none"
                >
                  <option value="">Sélectionner</option>
                  <option value="tennis">Tennis</option>
                  <option value="padel">Padel</option>
                  <option value="yoga">Yoga</option>
                  <option value="boxe">Boxe</option>
                  <option value="fitness">Fitness</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Address */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5 text-purple-600" />
                Adresse
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Adresse</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Rue du Sport"
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-purple-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Code postal</label>
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="75001"
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-purple-500 outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Ville</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Paris"
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-purple-500 outline-none"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Legal */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                Informations légales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">SIRET</label>
                <input
                  type="text"
                  value={siret}
                  onChange={(e) => setSiret(e.target.value)}
                  placeholder="123 456 789 00012"
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-purple-500 outline-none"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Amenities */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Équipements</CardTitle>
            </CardHeader>
            <CardContent>
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
                    <span className={`text-xs font-medium ${
                      selectedAmenities.includes(amenity.id) ? 'text-purple-600' : 'text-gray-600'
                    }`}>
                      {amenity.label}
                    </span>
                    {selectedAmenities.includes(amenity.id) && (
                      <Check className="w-4 h-4 text-purple-600 mt-1" />
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Verification Status */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${club.verified ? 'bg-green-100' : 'bg-yellow-100'}`}>
                    <Check className={`w-6 h-6 ${club.verified ? 'text-green-600' : 'text-yellow-600'}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">
                      {club.verified ? 'Club vérifié' : 'En attente de vérification'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {club.verified 
                        ? 'Votre club est visible sur la plateforme'
                        : 'Votre club sera vérifié sous 24-48h'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

