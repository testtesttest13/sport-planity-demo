import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const origin = 'https://sport-planity-demo-jwbw.vercel.app'

  console.log('=== AUTH CALLBACK DEBUG ===')
  console.log('URL:', requestUrl.href)
  console.log('Code present:', !!code)
  console.log('Error param:', error)

  // Handle OAuth errors
  if (error) {
    console.error('OAuth error from provider:', error)
    return NextResponse.redirect(`${origin}/login?error=${error}`)
  }

  if (!code) {
    console.error('No code in callback')
    return NextResponse.redirect(`${origin}/login?error=no_code`)
  }

  try {
    const supabase = createClient()
    
    console.log('Exchanging code for session...')
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error('Exchange error:', exchangeError)
      return NextResponse.redirect(`${origin}/login?error=exchange_failed&details=${encodeURIComponent(exchangeError.message)}`)
    }

    if (!data.user) {
      console.error('No user after exchange')
      return NextResponse.redirect(`${origin}/login?error=no_user`)
    }

    console.log('User authenticated:', data.user.id)

    // Check if user has completed onboarding
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, full_name')
      .eq('id', data.user.id)
      .single()

    console.log('Profile:', profile)
    console.log('Profile error:', profileError)

    if (profileError || !profile) {
      console.log('No profile found, redirecting to onboarding')
      return NextResponse.redirect(`${origin}/onboarding`)
    }

    // If no full_name or it's just the email, redirect to onboarding
    if (!profile.full_name || profile.full_name === data.user.email || profile.full_name.includes('@')) {
      console.log('Profile incomplete, redirecting to onboarding')
      return NextResponse.redirect(`${origin}/onboarding`)
    }

    const role = profile.role || 'client'
    console.log('Redirecting based on role:', role)

    // Redirect based on role
    if (role === 'admin') {
      return NextResponse.redirect(`${origin}/admin`)
    } else if (role === 'coach') {
      return NextResponse.redirect(`${origin}/coach`)
    } else {
      return NextResponse.redirect(`${origin}/`)
    }
  } catch (err) {
    console.error('Callback unexpected error:', err)
    return NextResponse.redirect(`${origin}/login?error=callback_exception&details=${encodeURIComponent(String(err))}`)
  }
}

