'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Profile {
  id: string;
  name: string | null;
  skills: string[] | null;
  availability: string | null;
}

export default function FindTeammatePage() {
  const router = useRouter()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // State for temporary filter inputs in the modal
  const [skills, setSkills] = useState('')
  const [availability, setAvailability] = useState('')

  // State to hold the *applied* filters
  const [appliedSkills, setAppliedSkills] = useState('')
  const [appliedAvailability, setAppliedAvailability] = useState('')

  useEffect(() => {
    const fetchSessionAndProfiles = async () => {
      setLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login'); return
      }

      // Start building the query
      let query = supabase.from('profiles').select('*')

      // If skills filter is applied, add it to the query
      if (appliedSkills) {
        const skillsArray = appliedSkills.split(',').map(skill => skill.trim());
        query = query.contains('skills', skillsArray)
      }

      // If availability filter is applied, add it to the query
      if (appliedAvailability) {
        query = query.gte('availability', appliedAvailability) // gte = greater than or equal to
      }

      // Execute the final query
      const { data, error } = await query

      if (error) {
        console.error('Error fetching profiles:', error)
      } else {
        setProfiles(data)
      }
      setLoading(false)
    }

    fetchSessionAndProfiles()
  }, [router, appliedSkills, appliedAvailability]) // Re-run this effect when filters change

  const handleFilterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Set the applied filters, which will trigger the useEffect to re-run
    setAppliedSkills(skills);
    setAppliedAvailability(availability);
    setIsModalOpen(false);
  }

  return (
    <div style={{ padding: '2rem' }}>
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{ background: '#333', padding: '2rem', borderRadius: '8px', color: 'white', minWidth: '300px' }}>
            <h2>Filter Requirements</h2>
            <form onSubmit={handleFilterSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="skills">Required Skills (comma-separated)</label>
                <input id="skills" type="text" value={skills} onChange={(e) => setSkills(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '4px' }} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="availability">Available From</label>
                <input id="availability" type="date" value={availability} onChange={(e) => setAvailability(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '4px' }} />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" style={{ padding: '10px 15px', background: 'blue', color: 'white', border: 'none' }}>Apply Filters</button>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px 15px' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MAIN PAGE CONTENT --- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Find a Teammate</h1>
        <div>
          <button onClick={() => setIsModalOpen(true)} style={{ padding: '8px 12px', marginRight: '1rem' }}>Filter</button>
          <Link href="/" style={{ marginRight: '1rem' }}>Back to Home</Link>
        </div>
      </div>
      <p>Browse profiles and find the perfect person for your team.</p>
      
      <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
        {profiles.length > 0 ? profiles.map((profile) => (
          <div key={profile.id} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>{profile.name || 'No name set'}</h3>
            <p><strong>Skills:</strong> {profile.skills ? profile.skills.join(', ') : 'No skills listed'}</p>
            <p><strong>Availability:</strong> {profile.availability ? new Date(profile.availability).toLocaleDateString() : 'Not specified'}</p>
          </div>
        )) : <p>No profiles match your criteria.</p>}
      </div>
    </div>
  )
}