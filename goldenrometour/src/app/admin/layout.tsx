
import { Inter } from 'next/font/google';
import AdminLayoutClient from './AdminLayoutClient';

const inter = Inter({ subsets: ['latin'] });

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={`flex min-h-screen bg-muted ${inter.className}`}>
            <AdminLayoutClient>{children}</AdminLayoutClient>
        </div>
    );
}
