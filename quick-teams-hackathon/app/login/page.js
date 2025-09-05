'use client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '@/utils/supabase/client' // <-- CHANGED THIS LINE
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LoginPage() {
  // const supabase = createClient() <-- REMOVED THIS LINE
  const router = useRouter()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        router.push('/') // Redirect to home page if user is logged in
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase, router])

  return (
    <div style={{ width: '100%', maxWidth: '420px', margin: '96px auto' }}>
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={[]}
      />
    </div>
  )
}