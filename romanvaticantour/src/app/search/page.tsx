
import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getTours } from '@/lib/dataAdapter';

// We need to use client-side search or server search. 
// For simplicity with Sanity, we'll fetch all and filter, or fetch with GROQ.
// Let's maximize simplicity: Fetch all, filter in JS.

// Separate component to wrap in Suspense because of useSearchParams
import SearchResults from '@/components/SearchResults';

export default function SearchPage() {
    return (
        <main className="min-h-screen bg-cream">
            <Navbar />
            <div className="pt-32 pb-20 container mx-auto px-4 min-h-[60vh]">
                <h1 className="text-4xl font-serif font-bold text-emerald-900 mb-8 text-center">Search Results</h1>
                <Suspense fallback={<div className="text-center">Loading...</div>}>
                    <SearchResults />
                </Suspense>
            </div>
            <Footer />
        </main>
    );
}
