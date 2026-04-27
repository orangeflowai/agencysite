'use client';

import { useState, useEffect } from 'react';
import { getTours, Tour } from '@/lib/dataAdapter';
import { Loader2 } from 'lucide-react';
import InventoryCalendar from '@/components/admin/InventoryCalendar';

import { useAdmin } from '@/context/AdminContext';

export default function InventoryPage() {
    const { selectedSiteId } = useAdmin();
    const [tours, setTours] = useState<Tour[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!selectedSiteId) return;

        async function loadTours() {
            setLoading(true);
            try {
                // Import dynamically to avoid build check issues if any, or just standard import
                const { getTours } = await import('@/lib/dataAdapter');
                const data = await getTours(selectedSiteId);
                setTours(data);
            } catch (error) {
                console.error("Failed to load tours", error);
            } finally {
                setLoading(false);
            }
        }
        loadTours();
    }, [selectedSiteId]);

    if (loading) return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>;

    return (
        <div className="p-6 max-w-[1600px] mx-auto h-screen flex flex-col">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground">Inventory Calendar</h1>
                <p className="text-muted-foreground">Manage availability, time slots, and pricing.</p>
            </div>

            <div className="flex-1 min-h-0">
                <InventoryCalendar tours={tours} />
            </div>
        </div>
    );
}
