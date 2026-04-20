"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { User, ShieldAlert } from "lucide-react";
import { supabase } from "@/lib/supabase";

import AdminOverview from "@/components/admin/AdminOverview";
import AdminUsers from "@/components/admin/AdminUsers";
import AdminFeedback from "@/components/admin/AdminFeedback";
import AdminLeaderboard from "@/components/admin/AdminLeaderboard";

export default function AdminTemplate({ activeTab }) {
    const router = useRouter();
    const [userName, setUserName] = useState("");
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState("");
    const [adminData, setAdminData] = useState(null);
    const [selectedCouncil, setSelectedCouncil] = useState("all");

    useEffect(() => {
        const verifyAndFetch = async () => {
            const { data: authData } = await supabase.auth.getUser();
            if (!authData?.user) {
                router.push("/login");
                return;
            }

            try {
                // Fetch basic user context
                const userRes = await fetch(`/api/user?id=${authData.user.id}`);
                const userInfo = await userRes.json();
                
                if (userInfo.error || userInfo.role !== "admin") {
                    setAuthError("You do not have permission to view the Admin Dashboard.");
                    router.push("/dashboard");
                    return;
                }

                setUserName(userInfo.username || authData.user.email.split("@")[0]);

                // Fetch Bulk Admin Data
                const { data: session } = await supabase.auth.getSession();
                const headers = {
                    Authorization: `Bearer ${session?.session?.access_token}`,
                };

                const adminRes = await fetch("/api/admin/dashboard", { headers });
                const dashboardData = await adminRes.json();
                if (dashboardData.error) throw new Error(dashboardData.error);

                setAdminData(dashboardData);
            } catch (err) {
                console.error("Failed to load admin data:", err);
                setAuthError("Failed to fetch admin dashboard. Ensure the backend handles /api/admin/dashboard correctly.");
            } finally {
                setLoading(false);
            }
        };

        verifyAndFetch();
    }, [router]);

    // Data filtering context
    const filteredData = useMemo(() => {
        if (!adminData) return null;
        
        const filterByCouncil = (list) => {
            if (selectedCouncil === "all") return list;
            return list.filter(item => {
                const cid = item.councilid || item.event?.councilid || item.created_by_councilid;
                return cid === Number(selectedCouncil);
            });
        };

        return {
            ...adminData,
            outreach: filterByCouncil(adminData.outreach),
            teammembers: filterByCouncil(adminData.teammembers),
            users: filterByCouncil(adminData.users),
        };
    }, [adminData, selectedCouncil]);

    if (loading) {
        return (
            <div className="flex h-screen w-full bg-[#161719] items-center justify-center text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 rounded-full border-2 border-[#c79c5e] border-t-transparent animate-spin" />
                    <p className="text-zinc-400 font-medium">Verifying Credentials...</p>
                </div>
            </div>
        );
    }

    if (authError) {
        return (
            <div className="flex h-screen w-full bg-[#161719] items-center justify-center p-6 text-center">
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-8 max-w-md">
                    <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
                    <p className="text-zinc-400">{authError}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen w-full bg-[#161719] overflow-hidden font-sans">
            <Sidebar />
            <main className="flex-1 bg-[#f4f4f5] dark:bg-black rounded-tl-[2rem] rounded-bl-[2rem] p-6 md:px-8 flex flex-col h-screen overflow-y-auto shadow-2xl border-l border-white/5 transition-colors">
                <div className="flex flex-col gap-5 max-w-[1400px] w-full mx-auto">
                    
                    {/* Header Row */}
                    <div className="flex justify-between items-end w-full gap-4 shrink-0 pb-2 border-b border-zinc-200 dark:border-zinc-800 mb-2">
                        <div className="flex flex-col pt-1 min-w-0 pb-4">
                            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
                                <ShieldAlert className="w-6 h-6 text-[#c79c5e]" />
                                Admin Workspace
                            </h1>
                            <p className="text-base font-semibold text-zinc-500 dark:text-zinc-400 mt-1">
                                System-wide configuration and metrics
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 lg:gap-5 shrink-0 pb-4">
                            {/* Universal Council Filter */}
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 hidden sm:block">Filter Context:</span>
                                <select 
                                    className="px-4 py-2 bg-white dark:bg-[#111] border border-zinc-200/80 dark:border-zinc-800 rounded-full text-sm font-bold text-zinc-800 dark:text-zinc-200 shadow-sm focus:ring-2 focus:ring-[#c79c5e]/30 transition-all outline-none"
                                    value={selectedCouncil}
                                    onChange={(e) => setSelectedCouncil(e.target.value)}
                                >
                                    <option value="all">ALL DATA</option>
                                    {adminData?.councils.map(c => (
                                        <option key={c.councilid} value={c.councilid}>{c.councilname}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Profile Control - Navigates to standard profile for edits */}
                            <button onClick={() => router.push('/profile')} className="flex items-center gap-3 bg-white dark:bg-[#111] border border-zinc-200/80 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all text-zinc-800 dark:text-zinc-200 px-5 py-2 rounded-full font-semibold text-base shadow-sm group">
                                <span className="hidden sm:inline text-sm">{userName || "Admin"}</span>
                                <div className="bg-zinc-100 dark:bg-zinc-800 rounded-full p-1 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700 transition-colors">
                                    <User className="w-5 h-5 text-zinc-600 dark:text-zinc-300" />
                                </div>
                            </button>
                            <ThemeToggle />
                        </div>
                    </div>

                    {/* Main Workspace Mount */}
                    <div className="flex-1 py-1">
                        {activeTab === 'overview' && <AdminOverview data={filteredData} rawData={adminData} selectedCouncil={selectedCouncil} />}
                        {activeTab === 'users' && <AdminUsers data={filteredData} rawData={adminData} 
                            onUserUpdated={(updatedUser) => {
                                const mapped = adminData.users.map(u => u.id === updatedUser.id ? updatedUser : u);
                                setAdminData({...adminData, users: mapped});
                            }}
                        />}
                        {activeTab === 'leaderboard' && <AdminLeaderboard data={filteredData} rawData={adminData} />}
                        {activeTab === 'feedback' && <AdminFeedback data={filteredData} />}
                    </div>

                </div>
            </main>
        </div>
    );
}
