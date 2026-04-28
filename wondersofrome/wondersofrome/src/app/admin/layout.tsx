
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
                <div className={`flex min-h-screen bg-muted ${inter.className}`} suppressHydrationWarning>
                    <AdminLayoutClient>{children}</AdminLayoutClient>
                </div>
            </ThemeProvider>
        </AdminProvider>
    );
}
