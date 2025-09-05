'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function AccountPage() {
  const router = useRouter()
  // ... (other state variables are the same)
  const [name, setName] = useState('')
  const [skills, setSkills] = useState('')
  const [availability, setAvailability] = useState('')
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)


  useEffect(() => {
    const fetchSessionAndProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login'); return
      }
      const user = session.user
      setUser(user)

      const { data, error } = await supabase
        .from('profiles')
        .select(`name, skills, availability`)
        .eq('id', user.id)
        .single()

      if (error) {
        console.warn('Error fetching profile:', error)
      } else if (data) {
        setName(data.name || '')
        setSkills(data.skills ? data.skills.join(', ') : '')
        // Format the database date to fit the date input (YYYY-MM-DD)
        if (data.availability) {
          setAvailability(data.availability)
        }
      }
      setLoading(false)
    }
    fetchSessionAndProfile()
  }, [router])

  async function updateProfile(event) {
    event.preventDefault()
    setLoading(true)
    const skillsArray = skills.split(',').map(skill => skill.trim())
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      name,
      skills: skillsArray,
      availability,
    })
    if (error) {
      alert('Error updating the data!')
      console.log(error)
    } else {
      alert('Profile updated successfully!')
      router.push('/')
    }
    setLoading(false)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Manage Your Profile</h1>
      <p>Welcome, {user?.email}!</p>
      <form onSubmit={updateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        {/* ... (name and skills inputs are the same) ... */}
        <div>
          <label htmlFor="name">Name</label>
          <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', border: '1px solid grey', padding: '8px' }} />
        </div>
        <div>
          <label htmlFor="skills">Skills (comma-separated)</label>
          <input id="skills" type="text" value={skills} onChange={(e) => setSkills(e.target.value)} style={{ width: '100%', border: '1px solid grey', padding: '8px' }} />
        </div>
        <div>
          <label htmlFor="availability">Available From</label>
          {/* --- THIS IS THE CHANGED LINE --- */}
          <input id="availability" type="date" value={availability} onChange={(e) => setAvailability(e.target.value)} style={{ width: '100%', border: '1px solid grey', padding: '8px' }} />
        </div>
        <div>
          <button type="submit" disabled={loading} style={{ padding: '10px 15px', background: 'blue', color: 'white', border: 'none' }}>
            {loading ? 'Saving...' : 'Update Profile'}
          </button>
        </div>
      </form>
    </div>
  )
}