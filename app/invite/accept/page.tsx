'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Check, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'

export default function AcceptInvitePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams?.get('token')
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading')
  const [clubName, setClubName] = useState('')
  const [role, setRole] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      return
    }

    validateInvitation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const validateInvitation = async () => {
    const supabase = createClient()

    // Check invitation
    const { data: invitation, error } = await supabase
      .from('invitations')
      .select('*, clubs(name)')
      .eq('token', token)
      .single()

    if (error || !invitation) {
      setStatus('error')
      return
    }

    // Check if expired
    if (new Date(invitation.expires_at) < new Date()) {
      setStatus('expired')
      return
    }

    // Check if already accepted
    if (invitation.status === 'accepted') {
      setStatus('error')
      return
    }

    setClubName(invitation.clubs?.name || 'le club')
    setRole(invitation.role)
    setStatus('success')
  }

  const handleAccept = () => {
    router.push(`/login?token=${token}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-0">
          <CardHeader className="space-y-1 text-center pb-6">
            <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4">
              {status === 'loading' && (
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              )}
              {status === 'success' && (
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
              )}
              {(status === 'error' || status === 'expired') && (
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <X className="w-8 h-8 text-red-600" />
                </div>
              )}
            </div>
            <CardTitle className="text-2xl font-bold">
              {status === 'loading' && 'Vérification...'}
              {status === 'success' && 'Invitation valide !'}
              {status === 'expired' && 'Invitation expirée'}
              {status === 'error' && 'Invitation invalide'}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6 text-center">
            {status === 'loading' && (
              <p className="text-gray-600">
                Vérification de votre invitation en cours...
              </p>
            )}

            {status === 'success' && (
              <>
                <p className="text-gray-700">
                  Vous avez été invité à rejoindre <strong>{clubName}</strong> en tant que{' '}
                  <strong>{role === 'coach' ? 'Coach' : 'Administrateur'}</strong>.
                </p>
                <Button onClick={handleAccept} className="w-full h-12">
                  Créer mon compte
                </Button>
              </>
            )}

            {status === 'expired' && (
              <>
                <p className="text-gray-700">
                  Cette invitation a expiré. Veuillez contacter l&apos;administrateur du club
                  pour obtenir une nouvelle invitation.
                </p>
                <Button
                  onClick={() => router.push('/login')}
                  variant="outline"
                  className="w-full h-12"
                >
                  Retour à la connexion
                </Button>
              </>
            )}

            {status === 'error' && (
              <>
                <p className="text-gray-700">
                  Cette invitation n&apos;est pas valide ou a déjà été utilisée.
                </p>
                <Button
                  onClick={() => router.push('/login')}
                  variant="outline"
                  className="w-full h-12"
                >
                  Retour à la connexion
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

