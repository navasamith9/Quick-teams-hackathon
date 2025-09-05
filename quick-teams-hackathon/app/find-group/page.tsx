'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// Define the 'shape' of a Group object for TypeScript
interface Group {
  id: string;
  name: string | null;
  project_description: string | null;
  required_skills: string[] | null;
}

export default function FindGroupPage() {
  const router = useRouter()
  // Tell useState that 'groups' will be an array of Group objects
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSessionAndGroups = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.push('/login')
        return
      }

      // Fetch all groups from the 'groups' table
      const { data, error } = await supabase.from('groups').select('*')

      if (error) {
        console.error('Error fetching groups:', error)
      } else {
        setGroups(data)
      }
      setLoading(false)
    }

    fetchSessionAndGroups()
  }, [router])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Find a Group</h1>
        <Link href="/" style={{ marginRight: '1rem' }}>Back to Home</Link>
      </div>
      <p>Browse groups and find a team to join.</p>

      <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
        {groups.map((group) => (
          <div key={group.id} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>{group.name || 'No name set'}</h3>
            <p><strong>Description:</strong> {group.project_description || 'No description'}</p>
            <p><strong>Skills Needed:</strong> {group.required_skills ? group.required_skills.join(', ') : 'None listed'}</p>
          </div>
        ))}
      </div>
    </div>
  )
}