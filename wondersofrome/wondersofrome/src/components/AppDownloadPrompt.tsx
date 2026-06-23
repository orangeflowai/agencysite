'use client';

import { useState, useEffect } from 'react';
import { X, Download, Smartphone } from 'lucide-react';

interface AppDownloadPromptProps {
  ticketId: string;
}

export default function AppDownloadPrompt({ ticketId }: AppDownloadPromptProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | null>(null);

  useEffect(() => {
    // Detect platform
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    
    if (isIOS) setPlatform('ios');
    else if (isAndroid) setPlatform('android');
    
    // Check if app is installed (will be implemented when app launches)
    const appInstalled = checkIfAppInstalled();
    
    // Show prompt if app not installed and on mobile
    if (!appInstalled && (isIOS || isAndroid)) {
      // Delay showing banner slightly for better UX
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const handleDownload = () => {
    if (platform === 'ios') {
      // Replace with actual App Store URL when app is published
      window.location.href = 'https://apps.apple.com/app/wonders-of-rome/id123456789';
    } else if (platform === 'android') {
      // Replace with actual Play Store URL when app is published
      window.location.href = 'https://play.google.com/store/apps/details?id=com.wondersofrome.app';
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-primary text-white p-4 shadow-lg animate-in slide-in-from-top duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <Smartphone className="w-6 h-6 flex-shrink-0" />
          <div className="min-w-0">
            <p className="font-bold text-sm">View Your Ticket in Our App</p>
            <p className="text-xs opacity-90 truncate">Better experience, offline access</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleDownload}
            className="bg-white text-primary px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 hover:bg-gray-100  whitespace-nowrap"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download App</span>
            <span className="sm:hidden">Get App</span>
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="p-2 hover:bg-white/20 rounded-full transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function checkIfAppInstalled(): boolean {
  // This will be implemented when app launches
  // For now, always return false to show the download prompt
  // When app is live, we can check for deep link support:
  // - iOS: Check if custom URL scheme responds
  // - Android: Check if intent can be resolved
  return false;
}
