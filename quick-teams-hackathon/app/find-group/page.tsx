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
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAndFilterGroups = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('skills')
        .eq('id', user.id)
        .single()

      const userSkills = (profileError || !profileData) ? [] : profileData.skills || []
      
      const { data: allGroups, error: groupError } = await supabase
        .from('groups')
        .select('*')

      if (groupError) {
        console.error('Error fetching groups:', groupError)
      } else if (allGroups) {
        // Add the type hint '(group: Group)' here
        const filteredGroups = allGroups.filter((group: Group) => {
          if (!group.required_skills || group.required_skills.length === 0) {
            return true;
          }
          return group.required_skills.some(requiredSkill => userSkills.includes(requiredSkill))
        });
        setGroups(filteredGroups)
      }
      setLoading(false)
    }

    fetchAndFilterGroups()
  }, [router])

  if (loading) {
    return <div>Finding matching groups...</div>
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Groups Matching Your Skills</h1>
        <Link href="/" style={{ marginRight: '1rem' }}>Back to Home</Link>
      </div>
      <p>These groups are looking for skills you have, or are open to anyone.</p>
      
      <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
        {groups.length > 0 ? groups.map((group) => (
          <div key={group.id} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>{group.name || 'No name set'}</h3>
            <p><strong>Description:</strong> {group.project_description || 'No description'}</p>
            <p><strong>Skills Needed:</strong> {group.required_skills && group.required_skills.length > 0 ? group.required_skills.join(', ') : 'None listed'}</p>
          </div>
        )) : <p>No groups were found that match your criteria.</p>}
      </div>
    </div>
  )
}