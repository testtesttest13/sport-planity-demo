import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@/lib/supabase/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { email, clubId, role } = await request.json()

    // Get current user session
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, club_id')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 })
    }

    // Get club details
    const { data: club } = await supabase
      .from('clubs')
      .select('name')
      .eq('id', clubId)
      .single()

    if (!club) {
      return NextResponse.json({ error: 'Club not found' }, { status: 404 })
    }

    // Generate invitation token
    const token = crypto.randomUUID()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // Expires in 7 days

    // Create invitation record
    const { error: inviteError } = await supabase.from('invitations').insert({
      email,
      club_id: clubId,
      invited_by: user.id,
      role: role || 'coach',
      token,
      expires_at: expiresAt.toISOString(),
      status: 'pending',
    })

    if (inviteError) {
      console.error('Invite creation error:', inviteError)
      return NextResponse.json(
        { error: 'Failed to create invitation' },
        { status: 500 }
      )
    }

    // Send email via Resend
    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/invite/accept?token=${token}`

    try {
      await resend.emails.send({
        from: 'Sport Planity <onboarding@resend.dev>',
        to: email,
        subject: `Invitation à rejoindre ${club.name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
              <h1 style="color: white; font-size: 32px; margin: 0;">🎾 Sport Planity</h1>
            </div>
            
            <div style="padding: 40px; background: #f9fafb;">
              <h2 style="color: #1f2937; margin-bottom: 20px;">
                Vous avez été invité à rejoindre ${club.name}
              </h2>
              
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                Bonjour,
              </p>
              
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                Vous avez été invité à rejoindre <strong>${club.name}</strong> en tant que <strong>${role === 'coach' ? 'Coach' : 'Administrateur'}</strong> sur Sport Planity.
              </p>
              
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                Cliquez sur le bouton ci-dessous pour accepter l'invitation et créer votre compte :
              </p>
              
              <div style="text-align: center; margin: 40px 0;">
                <a href="${inviteLink}" 
                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                          color: white; 
                          padding: 16px 32px; 
                          text-decoration: none; 
                          border-radius: 12px; 
                          font-weight: bold;
                          display: inline-block;">
                  Accepter l'invitation
                </a>
              </div>
              
              <p style="color: #9ca3af; font-size: 14px; line-height: 1.6;">
                Ce lien expire dans 7 jours. Si vous n'avez pas demandé cette invitation, vous pouvez ignorer cet email.
              </p>
              
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
              
              <p style="color: #9ca3af; font-size: 12px; text-align: center;">
                © 2026 Sport Planity. Tous droits réservés.
              </p>
            </div>
          </div>
        `,
      })

      return NextResponse.json({
        success: true,
        message: 'Invitation envoyée avec succès',
      })
    } catch (emailError) {
      console.error('Email sending error:', emailError)
      
      // If Resend fails (no API key), still return success for demo
      if (!process.env.RESEND_API_KEY) {
        return NextResponse.json({
          success: true,
          message: 'Invitation créée (email désactivé en démo)',
          demo: true,
          inviteLink, // Return link for demo purposes
        })
      }

      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Invite API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

