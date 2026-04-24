import React, { useMemo } from 'react';
import { Trophy, Award, ChevronRight, Building } from 'lucide-react';

export default function AdminLeaderboard({ data: filteredData, rawData }) {

    // Use rawData to evaluate global council performance
    const councils = rawData?.councils || [];

    const leaderboard = useMemo(() => {
        const councilData = {};
        councils.forEach(c => councilData[c.councilid] = { name: c.councilname, rev: 0, closed: 0, total: 0 });

        (rawData?.outreach || []).forEach(o => {
            const cid = o.councilid;
            if (councilData[cid]) {
                councilData[cid].total += 1;
                if (o.status === 'Closed' || o.status === 'Confirmed') {
                    councilData[cid].closed += 1;
                }
            }
        });

        (rawData?.payments || []).forEach(p => {
            const s = (rawData?.sponsorships || []).find(s => s.sponsorshipid === p.sponsorshipid);
            if (s && s.event && s.event.councilid && councilData[s.event.councilid]) {
                councilData[s.event.councilid].rev += Number(p.amountpaid || 0);
            }
        });

        return Object.values(councilData).sort((a, b) => b.rev - a.rev);
    }, [rawData, councils]);

    return (
        <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 h-full">
            <div className="bg-gradient-to-br from-white to-zinc-50 dark:from-[#111] dark:to-zinc-900 rounded-[2rem] p-8 shadow-xl border border-zinc-200/80 dark:border-zinc-800 relative flex flex-col h-full flex-1">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 p-8 opacity-5 dark:opacity-10 text-zinc-900 dark:text-white pointer-events-none">
                    <Trophy className="w-[400px] h-[400px] absolute -right-20 -top-20" />
                </div>

                <div className="flex items-center gap-4 mb-8 relative z-10">
                    <div className="bg-[#c79c5e]/10 dark:bg-[#c79c5e]/20 p-4 rounded-2xl border border-[#c79c5e]/20 dark:border-[#c79c5e]/30">
                        <Building className="w-8 h-8 text-[#c79c5e]" />
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold text-zinc-900 dark:text-white leading-tight mb-1">Global Council Leaderboard</h3>
                        <p className="text-sm text-zinc-500 font-semibold max-w-xl">
                            Comprehensive ranking of all active councils across the system, ordered by total revenue generated.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-3 relative z-10 flex-1 overflow-y-auto no-scrollbar pr-4">
                    {leaderboard.length > 0 ? leaderboard.map((council, idx) => (
                        <div key={idx} className="flex items-center gap-6 bg-white dark:bg-[#161719] shadow-sm p-4 rounded-2xl transition-all border border-zinc-200/60 dark:border-zinc-800 hover:border-[#c79c5e]/30 hover:shadow-md cursor-pointer group">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-extrabold text-lg shrink-0 ${idx === 0 ? 'bg-[#c79c5e] text-white shadow-[#c79c5e]/30 shadow-lg' : idx === 1 ? 'bg-zinc-300 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300' : idx === 2 ? 'bg-amber-700/80 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700'}`}>
                                #{idx + 1}
                            </div>
                            <div className="flex flex-col flex-1 min-w-0">
                                <span className="font-bold text-zinc-900 dark:text-zinc-100 text-lg leading-tight truncate">{council.name}</span>
                                <div className="flex items-center gap-4 mt-1">
                                    <span className="text-zinc-500 text-[11px] font-bold tracking-wider">₹{council.rev.toLocaleString()} REVENUE</span>
                                    <span className="text-zinc-300 dark:text-zinc-700">•</span>
                                    <span className="text-zinc-500 text-[11px] font-bold tracking-wider">{council.closed} DEALS SECURED</span>
                                    <span className="text-zinc-300 dark:text-zinc-700">•</span>
                                    <span className="text-zinc-500 text-[11px] font-bold tracking-wider">{council.total} OUTREACHES</span>
                                </div>
                            </div>
                            <div className="w-48 bg-zinc-100 dark:bg-zinc-800 rounded-full h-2 hidden md:block overflow-hidden shrink-0 mt-1">
                                <div
                                    className="bg-[#c79c5e] h-full rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${Math.min(100, Math.max(2, (council.rev / Math.max(1, leaderboard[0]?.rev)) * 100))}%` }}
                                />
                            </div>
                            <ChevronRight className="w-5 h-5 text-zinc-300 dark:text-zinc-600 group-hover:text-[#c79c5e] transition-colors ml-2" />
                        </div>
                    )) : (
                        <div className="text-center py-20 bg-zinc-50 dark:bg-[#161719] rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-500 text-base font-medium">
                            No council matched the current context or no deals closed yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
