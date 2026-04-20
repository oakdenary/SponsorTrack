import React, { useState, useEffect } from 'react';
import { ShieldCheck, User, Building, Lock, Loader2, FileCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

export default function ProfileCompletionModal({ authUser, email, defaultName, onComplete }) {
    const [councils, setCouncils] = useState([]);
    const [loadingCouncils, setLoadingCouncils] = useState(true);

    const [username, setUsername] = useState(defaultName || "");
    const [councilId, setCouncilId] = useState("");
    const [role, setRole] = useState("user");
    const [adminPassword, setAdminPassword] = useState("");
    
    // Status
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCouncils = async () => {
            try {
                const res = await fetch("/api/councils");
                const data = await res.json();
                if (!data.error) {
                    setCouncils(data);
                }
            } catch (err) {
                console.error("Failed to fetch councils", err);
            } finally {
                setLoadingCouncils(false);
            }
        };
        fetchCouncils();
        setUsername(defaultName || "");
    }, [defaultName]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        if (!username.trim()) {
            setError("Username is required.");
            return;
        }

        if (role === "admin" && !adminPassword) {
            setError("Admin authorization code is required.");
            return;
        }
        
        if (role === "user" && !councilId) {
            setError("Please select a council.");
            return;
        }

        setIsSubmitting(true);

        try {
            // Retrieve latest session token safely
            const { data: session } = await supabase.auth.getSession();
            const token = session?.session?.access_token;

            const res = await fetch("/api/user/profile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    id: authUser.id,
                    username,
                    email,
                    role,
                    councilid: role === "admin" ? null : councilId,
                    adminPassword: role === "admin" ? adminPassword : null
                })
            });

            const result = await res.json();

            if (result.error) {
                setError(result.error);
            } else {
                // Return successfully created user up to parent
                onComplete(result.user);
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#161719]/90 backdrop-blur-md p-4 overflow-y-auto">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white dark:bg-[#111] rounded-[2rem] p-8 sm:p-10 w-full max-w-lg shadow-2xl border border-zinc-200/50 dark:border-zinc-800 relative overflow-hidden"
            >
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 p-8 opacity-5 dark:opacity-10 pointer-events-none">
                    <FileCheck className="w-48 h-48 text-[#c79c5e]" />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-[#c79c5e]/20 dark:bg-[#c79c5e]/10 p-3 rounded-2xl border border-[#c79c5e]/30">
                            <ShieldCheck className="w-8 h-8 text-[#c79c5e]" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Complete Profile</h2>
                            <p className="text-sm font-medium text-zinc-500">First-time setup restricted access.</p>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm font-semibold flex items-center gap-2">
                            <Lock className="w-4 h-4 shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        
                        {/* Static Email */}
                        <div className="flex flex-col gap-1.5 opacity-60 pointer-events-none">
                            <label className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">Registered Email</label>
                            <input 
                                type="email" 
                                value={email} 
                                readOnly 
                                className="w-full bg-zinc-100 dark:bg-zinc-900 border border-transparent rounded-xl px-4 py-3 text-sm font-bold text-zinc-800 dark:text-zinc-200"
                            />
                        </div>

                        {/* Editable Name */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">Display Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                <input 
                                    type="text" 
                                    required 
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Your Full Name"
                                    className="w-full bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-[#c79c5e]/30 transition-all shadow-sm"
                                />
                            </div>
                        </div>

                        {/* Role Selection */}
                        <div className="flex flex-col gap-1.5 mt-2">
                            <label className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">Access Role</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button 
                                    type="button"
                                    onClick={() => setRole("user")}
                                    className={`px-4 py-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${role === 'user' ? 'bg-[#c79c5e]/10 border-[#c79c5e] text-[#c79c5e]' : 'bg-white dark:bg-[#0a0a0a] border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700'}`}
                                >
                                    <Building className="w-5 h-5" />
                                    <span className="text-xs font-bold">Standard User</span>
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setRole("admin")}
                                    className={`px-4 py-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${role === 'admin' ? 'bg-[#c79c5e]/10 border-[#c79c5e] text-[#c79c5e]' : 'bg-white dark:bg-[#0a0a0a] border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700'}`}
                                >
                                    <ShieldCheck className="w-5 h-5" />
                                    <span className="text-xs font-bold">Administrator</span>
                                </button>
                            </div>
                        </div>

                        {/* Conditional Fields */}
                        <AnimatePresence mode="wait">
                            {role === "user" ? (
                                <motion.div 
                                    key="user-fields"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="flex flex-col gap-1.5 overflow-hidden"
                                >
                                    <label className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider pt-2">Assigned Council</label>
                                    <select 
                                        required 
                                        value={councilId}
                                        onChange={(e) => setCouncilId(e.target.value)}
                                        className="w-full bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-medium text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-[#c79c5e]/30 transition-all shadow-sm appearance-none"
                                    >
                                        <option value="">Select your council directory...</option>
                                        {!loadingCouncils && councils.map(c => (
                                            <option key={c.councilid} value={c.councilid}>{c.councilname}</option>
                                        ))}
                                    </select>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="admin-fields"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="flex flex-col gap-1.5 overflow-hidden"
                                >
                                    <label className="text-xs font-bold text-[#c79c5e] uppercase tracking-wider pt-2 flex items-center gap-1.5">
                                        <Lock className="w-3 h-3" /> System Authorization
                                    </label>
                                    <input 
                                        type="password" 
                                        required 
                                        value={adminPassword}
                                        onChange={(e) => setAdminPassword(e.target.value)}
                                        placeholder="Enter admin verification code"
                                        className="w-full bg-white dark:bg-[#0a0a0a] border border-[#c79c5e]/30 rounded-xl px-4 py-3 text-sm font-medium text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-[#c79c5e]/50 transition-all shadow-sm"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="mt-8">
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full relative flex items-center justify-center gap-2 bg-[#c79c5e] hover:bg-[#b58c53] text-white font-bold text-sm rounded-xl py-4 transition-all shadow-lg shadow-[#c79c5e]/20 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Saving Profile...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Submit Profile Details</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
