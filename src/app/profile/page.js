"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ShieldCheck, User, Building, Lock, Loader2, Save, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfilePage() {
    const router = useRouter();
    const [authUser, setAuthUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    
    // User Form State
    const [email, setEmail] = useState("");
    const [councilName, setCouncilName] = useState("");
    const [username, setUsername] = useState("");
    const [role, setRole] = useState("user");
    const [adminPassword, setAdminPassword] = useState("");

    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [totalRevenue, setTotalRevenue] = useState(0);

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: authData } = await supabase.auth.getUser();
            if (!authData?.user) {
                router.push("/login");
                return;
            }
            
            setAuthUser(authData.user);
            setEmail(authData.user.email);

            try {
                const res = await fetch(`/api/user?id=${authData.user.id}`);
                const userInfo = await res.json();
                
                if (!userInfo.error) {
                    setUsername(userInfo.username || "");
                    setCouncilName(userInfo.councilname || "None");
                    setRole(userInfo.role || "user");

                    // Fetch total revenue contributed by user
                    try {
                        const session = await supabase.auth.getSession();
                        const token = session.data.session?.access_token;
                        if (token) {
                            const dbRes = await fetch("/api/dashboard", { 
                                cache: "no-store", 
                                headers: { Authorization: `Bearer ${token}` } 
                            });
                            const dashData = await dbRes.json();
                            
                            if (dashData && dashData.myContribution) {
                                setTotalRevenue(dashData.myContribution.totalValue || 0);
                            }
                        }
                    } catch (e) {
                        console.error("Revenue fetch failed", e);
                    }
                }
            } catch (err) {
                console.error("Failed to load profile", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [router]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMsg("");

        if (!username.trim()) {
            setError("Username cannot be empty.");
            return;
        }

        if (role === "admin" && !adminPassword) {
            setError("Admin authorization code is required to upgrade access.");
            return;
        }

        setSubmitting(true);

        try {
            const { data: session } = await supabase.auth.getSession();
            const token = session?.session?.access_token;

            const res = await fetch("/api/user/profile/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    id: authUser.id,
                    username,
                    role,
                    adminPassword: role === "admin" ? adminPassword : null
                })
            });

            const result = await res.json();

            if (result.error) {
                setError(result.error);
            } else {
                setSuccessMsg("Profile details updated successfully!");
                if (role === "admin" && result.user.role === "admin") {
                    // Force complete reload to flush standard routing state and mount Admin features
                    window.location.href = "/admin/dashboard";
                }
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen w-full bg-[#161719] items-center justify-center text-white">
                <div className="w-8 h-8 rounded-full border-2 border-[#c79c5e] border-t-transparent animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex h-screen w-full bg-[#161719] overflow-hidden font-sans">
            <Sidebar />
            <main className="flex-1 bg-[#f4f4f5] dark:bg-black rounded-tl-[2rem] rounded-bl-[2rem] p-6 md:px-8 flex flex-col h-screen overflow-y-auto shadow-2xl border-l border-white/5 transition-colors">
                <div className="flex flex-col max-w-4xl w-full mx-auto pb-10">
                    
                    {/* Header Row */}
                    <div className="flex justify-between items-center w-full pb-8">
                        <div>
                            <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight flex items-center gap-3">
                                <User className="w-8 h-8 text-[#c79c5e]" />
                                Your Profile
                            </h1>
                            <p className="text-base font-semibold text-zinc-500 dark:text-zinc-400 mt-1">
                                Manage your personal information and access roles
                            </p>
                        </div>
                        <ThemeToggle />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Static Info Panel */}
                        <div className="col-span-1 bg-white dark:bg-[#111] border border-zinc-200/80 dark:border-zinc-800 rounded-[2rem] p-8 shadow-xl flex flex-col items-center justify-center text-center gap-2 relative overflow-hidden h-fit">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <Building className="w-32 h-32" />
                            </div>
                            <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center border-4 border-white dark:border-[#111] shadow-lg shadow-black/5 z-10 mb-2">
                                <User className="w-10 h-10 text-zinc-400" />
                            </div>
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-white z-10">{username || "User"}</h2>
                            <p className="text-sm font-semibold text-zinc-500 z-10">{email}</p>
                            
                            <div className="mt-6 flex flex-col gap-3 w-full z-10">
                                <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-xl p-3 border border-zinc-200/50 dark:border-zinc-800 flex items-center justify-between">
                                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Council</span>
                                    <span className="text-sm font-bold text-zinc-900 dark:text-white">{councilName}</span>
                                </div>
                                <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-xl p-3 border border-zinc-200/50 dark:border-zinc-800 flex items-center justify-between">
                                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Access Level</span>
                                    <span className={`text-sm font-bold px-2 py-0.5 rounded-md ${role === 'admin' ? 'bg-[#c79c5e]/20 text-[#c79c5e]' : 'bg-blue-500/10 text-blue-500'}`}>
                                        {role === 'admin' ? 'Administrator' : 'Standard'}
                                    </span>
                                </div>
                                <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-xl p-3 border border-zinc-200/50 dark:border-zinc-800 flex items-center justify-between">
                                    <span className="text-xs font-bold text-[#c79c5e] uppercase tracking-wide">Total Revenue Gathered</span>
                                    <span className="text-sm font-bold text-zinc-900 dark:text-white">₹{totalRevenue.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Edit Panel */}
                        <div className="col-span-1 md:col-span-2 bg-white dark:bg-[#111] border border-zinc-200/80 dark:border-zinc-800 rounded-[2rem] p-8 md:p-10 shadow-xl relative">
                            {error && (
                                <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm font-semibold flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    {error}
                                </div>
                            )}

                            {successMsg && (
                                <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-semibold flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 shrink-0" />
                                    {successMsg}
                                </div>
                            )}

                            <form onSubmit={handleUpdate} className="flex flex-col gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">Display Username</label>
                                    <input 
                                        type="text" 
                                        required 
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full bg-zinc-50 dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-medium text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-[#c79c5e]/30 transition-all"
                                    />
                                </div>

                                <div className="flex flex-col gap-2 mt-4">
                                    <label className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">Role Configuration</label>
                                    <p className="text-sm text-zinc-500 mb-2">You can request administrative capabilities if authorized.</p>
                                    
                                    <div className="grid grid-cols-2 gap-3">
                                        <button 
                                            type="button"
                                            onClick={() => setRole("user")}
                                            className={`px-4 py-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${role === 'user' ? 'bg-[#c79c5e]/10 border-[#c79c5e] text-[#c79c5e]' : 'bg-zinc-50 dark:bg-[#0a0a0a] border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700'}`}
                                        >
                                            <Building className="w-6 h-6" />
                                            <span className="text-xs font-bold">Standard User</span>
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => setRole("admin")}
                                            className={`px-4 py-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${role === 'admin' ? 'bg-[#c79c5e]/10 border-[#c79c5e] text-[#c79c5e]' : 'bg-zinc-50 dark:bg-[#0a0a0a] border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700'}`}
                                        >
                                            <ShieldCheck className="w-6 h-6" />
                                            <span className="text-xs font-bold">Administrator</span>
                                        </button>
                                    </div>
                                </div>

                                <AnimatePresence mode="wait">
                                    {role === "admin" && (
                                        <motion.div 
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="flex flex-col gap-2 overflow-hidden mt-2"
                                        >
                                            <label className="text-xs font-bold text-[#c79c5e] uppercase tracking-wider flex items-center gap-1.5">
                                                <Lock className="w-3 h-3" /> System Authorization Code
                                            </label>
                                            <input 
                                                type="password" 
                                                value={adminPassword}
                                                onChange={(e) => setAdminPassword(e.target.value)}
                                                placeholder="Enter validation code"
                                                className="w-full bg-white dark:bg-[#0a0a0a] border border-[#c79c5e]/30 rounded-xl px-4 py-3 text-sm font-medium text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-[#c79c5e]/50 transition-all shadow-sm"
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="mt-8 border-t border-zinc-200 dark:border-zinc-800 pt-8 flex justify-end">
                                    <button 
                                        type="submit" 
                                        disabled={submitting}
                                        className="relative flex items-center justify-center gap-2 bg-[#c79c5e] hover:bg-[#b58c53] text-white font-bold text-sm rounded-xl px-8 py-3.5 transition-all shadow-lg shadow-[#c79c5e]/20 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                <span>Saving...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4" />
                                                <span>Update Details</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
