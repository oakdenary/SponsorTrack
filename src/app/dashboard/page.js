"use client";

import { Sidebar } from "@/components/Sidebar";
import { HorizontalCalendarCard } from "@/components/HorizontalCalendarCard";
import { RecentActivityCard } from "@/components/RecentActivityCard";
import { RevenueFlowCard } from "@/components/RevenueFlowCard";
import { EventSponsorsCard } from "@/components/EventSponsorsCard";
import { StatCard } from "@/components/StatCard";
import { PipelineCard } from "@/components/PipelineCard";
import { User, Search, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ThemeToggle } from "@/components/ThemeToggle";

const inputClass =
  "w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#c79c5e]/30";

export default function Dashboard() {
        const router = useRouter();
        const [userName, setUserName] = useState("");
        const [userData, setUserData] = useState({});
        const [stats, setStats] = useState({});
        const [showModal, setShowModal] = useState(false);
        const [contributionType, setContributionType] = useState("");

        useEffect(() => {
    const checkUser = async () => {
        const { data } = await supabase.auth.getUser();

        if (!data.user) {
            router.push("/login");
        } else {
            const user = data.user;

            // Try to get username from metadata
            let name = user.user_metadata?.username;

            // Fallback: use email before "@"
            if (!name && user.email) {
                name = user.email.split("@")[0];
            }

            setUserName(name || "User");

            // Fetch full user details from API
            try {
                const res = await fetch(`/api/user?id=${user.id}`);
                const userInfo = await res.json();
                if (!userInfo.error) {
                    setUserData(userInfo);
                    if (userInfo.username) setUserName(userInfo.username);
                }
            } catch (err) {
                console.error("Failed to fetch user info:", err);
            }
        }
    };

    checkUser();
}, []);

    // Fetch dashboard stats
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch("/api/dashboard");
                const data = await res.json();
                if (!data.error) {
                    setStats(data);
                }
            } catch (err) {
                console.error("Failed to fetch dashboard stats:", err);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="flex h-screen w-full bg-[#161719] overflow-hidden font-sans">
            <Sidebar />
            <main className="flex-1 bg-[#f4f4f5] dark:bg-black rounded-tl-[2rem] rounded-bl-[2rem] p-6 md:px-8 flex flex-col h-screen overflow-y-auto shadow-2xl border-l border-white/5 transition-colors">
                <div className="flex flex-col gap-5 max-w-[1400px] w-full mx-auto">

                    {/* Header Row */}
                    <div className="flex justify-between items-center w-full gap-4 shrink-0">
                        <div className="flex flex-col pt-1 min-w-0">
                            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Hello {userName || "User"},</h1>
                            <div className="flex items-center gap-4 mt-1.5 border-b border-transparent">
                                <p className="text-base font-semibold text-zinc-500 dark:text-zinc-400">Council: <span className="font-bold text-zinc-800 dark:text-zinc-200 ml-1">{userData.councilname || "—"}</span></p>
                                <div className="flex items-center gap-1 cursor-pointer group hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 px-2 py-0.5 rounded-md transition-colors -ml-2">
                                    <p className="text-base font-semibold text-zinc-500 dark:text-zinc-400">Role: <span className="font-bold text-zinc-800 dark:text-zinc-200 ml-1">{userData.role || "user"}</span></p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 lg:gap-5 shrink-0">
                            <button
                                onClick={() => setShowModal(true)}
                                className="bg-[#c79c5e] hover:bg-[#b58c53] text-white font-semibold px-4 py-2 rounded-full text-sm shadow-sm transition-all"
                            >
                                + Add Sponsor
                            </button>
                            {/* Universal Search Bar */}
                            <div className="relative group hidden sm:block">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-[#c79c5e] transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="pl-10 pr-5 py-2.5 w-72 rounded-full border border-zinc-200/80 dark:border-zinc-800 outline-none focus:ring-2 focus:ring-[#c79c5e]/20 bg-white dark:bg-[#111] shadow-sm text-sm text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 transition-all font-medium"
                                />
                            </div>

                            {/* Profile Button */}
                            <button className="flex items-center gap-3 bg-white dark:bg-[#111] border border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all text-zinc-800 dark:text-zinc-200 px-5 py-2 rounded-full font-semibold text-base shadow-sm group">
                                <span className="hidden sm:inline text-base">{userName || "User"}</span>
                                <div className="bg-zinc-100 dark:bg-zinc-800 rounded-full p-1 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700 transition-colors">
                                    <User className="w-5 h-5 text-zinc-600 dark:text-zinc-300" />
                                </div>
                            </button>
                            <ThemeToggle />
                        </div>
                    </div>

                    {/* Main Content Dashboard Grid */}
                    <div className="grid grid-cols-12 gap-5 pb-4">

                        {/* Left Section (9 cols) */}
                        <div className="col-span-12 xl:col-span-9 flex flex-col gap-5">

                            {/* Row 1: 3 Stat Cards */}
                            <div className="grid grid-cols-3 gap-5">
                                <StatCard
                                    title="Total Sponsorship Secured"
                                    amount={stats.totalSecured != null ? stats.totalSecured.toLocaleString() : "—"}
                                    trend="up"
                                    trendValue="+2.5"
                                />
                                <StatCard
                                    title="Pending Sponsorship"
                                    amount={stats.pending != null ? stats.pending.toLocaleString() : "—"}
                                    trend="down"
                                    trendValue="-3.5"
                                />
                                <StatCard
                                    title="Total Revenue"
                                    amount={stats.revenue != null ? stats.revenue.toLocaleString() : "—"}
                                    trend="up"
                                    trendValue="+4.5"
                                />
                            </div>

                            {/* Row 2: Revenue Flow & Event Sponsors */}
                            <div className="flex flex-row gap-5 h-[340px]">
                                <div className="flex-[2] h-full min-w-0">
                                    <RevenueFlowCard revenueFlow={stats.revenueFlow} />
                                </div>
                                <div className="flex-[1] h-full min-w-0">
                                    <EventSponsorsCard eventSponsors={stats.eventSponsors} />
                                </div>
                            </div>

                            {/* Row 3: Horizontal Calendar */}
                            <div className="h-[240px]">
                                <HorizontalCalendarCard />
                            </div>

                        </div>

                        {/* Right Section (3 cols): Recent Activity & Pipeline */}
                        <div className="col-span-12 xl:col-span-3 flex flex-col gap-5">
                            <div className="flex-[1.5] min-h-[300px]">
                                <RecentActivityCard />
                            </div>
                            <div className="shrink-0">
                                <PipelineCard pipelineStats={stats.pipelineStats} />
                            </div>
                        </div>

                    </div>

                </div>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        {/* Blur background */}
                        <div
                            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                            onClick={() => setShowModal(false)}
                        ></div>

                        {/* Modal */}
                        <div className="relative bg-white dark:bg-[#111] rounded-2xl p-6 w-full max-w-md shadow-2xl z-10 border border-zinc-200 dark:border-zinc-800">
                            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                                Add Sponsor
                            </h2>

                            <div className="flex flex-col gap-4">
                                <input className={`${inputClass} dark:bg-zinc-900 dark:border-zinc-800 dark:text-white`} placeholder="Name" />
                                <input className={`${inputClass} dark:bg-zinc-900 dark:border-zinc-800 dark:text-white`} placeholder="Phone Number" />
                                <input className={`${inputClass} dark:bg-zinc-900 dark:border-zinc-800 dark:text-white`} placeholder="Category" />
                                <input className={`${inputClass} dark:bg-zinc-900 dark:border-zinc-800 dark:text-white`} placeholder="Status" />

                                {/* Contribution Type */}
                                <select
                                    value={contributionType}
                                    onChange={(e) => setContributionType(e.target.value)}
                                    className={`${inputClass} dark:bg-zinc-900 dark:border-zinc-800 dark:text-white`}
                                >
                                    <option value="">Contribution Type</option>
                                    <option value="money">Money</option>
                                    <option value="in-kind">In Kind</option>
                                </select>

                                {contributionType === "money" && (
                                    <>
                                        <input className={`${inputClass} dark:bg-zinc-900 dark:border-zinc-800 dark:text-white`} placeholder="Amount" />
                                        <input className={`${inputClass} dark:bg-zinc-900 dark:border-zinc-800 dark:text-white`} placeholder="Deliverables" />
                                    </>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                                >
                                    Cancel
                                </button>
                                <button className="px-4 py-2 rounded-lg bg-[#c79c5e] text-white font-semibold">
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
