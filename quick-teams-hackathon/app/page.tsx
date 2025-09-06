'use client'
import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function HomePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
      } else {
        setUser(session.user)
      }
      setLoading(false)
    }
    fetchSession()
  }, [router])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div style={{ padding: '4rem', textAlign: 'center' }}>
      <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link href="/invitations" style={{ padding: '8px 12px', textDecoration: 'none', color: 'white' }}>
    My Invitations
  </Link>
        <Link href="/account" style={{ padding: '8px 12px', textDecoration: 'none', color: 'white' }}>
          My Profile
        </Link>
        <button onClick={handleLogout} style={{ padding: '8px 12px' }}>Logout</button>
      </div>
      
      <h1>Welcome, {user?.email}!</h1>
      <p style={{ fontSize: '1.2rem', color: '#ccc' }}>What would you like to do today?</p>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '3rem' }}>
        <Link href="/find-teammate" style={{ padding: '20px 40px', border: '1px solid white', borderRadius: '8px', textDecoration: 'none', color: 'white' }}>
          Find an Individual
        </Link>
        <Link href="/find-group" style={{ padding: '20px 40px', border: '1px solid white', borderRadius: '8px', textDecoration: 'none', color: 'white' }}>
          Find a Group
        </Link>
        {/* --- THIS IS THE NEW LINK --- */}
        <Link href="/groups/create" style={{ padding: '20px 40px', border: '1px solid #28a745', borderRadius: '8px', textDecoration: 'none', color: '#28a745', background: 'transparent' }}>
          Create a New Group
        </Link>
      </div>
    </div>
  )
}