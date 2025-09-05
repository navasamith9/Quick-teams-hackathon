'use client'
import { useState } from 'react'
import { supabase } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function CreateGroupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [skills, setSkills] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCreateGroup = async (event) => {
    event.preventDefault()
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      alert('You must be logged in to create a group.')
      setLoading(false)
      return
    }

    const skillsArray = skills.split(',').map(skill => skill.trim())

    const { error } = await supabase.from('groups').insert({
      name,
      project_description: description,
      required_skills: skillsArray,
      owner_id: user.id,
    })

    if (error) {
      alert('Error creating group!')
      console.error(error)
    } else {
      alert('Group created successfully!')
      router.push('/') // Redirect to homepage after creation
    }
    setLoading(false)
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Create a New Group</h1>
      <form onSubmit={handleCreateGroup} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <div>
          <label htmlFor="name">Group Name</label>
          <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', border: '1px solid grey', padding: '8px' }} />
        </div>
        <div>
          <label htmlFor="description">Project Description</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required style={{ width: '100%', border: '1px solid grey', padding: '8px', minHeight: '100px' }} />
        </div>
        <div>
          <label htmlFor="skills">Required Skills (comma-separated)</label>
          <input id="skills" type="text" value={skills} onChange={(e) => setSkills(e.target.value)} required style={{ width: '100%', border: '1px solid grey', padding: '8px' }} />
        </div>
        <div>
          <button type="submit" disabled={loading} style={{ padding: '10px 15px', background: 'blue', color: 'white', border: 'none' }}>
            {loading ? 'Creating...' : 'Create Group'}
          </button>
        </div>
      </form>
    </div>
  )
}