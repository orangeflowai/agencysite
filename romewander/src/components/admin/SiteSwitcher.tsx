'use client';

import React from 'react';
import { useAdmin } from '@/context/AdminContext';
import { ChevronDown, Map, Check, Loader2 } from 'lucide-react';
import * as Popover from '@radix-ui/react-popover';

export default function SiteSwitcher() {
    const { sites, selectedSiteId, setSelectedSiteId, isLoading, currentSite } = useAdmin();

    if (isLoading) {
        return (
            <div className="p-6 border-b border-gray-100 flex items-center gap-3 opacity-50">
                <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse" />
                <div className="space-y-1">
                    <div className="w-24 h-3 bg-gray-200 rounded animate-pulse" />
                    <div className="w-16 h-2 bg-gray-200 rounded animate-pulse" />
                </div>
            </div>
        );
    }

    return (
        <Popover.Root>
            <Popover.Trigger asChild>
                <button className="w-full p-6 border-b border-gray-100 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left outline-none group">
                    <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-emerald-200 shadow-sm group-hover:shadow-md transition-all">
                        {currentSite?.logo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={currentSite.logo.asset?.url} alt="Logo" className="w-full h-full object-cover rounded-lg" />
                        ) : (
                            <Map className="text-white w-5 h-5" />
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <span className="block font-bold text-gray-900 tracking-tight truncate">
                            {currentSite?.title || 'Unknown Site'}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                            <span>Switch Site</span>
                            <ChevronDown size={10} />
                        </div>
                    </div>
                </button>
            </Popover.Trigger>

            <Popover.Portal>
                <Popover.Content className="w-60 bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-200" side="bottom" align="start" sideOffset={5}>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2 mt-2">Available Sites</div>
                    {sites.map((site) => (
                        <button
                            key={site._id}
                            onClick={() => setSelectedSiteId(site.slug.current)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${selectedSiteId === site.slug.current
                                    ? 'bg-background text-foreground'
                                    : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <div className={`w-2 h-2 rounded-full ${site.isActive ? 'bg-green-500' : 'bg-red-300'}`} />
                            <span className="flex-1 text-left truncate">{site.title}</span>
                            {selectedSiteId === site.slug.current && <Check size={14} className="text-primary" />}
                        </button>
                    ))}
                    <Popover.Arrow className="fill-white" />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}
