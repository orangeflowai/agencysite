import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="max-w-lg w-full text-center space-y-8">
                <div className="space-y-4">
                    <p className="text-8xl font-bold text-primary opacity-20 leading-none">404</p>
                    <h1 className="text-3xl font-bold text-foreground">Page not found</h1>
                    <p className="text-base text-muted-foreground leading-relaxed">
                        The page you&apos;re looking for doesn&apos;t exist or has been moved.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity"
                    >
                        <Home className="w-4 h-4" />
                        Back to Home
                    </Link>
                    <Link
                        href="/search"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border text-foreground font-semibold rounded-xl hover:bg-muted transition-colors"
                    >
                        <Search className="w-4 h-4" />
                        Browse Tours
                    </Link>
                </div>
            </div>
        </div>
    );
}
