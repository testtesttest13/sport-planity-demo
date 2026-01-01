'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Mail, Lock, User, Briefcase, Building } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const supabase = createClient()

  const handleGoogleLogin = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `https://sport-planity-demo-jwbw.vercel.app/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

    if (error) {
      alert(`Erreur: ${error.message}`)
      setLoading(false)
    }
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (mode === 'signup') {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: email.split('@')[0],
            role: 'client',
          },
        },
      })

      if (error) {
        alert(`Erreur: ${error.message}`)
      } else if (data.user) {
        alert('Compte créé ! Vérifiez votre email pour confirmer.')
        setMode('signin')
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        alert(`Erreur: ${error.message}`)
      } else if (data.user) {
        // Get user role from profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single()

        const role = profile?.role || 'client'
        
        // Redirect based on role
        if (role === 'admin') {
          router.push('/admin')
        } else if (role === 'coach') {
          router.push('/coach')
        } else {
          router.push('/')
        }
      }
    }

    setLoading(false)
  }

  const handleDemoLogin = async (role: 'client' | 'coach' | 'admin') => {
    setLoading(true)
    
    const demoAccounts = {
      client: { email: 'demo.client@sportplanity.com', password: 'Demo123!', name: 'Sophie Durand' },
      coach: { email: 'demo.coach@sportplanity.com', password: 'Demo123!', name: 'Mathis Dubois' },
      admin: { email: 'demo.admin@sportplanity.com', password: 'Demo123!', name: 'Pierre Lefebvre' },
    }

    const account = demoAccounts[role]

    // Try to sign in first
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: account.email,
      password: account.password,
    })

    if (signInError) {
      // If account doesn't exist, create it
      const { error: signUpError, data: signUpData } = await supabase.auth.signUp({
        email: account.email,
        password: account.password,
        options: {
          data: {
            full_name: account.name,
            role: role,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (signUpError) {
        alert(`Erreur lors de la création du compte démo: ${signUpError.message}`)
        setLoading(false)
        return
      }

      // Auto-confirm for demo (in production, user would need to verify email)
      alert('Compte démo créé ! En production, un email de confirmation serait envoyé. Pour la démo, reconnectez-vous.')
      setLoading(false)
      return
    }

    // Redirect based on role
    if (role === 'admin') {
      router.push('/admin')
    } else if (role === 'coach') {
      router.push('/coach')
    } else {
      router.push('/')
    }

    setLoading(false)
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
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">🎾</span>
            </div>
            <CardTitle className="text-3xl font-bold">Sport Planity</CardTitle>
            <p className="text-gray-600">
              Réservez vos cours avec les meilleurs coachs
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Google Login */}
            <Button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full h-12 bg-white text-gray-900 hover:bg-gray-50 border-2 border-gray-200"
              variant="outline"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              S&apos;inscrire avec Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">
                  Ou mode démo
                </span>
              </div>
            </div>

            {/* Demo Accounts */}
            <div className="space-y-3">
              <Button
                onClick={() => handleDemoLogin('client')}
                disabled={loading}
                variant="outline"
                className="w-full h-12 justify-start"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white mr-3">
                  <User className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Sophie (Cliente)</p>
                  <p className="text-xs text-gray-500">Réserver des cours</p>
                </div>
              </Button>

              <Button
                onClick={() => handleDemoLogin('coach')}
                disabled={loading}
                variant="outline"
                className="w-full h-12 justify-start"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white mr-3">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Mathis (Coach)</p>
                  <p className="text-xs text-gray-500">Gérer mon planning</p>
                </div>
              </Button>

              <Button
                onClick={() => handleDemoLogin('admin')}
                disabled={loading}
                variant="outline"
                className="w-full h-12 justify-start"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white mr-3">
                  <Building className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Pierre (Admin)</p>
                  <p className="text-xs text-gray-500">Gérer mon club</p>
                </div>
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">
                  Ou avec email
                </span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div>
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border-2 border-gray-200 focus-within:border-blue-500 transition-colors">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 bg-transparent border-none outline-none text-gray-900"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border-2 border-gray-200 focus-within:border-blue-500 transition-colors">
                  <Lock className="w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="flex-1 bg-transparent border-none outline-none text-gray-900"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12"
              >
                {mode === 'signin' ? 'Se connecter' : 'Créer un compte'}
              </Button>

              <button
                type="button"
                onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                className="w-full text-sm text-gray-600 hover:text-gray-900"
              >
                {mode === 'signin'
                  ? 'Pas encore de compte ? Inscrivez-vous'
                  : 'Déjà un compte ? Connectez-vous'}
              </button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-white/80 mt-6">
          En vous connectant, vous acceptez nos conditions d&apos;utilisation
        </p>
      </motion.div>
    </div>
  )
}

