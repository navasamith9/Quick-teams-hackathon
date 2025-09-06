'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User } from '@supabase/supabase-js'

interface Invitation {
  id: number;
  group_id: string;
  // This now correctly expects an array of group objects
  group: { 
    name: string | null;
  }[] | null;
}

export default function InvitationsPage() {
  const router = useRouter()
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchInvites = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login'); return
      }
      setUser(user)

      // The query is changed back to the simpler version
      const { data, error } = await supabase
        .from('invitations')
        .select(`
          id,
          group_id,
          groups ( name )
        `)
        .eq('recipient_id', user.id)
        .eq('status', 'pending')

      if (error) {
        console.error('Error fetching invitations:', error)
      } else if (data) {
        // We rename the property from 'groups' to 'group' for consistency in our code
        const formattedData = data.map(item => ({...item, group: item.groups}))
        setInvitations(formattedData as Invitation[])
      }
      setLoading(false)
    }
    fetchInvites()
  }, [router])

  const handleAccept = async (invitation: Invitation) => {
    if (!user) return;

    const { error: insertError } = await supabase.from('group_members').insert({
      group_id: invitation.group_id,
      user_id: user.id
    })

    if (insertError) {
      alert('Failed to join group.');
      console.error(insertError);
      return;
    }

    const { error: deleteError } = await supabase.from('invitations').delete().eq('id', invitation.id)
    if (deleteError) {
      alert('Failed to remove invitation.');
    } else {
      alert('Successfully joined the group!');
      setInvitations(invitations.filter(inv => inv.id !== invitation.id));
    }
  }

  const handleDecline = async (invitationId: number) => {
    const { error } = await supabase.from('invitations').delete().eq('id', invitationId)
    if (error) {
      alert('Failed to decline invitation.');
    } else {
      setInvitations(invitations.filter(inv => inv.id !== invitationId));
    }
  }

  if (loading) {
    return <div>Loading invitations...</div>
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>My Invitations</h1>
        <Link href="/" style={{ marginRight: '1rem' }}>Back to Home</Link>
      </div>

      {invitations.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {invitations.map(invite => (
            <li key={invite.id} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {/* Access the name from the first item in the 'group' array */}
              <span>You have been invited to join **{invite.group?.[0]?.name || 'a group'}**.</span>
              <div>
                <button onClick={() => handleAccept(invite)} style={{ background: 'green', color: 'white', border: 'none', padding: '8px 12px', marginRight: '0.5rem' }}>Accept</button>
                <button onClick={() => handleDecline(invite.id)} style={{ background: 'red', color: 'white', border: 'none', padding: '8px 12px' }}>Decline</button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>You have no pending invitations.</p>
      )}
    </div>
  )
}