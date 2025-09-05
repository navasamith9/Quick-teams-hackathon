'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// Define the 'shape' of a Profile object for TypeScript
interface Profile {
  id: string;
  name: string | null;
  skills: string[] | null;
  availability: string | null;
}

export default function FindTeammatePage() {
  const router = useRouter()
  // Tell useState that 'profiles' will be an array of Profile objects
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSessionAndProfiles = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase.from('profiles').select('*')

      if (error) {
        console.error('Error fetching profiles:', error)
      } else {
        setProfiles(data)
      }
      setLoading(false)
    }

    fetchSessionAndProfiles()
  }, [router])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Find a Teammate</h1>
        <Link href="/" style={{ marginRight: '1rem' }}>Back to Home</Link>
      </div>
      <p>Browse profiles and find the perfect person for your team.</p>
      
      {/* Your partner can add the search bar component back here */}

      <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
        {profiles.map((profile) => (
          <div key={profile.id} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>{profile.name || 'No name set'}</h3>
            <p><strong>Skills:</strong> {profile.skills ? profile.skills.join(', ') : 'No skills listed'}</p>
            <p><strong>Availability:</strong> {profile.availability || 'Not specified'}</p>
          </div>
        ))}
      </div>
    </div>
  )
}