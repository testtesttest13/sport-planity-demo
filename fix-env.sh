#!/bin/bash

# Script pour corriger .env.local

cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://ivzvjwqvqvunkiyyyrub.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2enZqd3F2cXZ1bmtpeXl5cnViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyODM4MTYsImV4cCI6MjA4Mjg1OTgxNn0.Iw7dvSXO2I-oARDAKE-BzcOaATH-MKnY_K7NkWiMOEE
RESEND_API_KEY=re_4YRpR5Uj_DsKSpdUsz4ggxJLUfbVwxHry
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF

echo "✅ Fichier .env.local créé/corrigé !"
echo "🔄 Maintenant redémarrez le serveur : npm run dev"

