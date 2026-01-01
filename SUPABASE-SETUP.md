# 🚀 Supabase Setup Instructions

## ⚡ Quick Start (5 minutes)

### Step 1: Create `.env.local` file

Create a file named `.env.local` in the root of your project with:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://ivzvjwqvqvunkiyyyrub.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2enZqd3F2cXZ1bmtpeXl5cnViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY3ODE1MDgsImV4cCI6MjA1MjM1NzUwOH0.sb_publishable_3xSuQMe7ENKyXx2F-km6Ug_2ktL65d9

# Resend (for email invitations - optional for now)
RESEND_API_KEY=your_resend_api_key_here

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Run SQL Setup

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/ivzvjwqvqvunkiyyyrub
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy the entire content of `supabase/setup.sql`
5. Paste it into the SQL Editor
6. Click "Run" (or press Cmd/Ctrl + Enter)

**Expected output**: "Success! ✅"

### Step 4: Enable Google Authentication

1. In Supabase Dashboard, go to "Authentication" > "Providers"
2. Find "Google" and click "Enable"
3. You need a Google OAuth Client:
   - Go to https://console.cloud.google.com/
   - Create a new project (or select existing)
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client ID"
   - Application type: "Web application"
   - Add authorized redirect URI: `https://ivzvjwqvqvunkiyyyrub.supabase.co/auth/v1/callback`
   - Copy Client ID and Client Secret
4. Paste them in Supabase Google provider settings
5. **Save**

### Step 5: Run the App

```bash
npm run dev
```

Navigate to http://localhost:3000/login

---

## 📋 What Was Created

### Database Tables

| Table | Description |
|-------|-------------|
| `clubs` | Sports clubs with details |
| `profiles` | User profiles (linked to auth.users) |
| `coaches` | Coach-specific data |
| `coach_availability` | Weekly schedule for each coach |
| `bookings` | All reservations |
| `invitations` | Pending invitations |
| `reviews` | User reviews |

### Authentication

- ✅ Google OAuth login
- ✅ Email/Password login
- ✅ Automatic profile creation on signup
- ✅ Role-based access (client, coach, admin)

### Demo Accounts

The app creates 3 demo accounts automatically on first login:

| Role | Email | Password |
|------|-------|----------|
| Client | `demo.client@sportplanity.com` | `Demo123!` |
| Coach | `demo.coach@sportplanity.com` | `Demo123!` |
| Admin | `demo.admin@sportplanity.com` | `Demo123!` |

---

## 🔑 Environment Variables Explained

### NEXT_PUBLIC_SUPABASE_URL
Your Supabase project URL. This is public and safe to expose.

### NEXT_PUBLIC_SUPABASE_ANON_KEY
Public anonymous key. Safe to expose (has RLS restrictions).

### RESEND_API_KEY (Optional)
For sending invitation emails. Get it from https://resend.com/
- **Without it**: Invitations will be created but emails won't be sent
- **With it**: Real emails will be sent to invited coaches

### NEXT_PUBLIC_APP_URL
Your app URL for email links.
- Development: `http://localhost:3000`
- Production: Your Vercel URL (e.g., `https://sport-planity.vercel.app`)

---

## 🧪 Testing

### 1. Login with Google
- Click "Continuer avec Google"
- Choose your Google account
- You'll be redirected back as a Client

### 2. Login with Demo Account
- Click one of the 3 demo buttons
- Instant login (creates account on first click)

### 3. Create Real Account
- Use "Ou avec email" section
- Enter email and password
- Click "Créer un compte"
- Verify email (Supabase sends confirmation)
- Login

### 4. Test Invitation System
1. Login as Admin (Pierre)
2. Go to Admin dashboard
3. Click "Inviter un coach"
4. Enter email
5. Check console for invitation link (if no Resend key)
6. Or check email inbox (if Resend is configured)

---

## 🔒 Security (RLS Policies)

All tables have Row Level Security enabled:

- **Clubs**: Public read
- **Profiles**: Public read, users can update own
- **Coaches**: Public read
- **Bookings**: Users see only their own bookings
- **Coach Availability**: Coaches manage their own
- **Invitations**: Admins only

---

## 🚀 Next Steps

### Make it Production-Ready

1. **Get Resend API Key**
   - Sign up at https://resend.com
   - Verify your domain
   - Add API key to `.env.local`

2. **Configure Email Template**
   - Customize invitation email in `app/api/invite/route.ts`
   - Add your branding

3. **Add Real Club Data**
   - Insert your actual clubs in Supabase dashboard
   - Or create an admin interface to add clubs

4. **Deploy to Vercel**
   - Add environment variables in Vercel dashboard
   - Update `NEXT_PUBLIC_APP_URL` to production URL
   - Update Google OAuth redirect URI

---

## 🐛 Troubleshooting

### "Invalid API key"
- Check your `.env.local` file exists
- Restart dev server (`npm run dev`)

### "Google login not working"
- Enable Google provider in Supabase
- Check redirect URI matches exactly
- Make sure Google OAuth consent screen is configured

### "Invitations not sending"
- Check `RESEND_API_KEY` in `.env.local`
- Or leave it empty for demo mode (invitation link in console)

### "Database error"
- Run the SQL setup script again
- Check Supabase logs in dashboard

---

## ✅ Migration Complete!

You've successfully migrated from mock data to Supabase! 🎉

**What works now:**
- ✅ Real authentication
- ✅ Google login
- ✅ Database persistence
- ✅ Role-based access
- ✅ Email invitations (with Resend)
- ✅ All previous features still work

**What's different:**
- ❌ No more mock data
- ✅ Real users and sessions
- ✅ Data survives refresh (in database)
- ✅ Multi-device sync
- ✅ Production-ready

