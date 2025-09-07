import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image'; // Import the Next.js Image component

// Use the Profile interface we created before for type safety
interface Profile {
    id: string;
    name: string | null;
    skills: string[] | null;
    availability: string | null;
    commitment: string[] | null; // Add the new commitment field
}

const SkillTag = ({ skill }: { skill: string }) => (
    <span className="bg-sky-100 text-sky-800 text-sm font-medium mr-2 mb-2 px-3 py-1 rounded-full">
        {skill}
    </span>
);

export default async function ProfilePage({ params }: { params: { id: string } }) {
    const supabase = createClient();

    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', params.id)
        .single<Profile>(); // Apply the Profile type to our data

    if (error || !profile) {
        notFound();
    }
    
    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <Link href="/find-teammate" className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-300">
                        &larr; Back to Search
                    </Link>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                    <div className="flex flex-col md:flex-row items-start md:space-x-8">
                        <div className="flex-shrink-0 w-full md:w-1/3 text-center mb-6 md:mb-0">
                            {/* Use the Next.js Image component for performance */}
                            <Image 
                                src={`https://placehold.co/200x200/E2E8F0/4A5568?text=${profile.name ? profile.name.charAt(0) : 'P'}`} 
                                alt={profile.name || 'Profile avatar'}
                                width={160}
                                height={160}
                                className="w-40 h-40 rounded-full mx-auto shadow-md border-4 border-white"
                            />
                            <h1 className="text-3xl font-bold text-gray-800 mt-4">{profile.name || 'No Name Set'}</h1>
                            <p className="text-gray-500 mt-1">Software Developer</p>
                        </div>

                        <div className="w-full md:w-2/3">
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-3">About</h2>
                                <p className="text-gray-600">
                                    This is a placeholder for the user&apos;s bio. It&apos;s a great place for them to introduce themselves, 
                                    their passions, and their professional background.
                                </p>
                            </div>

                             <div className="mb-6">
                                <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-3">Skills</h2>
                                <div className="flex flex-wrap">
                                    {profile.skills && profile.skills.length > 0 ? (
                                        profile.skills.map((skill) => <SkillTag key={skill} skill={skill} />)
                                    ) : (
                                        <p className="text-gray-500">No skills listed.</p>
                                    )}
                                </div>
                            </div>
                            
                            <div className="mb-8 grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="font-semibold text-gray-700">Availability</h3>
                                    {/* Handle the date type correctly */}
                                    <p className="text-gray-600">{profile.availability ? new Date(profile.availability).toLocaleDateString() : 'Not Specified'}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-700">Commitment</h3>
                                     <p className="text-gray-600">{profile.commitment?.join(', ') || 'Not Specified'}</p>
                                </div>
                            </div>
                            
                            <button className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-md">
                                Send Project Invite
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
