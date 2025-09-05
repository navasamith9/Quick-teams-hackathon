'use client'; 

import { useState, useEffect } from 'react';
import Link from 'next/link'; // ADDED: Import the Link component
import SearchForm, { SearchCriteria } from '@/components/SearchForm'; 
import { createClient } from '@/utils/supabase/client'; 

type Profile = {
    id: string;
    name: string;
    skills: string[];
    availability: string;
    commitment?: string[]; // Added commitment as optional
};

export default function HomePage() {
    const [allProfiles, setAllProfiles] = useState<Profile[]>([]);
    const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const supabase = createClient();

    useEffect(() => {
        const fetchProfiles = async () => {
            setLoading(true);
            const { data, error } = await supabase.from('profiles').select('*');

            if (error) {
                console.error('Error fetching profiles:', error);
            } else {
                setAllProfiles(data || []);
                setFilteredProfiles(data || []);
            }
            setLoading(false);
        };

        fetchProfiles();
    }, []);

    const handleSearch = (criteria: SearchCriteria) => {
        setSearchTerm(criteria.skills);
        
        let results = [...allProfiles];

        if (criteria.skills) {
            const searchSkills = criteria.skills.toLowerCase().split(',').map(s => s.trim()).filter(s => s);
            if (searchSkills.length > 0) {
                results = results.filter(profile => 
                    searchSkills.every(skill =>
                        (profile.skills || []).some(profileSkill => 
                            profileSkill.toLowerCase().includes(skill)
                        )
                    )
                );
            }
        }
        
        if (criteria.availability !== 'any') {
            results = results.filter(profile => profile.availability === criteria.availability);
        }

        if (criteria.commitment !== 'any') {
            results = results.filter(profile => profile.commitment?.includes(criteria.commitment));
        }

        setFilteredProfiles(results);
    };

    return (
        <div style={{ padding: '2rem' }}>
            <header className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800">Find an Individual</h1>
                <p className="text-gray-600 mt-2">Discover the perfect talent for your project.</p>
            </header>

            <SearchForm onSearch={handleSearch} isLoading={loading} />

            {loading && <p>Loading profiles...</p>}

            {!loading && (
                <div>
                    {filteredProfiles.length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                            {filteredProfiles.map(profile => (
                                // CHANGED: The entire card is now a link
                                <Link href={`/profile/${profile.id}`} key={profile.id}>
                                    <div className="border border-gray-300 p-4 rounded-lg h-full transition-all duration-300 hover:shadow-lg hover:border-blue-500 hover:-translate-y-1">
                                        <h3 style={{ margin: '0 0 0.5rem 0' }}>{profile.name || 'No name set'}</h3>
                                        <p><strong>Skills:</strong> {(profile.skills || []).slice(0, 3).join(', ')}</p>
                                        <p><strong>Availability:</strong> {profile.availability || 'Not specified'}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p>No profiles found matching "{searchTerm}"</p>
                    )}
                </div>
            )}
        </div>
    );
}