'use client';

import { useState } from 'react';
import { AlertTriangle, CheckCircle, Loader2, RefreshCw, Database, Server, Globe } from 'lucide-react';

interface DiagnosticResult {
    name: string;
    status: 'loading' | 'success' | 'error';
    message: string;
    data?: any;
}

export default function CalendarDiagnostic() {
    const [results, setResults] = useState<DiagnosticResult[]>([]);
    const [running, setRunning] = useState(false);

    const runDiagnostics = async () => {
        setRunning(true);
        setResults([
            { name: 'Supabase Connection', status: 'loading', message: 'Testing connection...' },
            { name: 'Tours Table', status: 'loading', message: 'Checking tours data...' },
            { name: 'Inventory Table', status: 'loading', message: 'Checking inventory data...' },
            { name: 'API Endpoint', status: 'loading', message: 'Testing API...' },
        ]);

        // 1. Test Supabase
        try {
            const res = await fetch('/api/debug/supabase');
            const data = await res.json();
            updateResult('Supabase Connection', data.connected ? 'success' : 'error', 
                data.connected ? 'Connected successfully' : 'Failed to connect', data);
        } catch (err: any) {
            updateResult('Supabase Connection', 'error', err.message);
        }

        // 2. Test Tours Table
        try {
            const res = await fetch('/api/debug/tours');
            const data = await res.json();
            updateResult('Tours Table', data.count > 0 ? 'success' : 'error',
                data.count > 0 ? `Found ${data.count} tours` : 'No tours found! Run seed script.', data);
        } catch (err: any) {
            updateResult('Tours Table', 'error', err.message);
        }

        // 3. Test Inventory
        try {
            const res = await fetch('/api/debug/inventory');
            const data = await res.json();
            updateResult('Inventory Table', data.count > 0 ? 'success' : 'error',
                data.count > 0 ? `Found ${data.count} inventory slots` : 'No inventory! Add slots in admin.', data);
        } catch (err: any) {
            updateResult('Inventory Table', 'error', err.message);
        }

        // 4. Test API
        try {
            const testSlug = 'vatican-museums';
            const res = await fetch(`/api/availability?slug=${testSlug}&mode=month&date=${new Date().toISOString().slice(0, 7)}`);
            const data = await res.json();
            updateResult('API Endpoint', res.ok ? 'success' : 'error',
                res.ok ? `API working, ${Object.keys(data).length} dates found` : 'API error', data);
        } catch (err: any) {
            updateResult('API Endpoint', 'error', err.message);
        }

        setRunning(false);
    };

    const updateResult = (name: string, status: 'success' | 'error', message: string, data?: any) => {
        setResults(prev => prev.map(r => r.name === name ? { ...r, status, message, data } : r));
    };

    return (
        <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-50 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-foreground">Calendar Diagnostics</h3>
                        <p className="text-sm text-muted-foreground">Check why calendar colors aren't showing</p>
                    </div>
                </div>
                <button
                    onClick={runDiagnostics}
                    disabled={running}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 disabled:opacity-50"
                >
                    {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    {running ? 'Running...' : 'Run Diagnostics'}
                </button>
            </div>

            {results.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                    <Database className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>Click "Run Diagnostics" to check your calendar setup</p>
                </div>
            )}

            <div className="space-y-3">
                {results.map((result) => (
                    <div key={result.name} className={`p-4 rounded-lg border ${
                        result.status === 'loading' ? 'bg-muted border-border' :
                        result.status === 'success' ? 'bg-green-50 border-green-200' :
                        'bg-red-50 border-red-200'
                    }`}>
                        <div className="flex items-center gap-3">
                            {result.status === 'loading' && <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />}
                            {result.status === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
                            {result.status === 'error' && <AlertTriangle className="w-5 h-5 text-red-600" />}
                            <div className="flex-1">
                                <p className="font-medium text-foreground">{result.name}</p>
                                <p className={`text-sm ${
                                    result.status === 'error' ? 'text-red-600' : 'text-muted-foreground'
                                }`}>{result.message}</p>
                            </div>
                        </div>
                        {result.data && (
                            <pre className="mt-2 p-2 bg-black/5 rounded text-xs overflow-x-auto">
                                {JSON.stringify(result.data, null, 2)}
                            </pre>
                        )}
                    </div>
                ))}
            </div>

            {results.some(r => r.status === 'error') && (
                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <h4 className="font-bold text-amber-800 mb-2">Common Fixes:</h4>
                    <ul className="text-sm text-amber-700 space-y-1 list-disc list-inside">
                        <li><strong>No tours found:</strong> Run <code>npm run seed</code> or add tours in Sanity</li>
                        <li><strong>No inventory:</strong> Go to Admin → Inventory Calendar and add time slots</li>
                        <li><strong>API error:</strong> Check browser console for CORS errors</li>
                        <li><strong>Supabase error:</strong> Verify your Supabase URL and anon key in .env</li>
                    </ul>
                </div>
            )}
        </div>
    );
}
