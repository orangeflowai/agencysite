'use client';

import { usePathname } from 'next/navigation';
import GoogleTranslate from '@/components/GoogleTranslate';

export default function AdminSafeTranslate() {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin') || pathname?.startsWith('/studio');

    if (isAdmin) return null;

    return <GoogleTranslate />;
}
