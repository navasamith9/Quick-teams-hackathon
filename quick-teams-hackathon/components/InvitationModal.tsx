'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

// Define the properties the component will accept
interface InvitationModalProps {
    isOpen: boolean;
    onClose: () => void;
    recipientId: string;
    recipientName: string;
}

export default function InvitationModal({ isOpen, onClose, recipientId, recipientName }: InvitationModalProps) {
    const supabase = createClient();
    const [projectTitle, setProjectTitle] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [message, setMessage] = useState(''); // To show success or error messages

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSending(true);
        setMessage('');

        // Get the current logged-in user (the sender)
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            setMessage('Error: You must be logged in to send an invitation.');
            setIsSending(false);
            return;
        }

        // Insert the invitation into the Supabase table
        const { error } = await supabase.from('invitations').insert({
            sender_id: user.id,
            recipient_id: recipientId,
            project_title: projectTitle,
            project_description: projectDescription,
            status: 'pending',
        });

        if (error) {
            setMessage(`Error sending invitation: ${error.message}`);
        } else {
            setMessage('Invitation sent successfully!');
            setProjectTitle('');
            setProjectDescription('');
            // Optionally close the modal after a short delay
            setTimeout(() => {
                onClose();
                setMessage('');
            }, 2000);
        }

        setIsSending(false);
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-lg w-full">
                <h2 className="text-2xl font-bold mb-4">Send Invitation to {recipientName}</h2>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="projectTitle" className="block text-sm font-medium text-gray-700">Project Title</label>
                        <input
                            type="text"
                            id="projectTitle"
                            value={projectTitle}
                            onChange={(e) => setProjectTitle(e.target.value)}
                            required
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700">Project Description</label>
                        <textarea
                            id="projectDescription"
                            rows={4}
                            value={projectDescription}
                            onChange={(e) => setProjectDescription(e.target.value)}
                            required
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Briefly describe the project, required skills, and timeline."
                        ></textarea>
                    </div>

                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
                            Cancel
                        </button>
                        <button type="submit" disabled={isSending} className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
                            {isSending ? 'Sending...' : 'Send Invite'}
                        </button>
                    </div>
                </form>

                {message && <p className={`mt-4 text-sm ${message.startsWith('Error') ? 'text-red-500' : 'text-green-500'}`}>{message}</p>}
            </div>
        </div>
    );
}
