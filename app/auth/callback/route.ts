import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const origin = 'https://sport-planity-demo-jwbw.vercel.app'

  // Handle OAuth errors
  if (error) {
    console.error('OAuth error:', error)
    return NextResponse.redirect(`${origin}/login?error=${error}`)
  }

  if (code) {
    try {
      const supabase = createClient()
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

      if (exchangeError) {
        console.error('Exchange error:', exchangeError)
        return NextResponse.redirect(`${origin}/login?error=exchange_failed`)
      }

      if (data.user) {
        // Check if user has completed onboarding
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role, full_name')
          .eq('id', data.user.id)
          .single()

        if (profileError) {
          console.error('Profile fetch error:', profileError)
          // Profile doesn't exist yet, redirect to onboarding
          return NextResponse.redirect(`${origin}/onboarding`)
        }

        // If no full_name or it's just the email, redirect to onboarding
        if (!profile.full_name || profile.full_name === data.user.email || profile.full_name.includes('@')) {
          return NextResponse.redirect(`${origin}/onboarding`)
        }

        const role = profile.role || 'client'

        // Redirect based on role
        if (role === 'admin') {
          return NextResponse.redirect(`${origin}/admin`)
        } else if (role === 'coach') {
          return NextResponse.redirect(`${origin}/coach`)
        } else {
          return NextResponse.redirect(`${origin}/`)
        }
      }
    } catch (err) {
      console.error('Callback error:', err)
      return NextResponse.redirect(`${origin}/login?error=callback_failed`)
    }
  }

  // No code provided
  return NextResponse.redirect(`${origin}/login?error=no_code`)
}

