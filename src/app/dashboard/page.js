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

export default function Dashboard() {
        const router = useRouter();
        const [userName, setUserName] = useState("");

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
        }
    };

    checkUser();
}, []);
    return (
        <div className="flex h-screen w-full bg-[#161719] overflow-hidden font-sans">
            <Sidebar />
            <main className="flex-1 bg-[#f4f4f5] rounded-tl-[2rem] rounded-bl-[2rem] p-6 md:px-8 flex flex-col h-screen overflow-y-auto shadow-2xl border-l border-white/5">
                <div className="flex flex-col gap-5 max-w-[1400px] w-full mx-auto">

                    {/* Header Row */}
                    <div className="flex justify-between items-center w-full gap-4 shrink-0">
                        <div className="flex flex-col pt-1 min-w-0">
                            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Hello {userName || "User"},</h1>
                            <div className="flex items-center gap-4 mt-1.5 border-b border-transparent">
                                <p className="text-base font-semibold text-zinc-500">Council: <span className="font-bold text-zinc-800 ml-1">Tech Council</span></p>
                                <div className="flex items-center gap-1 cursor-pointer group hover:bg-zinc-200/50 px-2 py-0.5 rounded-md transition-colors -ml-2">
                                    <p className="text-base font-semibold text-zinc-500">College: <span className="font-bold text-zinc-800 ml-1">Engineering Inst.</span></p>
                                    <ChevronDown className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-700 transition-colors ml-0.5" />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 lg:gap-5 shrink-0">
                            {/* Universal Search Bar */}
                            <div className="relative group hidden sm:block">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-[#c79c5e] transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="pl-10 pr-5 py-2.5 w-72 rounded-full border border-zinc-200/80 outline-none focus:ring-2 focus:ring-[#c79c5e]/20 bg-white shadow-sm text-sm text-zinc-800 placeholder-zinc-400 transition-all font-medium"
                                />
                            </div>

                            {/* Profile Button */}
                            <button className="flex items-center gap-3 bg-white border border-zinc-200/80 hover:border-zinc-300 hover:bg-zinc-50 transition-all text-zinc-800 px-5 py-2 rounded-full font-semibold text-base shadow-sm group">
                                <span className="hidden sm:inline text-base">{userName || "User"}</span>
                                <div className="bg-zinc-100 rounded-full p-1 group-hover:bg-zinc-200 transition-colors">
                                    <User className="w-5 h-5 text-zinc-600" />
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Main Content Dashboard Grid */}
                    <div className="grid grid-cols-12 gap-5 pb-4">

                        {/* Left Section (9 cols) */}
                        <div className="col-span-12 xl:col-span-9 flex flex-col gap-5">

                            {/* Row 1: 3 Stat Cards */}
                            <div className="grid grid-cols-3 gap-5">
                                <StatCard title="Total Sponsorship Secured" amount="54,812" trend="up" trendValue="+2.5" />
                                <StatCard title="Pending Sponsorship" amount="36,254" trend="down" trendValue="-3.5" />
                                <StatCard title="Total Revenue" amount="126,348" trend="up" trendValue="+4.5" />
                            </div>

                            {/* Row 2: Revenue Flow & Event Sponsors */}
                            <div className="flex flex-row gap-5 h-[340px]">
                                <div className="flex-[2] h-full min-w-0">
                                    <RevenueFlowCard />
                                </div>
                                <div className="flex-[1] h-full min-w-0">
                                    <EventSponsorsCard />
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
                                <PipelineCard />
                            </div>
                        </div>

                    </div>

                </div>
            </main>
        </div>
    );
}
