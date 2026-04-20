import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { UserCog, AlertCircle, Save, Loader2, ShieldCheck, User } from 'lucide-react';

export default function AdminUsers({ data, rawData, onUserUpdated }) {
    const users = data?.users || [];
    const councils = rawData?.councils || [];
    
    const [updating, setUpdating] = useState(null);
    const [error, setError] = useState('');

    const handleRoleUpdate = async (userId, newRole, newCouncilId) => {
        setUpdating(userId);
        setError('');
        
        try {
            const { data: session } = await supabase.auth.getSession();
            const res = await fetch('/api/admin/users/role', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session?.session?.access_token}`,
                },
                body: JSON.stringify({
                    targetUserId: userId,
                    newRole: newRole,
                    newCouncilId: newCouncilId
                })
            });

            const result = await res.json();
            if (result.error) throw new Error(result.error);
            
            // Notify parent to sync state
            if (onUserUpdated) onUserUpdated(result.user);

        } catch (err) {
            setError(err.message || "Failed to update user parameters.");
        } finally {
            setUpdating(null);
        }
    };

    return (
        <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <div className="bg-white dark:bg-[#111] rounded-[1.5rem] p-6 shadow-sm border border-zinc-100 dark:border-zinc-800">
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                            <UserCog className="w-5 h-5 text-[#c79c5e]" />
                            User Access Management
                        </h2>
                        <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mt-1">Assign admin roles and distribute council ownership securely.</p>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 p-3 rounded-xl text-sm font-bold flex items-center gap-2 border border-rose-200 dark:border-rose-900/50">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {users.map(u => {
                        const isUpdating = updating === u.id;
                        return (
                            <div key={u.id} className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-5 hover:border-[#c79c5e]/50 transition-colors relative overflow-hidden group">
                                
                                {isUpdating && (
                                    <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center z-10">
                                        <Loader2 className="w-6 h-6 text-[#c79c5e] animate-spin" />
                                    </div>
                                )}

                                <div className="flex items-center justify-between mb-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
                                    <div className="flex items-center gap-3 w-full">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${u.role === 'admin' ? 'bg-[#c79c5e]/20 text-[#c79c5e]' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'}`}>
                                            {u.role === 'admin' ? <ShieldCheck className="w-5 h-5" /> : <User className="w-5 h-5" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-zinc-900 dark:text-zinc-100 text-base truncate">{u.username || "Unknown"}</p>
                                            <p className="text-xs font-semibold text-zinc-500 truncate">{u.email}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Access Role</label>
                                        <select 
                                            value={u.role || 'user'}
                                            onChange={(e) => handleRoleUpdate(u.id, e.target.value, u.councilid)}
                                            className="w-full bg-white dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm font-bold text-zinc-800 dark:text-zinc-200 outline-none focus:ring-2 focus:ring-[#c79c5e]/30 transition-all"
                                        >
                                            <option value="user">Standard User</option>
                                            <option value="admin">System Admin</option>
                                        </select>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Assigned Council</label>
                                        <select 
                                            value={u.councilid || 'null'}
                                            onChange={(e) => handleRoleUpdate(u.id, u.role, e.target.value)}
                                            className="w-full bg-white dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm font-bold text-zinc-800 dark:text-zinc-200 outline-none focus:ring-2 focus:ring-[#c79c5e]/30 transition-all"
                                        >
                                            <option value="null">Unassigned</option>
                                            {councils.map(c => (
                                                <option key={c.councilid} value={c.councilid}>{c.councilname}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    
                    {users.length === 0 && (
                        <div className="col-span-full py-10 text-center text-zinc-500 font-medium">No users found in this council scope.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
