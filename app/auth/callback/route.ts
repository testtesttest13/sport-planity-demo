import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  
  // Use the request origin dynamically, fallback to env var or localhost
  const origin = requestUrl.origin || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  console.log('=== AUTH CALLBACK DEBUG ===')
  console.log('URL:', requestUrl.href)
  console.log('Origin:', origin)
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

  try {
    // Create a mutable response that will be updated with cookies
    let redirectUrl = `${origin}/onboarding`
    const response = NextResponse.redirect(redirectUrl)
    
    // Create Supabase client with proper cookie handling for callback
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }>) {
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

    if (!data.session) {
      console.error('No session after exchange')
      return NextResponse.redirect(`${origin}/login?error=no_session`)
    }

    console.log('User authenticated:', data.user.id, 'Session:', !!data.session)

    // Check if user has completed onboarding
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, full_name')
      .eq('id', data.user.id)
      .single()

    console.log('Profile:', profile)
    console.log('Profile error:', profileError)

    // Determine redirect URL
    // With Google OAuth, email is already verified, so always go to onboarding if profile incomplete
    if (profileError || !profile) {
      console.log('No profile found, redirecting to onboarding')
      redirectUrl = `${origin}/onboarding`
    } else if (!profile.full_name || profile.full_name === data.user.email || profile.full_name.includes('@')) {
      console.log('Profile incomplete, redirecting to onboarding')
      redirectUrl = `${origin}/onboarding`
    } else {
      // Profile is complete, redirect based on role
      const role = profile.role || 'client'
      console.log('Redirecting based on role:', role)
      redirectUrl = role === 'admin' ? `${origin}/admin` : role === 'coach' ? `${origin}/coach` : `${origin}`
    }

    // Create new redirect response with the correct URL and copy all cookies
    const finalResponse = NextResponse.redirect(redirectUrl)
    // Copy all cookies from the response (set by setAll during exchangeCodeForSession)
    response.cookies.getAll().forEach((cookie) => {
      finalResponse.cookies.set(cookie.name, cookie.value, {
        ...cookie,
        httpOnly: cookie.httpOnly ?? true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: cookie.sameSite ?? 'lax',
        path: cookie.path ?? '/',
      })
    })

    console.log('Redirecting to:', redirectUrl)
    console.log('Cookies set:', response.cookies.getAll().length)

    return finalResponse
    
  } catch (err) {
    console.error('Callback unexpected error:', err)
    return NextResponse.redirect(`${origin}/login?error=callback_exception&details=${encodeURIComponent(String(err))}`)
  }
}

