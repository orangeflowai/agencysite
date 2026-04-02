'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getTours, Tour } from '@/lib/sanityService';
import TourCard from '@/components/TourCard';

export default function SearchResults() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const date = searchParams.get('date');
    const guests = searchParams.get('guests');

    const [tours, setTours] = useState<Tour[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAndFilter = async () => {
            setLoading(true);
            try {
                // In a real app, we'd pass params to GROQ. 
                // Here we fetch all and filter client-side for simplicity/speed with current setup.
                const allTours = await getTours();

                if (!query) {
                    setTours(allTours);
                } else {
                    const lowerQ = query.toLowerCase();
                    const filtered = allTours.filter(t =>
                        t.title.toLowerCase().includes(lowerQ) ||
                        t.category.toLowerCase().includes(lowerQ) ||
                        t.location?.toLowerCase().includes(lowerQ)
                    );
                    setTours(filtered);
                }
            } catch (error) {
                console.error("Failed to fetch tours:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAndFilter();
    }, [query]);

    if (loading) {
        return <div className="text-center py-20 text-gray-500">Searching tours...</div>;
    }

    if (tours.length === 0) {
        return (
            <div className="text-center py-20 space-y-4">
                <h2 className="text-2xl font-bold text-gray-400">No tours found for "{query}"</h2>
                <p className="text-gray-500">Try adjusting your search terms or browse our categories.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {date && (
                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-lg text-emerald-800 text-center mb-8">
                    Showing availability for <strong>{date}</strong> • {guests || 2} Guests
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {tours.map(tour => (
                    <div key={tour._id} className="h-full">
                        <TourCard tour={tour} />
                    </div>
                ))}
            </div>
        </div>
    );
}
