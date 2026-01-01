import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = 'https://sport-planity-demo-jwbw.vercel.app'

  if (code) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Check if user has completed onboarding
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', data.user.id)
        .single()

      // If no full_name, redirect to onboarding
      if (!profile || !profile.full_name || profile.full_name === data.user.email) {
        return NextResponse.redirect(`${origin}/onboarding`)
      }

      const role = profile?.role || 'client'

      // Redirect based on role
      if (role === 'admin') {
        return NextResponse.redirect(`${origin}/admin`)
      } else if (role === 'coach') {
        return NextResponse.redirect(`${origin}/coach`)
      } else {
        return NextResponse.redirect(`${origin}/`)
      }
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth_error`)
}

