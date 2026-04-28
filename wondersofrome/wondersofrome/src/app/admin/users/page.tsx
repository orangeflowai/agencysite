'use client';

import { Users, Plus, Mail, Shield, MoreVertical } from 'lucide-react';
import { useState } from 'react';

export default function UsersPage() {
    const [users] = useState([
        { id: 1, name: 'Admin User', email: 'admin@rometourtickets.com', role: 'Admin', status: 'Active' },
    ]);

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Team Members</h1>
                    <p className="text-muted-foreground mt-1">Manage admin access and permissions</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:opacity-90 text-white font-medium rounded-xl transition-colors">
                    <Plus size={18} />
                    Invite Member
                </button>
            </div>

            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
                <div className="p-6 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-secondary rounded-lg">
                            <Shield className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-foreground">Admin Access</h2>
                            <p className="text-sm text-muted-foreground">Supabase Authentication manages user access</p>
                        </div>
                    </div>
                </div>

                <div className="divide-y divide-gray-100">
                    {users.map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-4 hover:bg-muted">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                    <Users size={18} className="text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-foreground">{user.name}</h3>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Mail size={14} />
                                        {user.email}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="px-3 py-1 bg-secondary text-emerald-700 text-xs font-medium rounded-full">
                                    {user.role}
                                </span>
                                <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                                    {user.status}
                                </span>
                                <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                                    <MoreVertical size={18} className="text-muted-foreground" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-sm text-blue-700">
                    <strong>Note:</strong> User management is handled through Supabase Auth. 
                    Visit the Supabase Dashboard to add or remove team members.
                </p>
            </div>
        </div>
    );
}
