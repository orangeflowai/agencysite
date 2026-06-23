'use client';

import { Users, Plus, Mail, Shield, MoreVertical, Loader2, RefreshCw, Trash2, UserCheck, UserX } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Use anon client — listing users requires service role, so we hit our own API
export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviting, setInviting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    async function fetchUsers() {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/admin/users');
            if (!res.ok) throw new Error(await res.text());
            const data = await res.json();
            setUsers(data.users || []);
        } catch (e: any) {
            setError(e.message || 'Failed to load users');
        } finally {
            setLoading(false);
        }
    }

    async function handleInvite(e: React.FormEvent) {
        e.preventDefault();
        if (!inviteEmail.trim()) return;
        setInviting(true);
        setError('');
        setSuccess('');
        try {
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: inviteEmail.trim() }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to invite');
            setSuccess(`Invite sent to ${inviteEmail}`);
            setInviteEmail('');
            fetchUsers();
        } catch (e: any) {
            setError(e.message);
        } finally {
            setInviting(false);
        }
    }

    async function handleDelete(userId: string, email: string) {
        if (!confirm(`Remove ${email} from admin access?`)) return;
        try {
            const res = await fetch('/api/admin/users', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            });
            if (!res.ok) {
                const d = await res.json();
                throw new Error(d.error || 'Failed');
            }
            setSuccess(`${email} removed`);
            fetchUsers();
        } catch (e: any) {
            setError(e.message);
        }
    }

    return (
        <div className="max-w-3xl">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Team Members</h1>
                    <p className="text-muted-foreground mt-1">Manage admin access — powered by Supabase Auth</p>
                </div>
                <button
                    onClick={fetchUsers}
                    className="p-2 text-muted-foreground hover:bg-gray-100 rounded-lg transition-colors"
                    title="Refresh"
                >
                    <RefreshCw className="w-5 h-5" />
                </button>
            </div>

            {/* Invite form */}
            <div className="bg-card rounded-2xl shadow-sm border border-border p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-secondary rounded-lg">
                        <UserCheck className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="font-semibold text-foreground">Invite New Member</h2>
                </div>
                <form onSubmit={handleInvite} className="flex gap-3">
                    <input
                        type="email"
                        value={inviteEmail}
                        onChange={e => setInviteEmail(e.target.value)}
                        placeholder="colleague@example.com"
                        required
                        className="flex-1 px-4 py-2.5 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm"
                    />
                    <button
                        type="submit"
                        disabled={inviting}
                        className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:opacity-90 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
                    >
                        {inviting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus size={16} />}
                        {inviting ? 'Inviting...' : 'Send Invite'}
                    </button>
                </form>
                <p className="text-xs text-muted-foreground mt-2">
                    They'll receive a magic-link email to set their password and access the admin panel.
                </p>
            </div>

            {/* Feedback */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-2">
                    <UserX className="w-4 h-4 shrink-0" /> {error}
                </div>
            )}
            {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl flex items-center gap-2">
                    <UserCheck className="w-4 h-4 shrink-0" /> {success}
                </div>
            )}

            {/* User list */}
            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
                <div className="p-6 border-b border-border flex items-center gap-3">
                    <div className="p-2 bg-secondary rounded-lg">
                        <Shield className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-foreground">Admin Users</h2>
                        <p className="text-sm text-muted-foreground">{loading ? '...' : `${users.length} member${users.length !== 1 ? 's' : ''}`}</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                ) : users.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground text-sm">No users found</div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {users.map((user) => (
                            <div key={user.id} className="flex items-center justify-between p-4 hover:bg-muted transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-sm font-bold text-primary">
                                        {(user.email || '?')[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-foreground">
                                            {user.user_metadata?.full_name || user.email?.split('@')[0] || 'Admin'}
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Mail size={12} />
                                            {user.email}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                        user.email_confirmed_at
                                            ? 'bg-green-50 text-green-700'
                                            : 'bg-amber-50 text-amber-700'
                                    }`}>
                                        {user.email_confirmed_at ? 'Active' : 'Pending'}
                                    </span>
                                    <span className="px-2.5 py-1 bg-secondary text-emerald-700 text-xs font-medium rounded-full">
                                        Admin
                                    </span>
                                    <button
                                        onClick={() => handleDelete(user.id, user.email)}
                                        className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Remove user"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
