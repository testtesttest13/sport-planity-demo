import { createServerClient } from '@supabase/ssr'
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

  const cookieStore = cookies()
  const response = NextResponse.redirect(`${origin}/onboarding`)

  try {
    // Create Supabase client with proper cookie handling for callback
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )
    
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
    const finalUrl = role === 'admin' ? `${origin}/admin` : role === 'coach' ? `${origin}/coach` : origin
    return NextResponse.redirect(finalUrl)
    
  } catch (err) {
    console.error('Callback unexpected error:', err)
    return NextResponse.redirect(`${origin}/login?error=callback_exception&details=${encodeURIComponent(String(err))}`)
  }
}

