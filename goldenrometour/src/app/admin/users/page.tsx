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
                    <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
                    <p className="text-gray-500 mt-1">Manage admin access and permissions</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors">
                    <Plus size={18} />
                    Invite Member
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-50 rounded-lg">
                            <Shield className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-gray-900">Admin Access</h2>
                            <p className="text-sm text-gray-500">Supabase Authentication manages user access</p>
                        </div>
                    </div>
                </div>

                <div className="divide-y divide-gray-100">
                    {users.map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                    <Users size={18} className="text-emerald-600" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">{user.name}</h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Mail size={14} />
                                        {user.email}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full">
                                    {user.role}
                                </span>
                                <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                                    {user.status}
                                </span>
                                <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                                    <MoreVertical size={18} className="text-gray-400" />
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
