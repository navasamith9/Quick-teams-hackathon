'use client'; // This is essential for components with interactivity

import { useState } from 'react';

// Define the shape of the search criteria object
export interface SearchCriteria {
    skills: string;
    availability: string;
    commitment: string;
}

// Define the props for our component
interface SearchFormProps {
    onSearch: (criteria: SearchCriteria) => void;
    isLoading: boolean;
}

export default function SearchForm({ onSearch, isLoading }: SearchFormProps) {
    const [skills, setSkills] = useState('');
    const [availability, setAvailability] = useState('any');
    const [commitment, setCommitment] = useState('any');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSearch({ skills, availability, commitment });
    };

    return (
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200 mb-10">
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Skills Input */}
                    <div className="md:col-span-3">
                        <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                        <input
                            type="text"
                            id="skills"
                            value={skills}
                            onChange={(e) => setSkills(e.target.value)}
                            placeholder="e.g., React, Python, UI/UX Design"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Separate multiple skills with a comma.</p>
                    </div>

                    {/* Availability Dropdown */}
                    <div>
                        <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                        <select
                            id="availability"
                            value={availability}
                            onChange={(e) => setAvailability(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="any">Any Time</option>
                            <option value="now">Available Now</option>
                            <option value="2_weeks">Within 2 Weeks</option>
                            <option value="1_month">Within 1 Month</option>
                        </select>
                    </div>

                    {/* Commitment Dropdown */}
                    <div>
                        <label htmlFor="commitment" className="block text-sm font-medium text-gray-700 mb-1">Commitment</label>
                        <select
                            id="commitment"
                            value={commitment}
                            onChange={(e) => setCommitment(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="any">Any Type</option>
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                        </select>
                    </div>
                    
                    {/* Search Button */}
                    <div className="self-end">
                        <button 
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center items-center bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:bg-blue-300"
                        >
                            {isLoading ? 'Searching...' : 'Search'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}