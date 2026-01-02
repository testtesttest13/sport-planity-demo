'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const supabase = createClient()
  
  // Check for auth errors in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const error = params.get('error')
    const details = params.get('details')
    
    if (error) {
      console.error('Auth error:', error, details)
      
      const errorMessages: Record<string, string> = {
        'auth_error': 'Erreur d\'authentification',
        'exchange_failed': 'Échec de l\'échange de code',
        'no_code': 'Code manquant',
        'no_user': 'Utilisateur non trouvé',
        'callback_failed': 'Erreur dans le callback',
        'callback_exception': 'Exception dans le callback',
      }
      
      const message = errorMessages[error] || 'Erreur inconnue'
      toast.error(message, {
        description: details || undefined,
      })
      
      // Clean URL
      window.history.replaceState({}, '', '/login')
    }
  }, [])

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
        
        const role = profile?.role || 'client'
        if (role === 'admin') {
          router.push('/admin')
        } else if (role === 'coach') {
          router.push('/coach')
        } else {
          router.push('/')
        }
      }
    }
    checkUser()
  }, [router, supabase])

  const handleGoogleLogin = async () => {
    setLoading(true)
    
    try {
      const redirectTo = `${window.location.origin}/auth/callback`
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          skipBrowserRedirect: false,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      if (error) {
        console.error('Google OAuth error:', error)
        toast.error('Erreur', {
          description: error.message,
        })
        setLoading(false)
      }
      
      if (data?.url) {
        window.location.href = data.url
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      setLoading(false)
    }
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (mode === 'signup') {
      const emailRedirectTo = `${window.location.origin}/onboarding`
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo,
          data: {
            full_name: email.split('@')[0],
            role: 'client',
          },
        },
      })

      if (error) {
        toast.error('Erreur', {
          description: error.message,
        })
      } else if (data.user) {
        if (data.session) {
          router.push('/onboarding')
        } else {
          toast.success('Compte créé !', {
            description: 'Vérifiez votre email pour confirmer votre inscription.',
          })
        }
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast.error('Erreur', {
          description: error.message,
        })
      } else if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, full_name')
          .eq('id', data.user.id)
          .single()

        if (!profile || !profile.full_name || profile.full_name.includes('@')) {
          router.push('/onboarding')
          return
        }

        const role = profile.role || 'client'
        
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
            <CardTitle className="text-3xl font-bold text-slate-900">Simpl.</CardTitle>
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
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {mode === 'signup' ? "S'inscrire avec Google" : 'Se connecter avec Google'}
            </Button>

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
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="flex-1 bg-transparent border-none outline-none text-gray-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Chargement...
                  </div>
                ) : (
                  mode === 'signin' ? 'Se connecter' : "S'inscrire"
                )}
              </Button>

              <button
                type="button"
                onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                className="w-full text-sm text-gray-600 hover:text-gray-900 font-medium"
              >
                {mode === 'signin'
                  ? "Pas encore de compte ? S'inscrire"
                  : 'Déjà un compte ? Se connecter'}
              </button>
            </form>

            <div className="text-center pt-4 border-t">
              <button
                type="button"
                onClick={() => router.push('/')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                ← Retour à l&apos;accueil
              </button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-white/80 mt-6">
          En vous connectant, vous acceptez nos conditions d&apos;utilisation
        </p>
      </motion.div>
    </div>
  )
}
