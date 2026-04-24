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
import ProfileCompletionModal from "@/components/ProfileCompletionModal";

const inputClass =
    "w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#c79c5e]/30";

export default function Dashboard() {
    const router = useRouter();
    const [userName, setUserName] = useState("");
    const [userData, setUserData] = useState({});
    const [stats, setStats] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [contributionType, setContributionType] = useState("");

    const [authUser, setAuthUser] = useState(null);
    const [calendarEvents, setCalendarEvents] = useState([]);
    const [needsOnboarding, setNeedsOnboarding] = useState(false);

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
                setAuthUser(user);

                // Fetch full user details from API
                try {
                    const res = await fetch(`/api/user?id=${user.id}`);
                    const userInfo = await res.json();

                    if (userInfo.role === 'admin') {
                        router.push('/admin/dashboard');
                        return;
                    }

                    if (userInfo.error === "User not found") {
                        setNeedsOnboarding(true);
                    } else if (!userInfo.error) {
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

    useEffect(() => {
        const fetchGoogleCalendar = async () => {
            try {
                const session = await supabase.auth.getSession();
                const token = session.data.session?.provider_token;

                if (!token) {
                    console.log("User not logged in with Google");
                    return;
                }

                const timeMin = new Date();
                timeMin.setMonth(timeMin.getMonth() - 1);
                const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?singleEvents=true&orderBy=startTime&maxResults=50&timeMin=${timeMin.toISOString()}`;
                
                const res = await fetch(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();

                if (data.items) {
                    setCalendarEvents(data.items);
                }
            } catch (err) {
                console.error("Calendar fetch error:", err);
            }
        };

        if (authUser) {
            fetchGoogleCalendar();
        }
    }, [authUser]);

    // Fetch dashboard stats
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const session = await supabase.auth.getSession();
                const token = session.data.session?.access_token;

                if (!token) return;

                const res = await fetch("/api/dashboard", {
                    cache: "no-store",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = await res.json();
                if (!data.error) {
                    setStats(data);
                }
            } catch (err) {
                console.error("Failed to fetch dashboard stats:", err);
            }
        };

        if (authUser) {
            fetchStats();
        }
    }, [authUser]);

    // Local state for editable budget
    const [requiredBudget, setRequiredBudget] = useState("0");
    useEffect(() => {
        if (userData?.councilid) {
            const saved = localStorage.getItem(`budget_${userData.councilid}`);
            if (saved) setRequiredBudget(saved);
            else setRequiredBudget("250000"); // default
        }
    }, [userData]);

    const handleBudgetChange = (e) => {
        const val = e.target.value.replace(/[^0-9]/g, '');
        setRequiredBudget(val);
        if (userData?.councilid) {
            localStorage.setItem(`budget_${userData.councilid}`, val);
        }
    };

    // 'My Contribution' is completely handled by the backend /dashboard endpoint mapping directly natively to memberid

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
                            <button onClick={() => router.push('/profile')} className="flex items-center gap-3 bg-white dark:bg-[#111] border border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all text-zinc-800 dark:text-zinc-200 px-5 py-2 rounded-full font-semibold text-base shadow-sm group">
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
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div className="bg-white dark:bg-[#111] border border-zinc-200/80 dark:border-zinc-800 rounded-[1.5rem] p-5 shadow-sm min-w-0 flex flex-col justify-center">
                                    <h3 className="text-sm font-bold text-zinc-500 mb-1 tracking-wide uppercase">Council Revenue</h3>
                                    <div className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 mt-1 truncate">
                                        ₹{stats.totalRevenue ? stats.totalRevenue.toLocaleString() : "0"}
                                    </div>
                                    <p className="text-xs font-semibold text-zinc-400 mt-2">Total revenue in deals closed</p>
                                </div>

                                <div className="bg-white dark:bg-[#111] border border-zinc-200/80 dark:border-zinc-800 rounded-[1.5rem] p-5 shadow-sm min-w-0 flex flex-col justify-center">
                                    <h3 className="text-sm font-bold text-zinc-500 mb-1 tracking-wide uppercase">Council Deals</h3>
                                    <div className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 mt-1">
                                        {stats.totalDeals || 0}
                                    </div>
                                    <p className="text-xs font-semibold text-zinc-400 mt-2">Total deals closed</p>
                                </div>
                                
                                <div className="bg-white dark:bg-[#111] border border-zinc-200/80 dark:border-zinc-800 rounded-[1.5rem] p-5 shadow-sm min-w-0 flex flex-col justify-center ring-1 ring-[#c79c5e]/30 dark:ring-[#c79c5e]/20 bg-gradient-to-br from-white to-[#c79c5e]/5 dark:from-[#111] dark:to-[#c79c5e]/10 relative overflow-hidden">
                                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#c79c5e]/10 rounded-full blur-2xl"></div>
                                    <h3 className="text-sm font-bold text-[#c79c5e] mb-1 tracking-wide uppercase relative z-10">My Contribution</h3>
                                    <div className="flex flex-col gap-1.5 mt-1 relative z-10">
                                        <div className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 truncate">
                                            ₹{stats.myContribution?.totalValue ? stats.myContribution.totalValue.toLocaleString() : "0"}
                                        </div>
                                        <p className="text-sm font-black text-zinc-600 dark:text-zinc-400 mt-1">
                                            {stats.myContribution?.totalDeals || 0} Deals Closed
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Row 2: Revenue Flow & Event Sponsors (Now Sponsor Categories) */}
                            <div className="flex flex-row gap-5 h-[340px]">
                                <div className="flex-[2] h-full min-w-0">
                                    <RevenueFlowCard revenueFlow={stats.revenueFlow} />
                                </div>
                                <div className="flex-[1] h-full min-w-0">
                                    <EventSponsorsCard pieData={stats.pieData} />
                                </div>
                            </div>

                            {/* Row 3: Horizontal Calendar */}
                            <div className="h-[240px]">
                                <HorizontalCalendarCard events={calendarEvents} />
                            </div>

                        </div>

                        {/* Right Section (3 cols): Recent Activity & Pipeline */}
                        <div className="col-span-12 xl:col-span-3 flex flex-col gap-5">
                            <div className="flex-[1.5] min-h-[300px]">
                                <RecentActivityCard events={calendarEvents} />
                            </div>
                            <div className="shrink-0">
                                <PipelineCard pipelineStats={stats.pipelineStats} />
                            </div>
                        </div>

                    </div>

                </div>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div
                            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                            onClick={() => setShowModal(false)}
                        ></div>

                        <div className="relative bg-white dark:bg-[#111] rounded-2xl p-6 w-full max-w-md shadow-2xl z-10 border border-zinc-200 dark:border-zinc-800">
                            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                                Add Sponsor to Global Directory
                            </h2>

                            <form id="addSponsorForm" onSubmit={async (e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);
                                const session = await supabase.auth.getSession();
                                const token = session.data.session?.access_token;

                                const payload = {
                                    companyname: formData.get("companyname"),
                                    contactperson: formData.get("contactperson"),
                                    designation: formData.get("designation"),
                                    email: formData.get("email"),
                                    phoneno: formData.get("phoneno"),
                                    sponsorcategoryid: formData.get("category") || null,
                                };

                                const res = await fetch("/api/sponsors", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                        "Authorization": `Bearer ${token}`
                                    },
                                    body: JSON.stringify(payload)
                                });

                                if (res.ok) {
                                    setShowModal(false);
                                } else {
                                    const errData = await res.json();
                                    alert(`Failed to insert sponsor: ${errData.error || "Unknown error"}`);
                                }
                            }} className="flex flex-col gap-4">
                                <input required name="companyname" className={`${inputClass} dark:bg-zinc-900 dark:border-zinc-800 dark:text-white`} placeholder="Company Name *" />

                                <select name="category" className={`${inputClass} dark:bg-zinc-900 dark:border-zinc-800 dark:text-white`}>
                                    <option value="">Select Category (Optional)</option>
                                    <option value="1">Banking</option>
                                    <option value="2">Food & Beverage</option>
                                    <option value="3">Education</option>
                                    <option value="4">Fashion</option>
                                    <option value="5">Media</option>
                                    <option value="6">Technology</option>
                                    <option value="7">Travel</option>
                                    <option value="8">Entertainment</option>
                                    <option value="9">Beauty & Personal Care</option>
                                </select>

                                <div className="grid grid-cols-2 gap-3">
                                    <input name="contactperson" className={`${inputClass} dark:bg-zinc-900 dark:border-zinc-800 dark:text-white`} placeholder="Contact Person" />
                                    <input name="designation" className={`${inputClass} dark:bg-zinc-900 dark:border-zinc-800 dark:text-white`} placeholder="Designation" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <input name="email" type="email" className={`${inputClass} dark:bg-zinc-900 dark:border-zinc-800 dark:text-white`} placeholder="Email Address" />
                                    <input name="phoneno" className={`${inputClass} dark:bg-zinc-900 dark:border-zinc-800 dark:text-white`} placeholder="Phone Number" />
                                </div>

                                <div className="flex justify-end gap-3 mt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold"
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="px-4 py-2 rounded-lg bg-[#c79c5e] hover:bg-[#b58c53] transition-colors text-white font-semibold">
                                        Save Sponsor
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>

            {/* Global Onboarding Modal Block */}
            {needsOnboarding && authUser && (
                <ProfileCompletionModal
                    authUser={authUser}
                    email={authUser.email}
                    defaultName={userName}
                    onComplete={(newUserData) => {
                        setUserData(newUserData);
                        setUserName(newUserData.username);
                        setNeedsOnboarding(false);
                    }}
                />
            )}
        </div>
    );
}
