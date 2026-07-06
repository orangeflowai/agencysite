import { Inter } from 'next/font/google';
import { AdminProvider } from '@/context/AdminContext';
import { ThemeProvider } from '@/context/ThemeContext';
import AdminLayoutClient from './AdminLayoutClient';

const inter = Inter({ subsets: ['latin'] });

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AdminProvider>
            <ThemeProvider>
                <div
                    className={`flex min-h-screen ${inter.className}`}
                    style={{
                        // Hard-code CSS vars so the admin panel never renders transparent
                        // regardless of ThemeProvider's mounted state
                        '--background': '#F3F3E7',
                        '--card': '#F8F8F1',
                        '--card-foreground': '#0f172a',
                        '--foreground': '#0f172a',
                        '--muted': '#EBEBDF',
                        '--muted-foreground': '#64748b',
                        '--border': '#e2e8f0',
                        '--primary': '#064034',
                        '--primary-foreground': '#ffffff',
                        '--secondary': '#f0fdf4',
                        '--accent': '#d1fae5',
                        '--ring': '#064034',
                        backgroundColor: '#F3F3E7',
                    } as React.CSSProperties}
                    suppressHydrationWarning
                >
                    <AdminLayoutClient>{children}</AdminLayoutClient>
                </div>
            </ThemeProvider>
        </AdminProvider>
    );
}
