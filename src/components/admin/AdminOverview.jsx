import React, { useMemo } from 'react';
import { StatCard } from '@/components/StatCard';
import { RevenueFlowCard } from '@/components/RevenueFlowCard';
import { PipelineCard } from '@/components/PipelineCard';
import { Award, Target, Trophy, ChevronRight } from 'lucide-react';

export default function AdminOverview({ data, rawData, selectedCouncil }) {
    
    // Parse properties safely
    const sponsors = data?.sponsors || [];
    const payments = data?.payments || [];
    const outreach = data?.outreach || [];
    const team = data?.teammembers || [];
    const councils = rawData?.councils || [];

    // Aggregations
    const totalSponsorsCount = sponsors.length;
    const totalRevenue = payments.reduce((acc, p) => acc + (Number(p.amountpaid) || 0), 0);

    // Revenue Flow mapping for the graph card
    const revenueFlowMap = {};
    payments.forEach(p => {
        const date = p.paymentdate?.split("T")[0] || p.paymentdate;
        if (!date) return;
        revenueFlowMap[date] = (revenueFlowMap[date] || 0) + (Number(p.amountpaid) || 0);
    });
    const revenueFlow = Object.entries(revenueFlowMap)
        .map(([date, amount]) => ({ date, amount }))
        .sort((a,b) => new Date(a.date) - new Date(b.date));

    // Outreach Status mapping (for Pipeline)
    const pipelineMap = {};
    outreach.forEach(o => {
        const status = o.status || 'Unknown';
        pipelineMap[status] = (pipelineMap[status] || 0) + 1;
    });
    const pipelineStats = Object.entries(pipelineMap).map(([label, count]) => ({ label, count }));

    // Team Leaderboard Logic
    const teamDeals = {};
    team.forEach(t => teamDeals[t.memberid] = { name: t.membername, closed: 0, revenue: 0 });
    
    outreach.forEach(o => {
        if (o.status === "Closed" || o.status === "Confirmed") {
            if (o.memberid && teamDeals[o.memberid]) {
                teamDeals[o.memberid].closed += 1;
                teamDeals[o.memberid].revenue += Number(o.deal_value || 0);
            }
        }
    });

    // Array and limit to top 5
    const leaderboard = Object.values(teamDeals)
        .filter(m => m.closed > 0)
        .sort((a,b) => b.closed - a.closed)
        .slice(0, 5);

    // Council Breakdown Logic (if All selected, show top councils)
    const councilPerformance = useMemo(() => {
        if (selectedCouncil !== "all") return null;
        const councilData = {};
        councils.forEach(c => councilData[c.councilid] = { name: c.councilname, rev: 0, sponsors: 0, closed: 0, total: 0 });
        
        rawData.outreach.forEach(o => {
            const cid = o.councilid;
            if (councilData[cid]) {
                councilData[cid].total += 1;
                if (o.status === 'Closed' || o.status === 'Confirmed') {
                    councilData[cid].closed += 1;
                }
            }
        });
        rawData.payments.forEach(p => {
            // Mapping payment to council requires looking at sponsorship
            const s = rawData.sponsorships.find(s => s.sponsorshipid === p.sponsorshipid);
            if (s && s.event && s.event.councilid && councilData[s.event.councilid]) {
                councilData[s.event.councilid].rev += Number(p.amountpaid || 0);
            }
        });
        
        return Object.values(councilData).sort((a,b) => b.rev - a.rev);
    }, [rawData, selectedCouncil, councils]);


    // Metrics calcs
    const closedCount = outreach.filter(o => o.status === "Closed" || o.status === "Confirmed").length;
    const conversionRate = outreach.length > 0 ? ((closedCount / outreach.length) * 100).toFixed(1) : 0;

    return (
        <div className="flex flex-col xl:flex-row gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            
            {/* Left Col (2/3): Stat Cards & Revenue Timeline */}
            <div className="flex-[2] flex flex-col gap-6 min-w-0">
                
                {/* 2 Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 shrink-0">
                    <StatCard 
                        title="Total Revenue Generated" 
                        amount={totalRevenue.toLocaleString()} 
                        trend="up" 
                        trendValue="+12%" 
                    />
                    <div className="bg-[#c79c5e] text-white rounded-[1.25rem] p-5 shadow-lg flex flex-col justify-between w-full relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 bg-white/10 w-24 h-24 rounded-full blur-xl group-hover:bg-white/20 transition-all duration-700"></div>
                        <div className="flex items-center gap-2 mb-2 z-10">
                            <Target className="w-5 h-5 text-white/80" />
                            <span className="text-white/80 font-bold text-sm tracking-wide">Avg Conversion</span>
                        </div>
                        <div className="z-10 mt-auto">
                            <h3 className="text-white font-extrabold text-3xl tracking-tight mb-0.5">{conversionRate}%</h3>
                            <p className="text-white/70 text-xs font-semibold">{closedCount} of {outreach.length} outreaches secured</p>
                        </div>
                    </div>
                </div>

                {/* Revenue Timeline (Fills remaining height) */}
                <div className="bg-white dark:bg-[#111] rounded-[1.5rem] p-5 shadow-sm border border-zinc-100 dark:border-zinc-800 flex-1 flex flex-col min-h-[400px]">
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-4 px-1 shrink-0">Revenue Timeline</h3>
                    <div className="flex-1 w-full h-full min-h-0 relative">
                        {revenueFlow.length > 0 ? (
                            <div className="absolute inset-0">
                                <RevenueFlowCard revenueFlow={revenueFlow} />
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-zinc-400 text-sm">No revenue data strictly available for this timeframe/council.</div>
                        )}
                    </div>
                </div>

            </div>

            {/* Right Col (1/3): Rankings & Team */}
            <div className="flex-[1] xl:min-w-[380px] flex flex-col gap-6 shrink-0">
                
                {/* Elite Members */}
                <div className="bg-gradient-to-b from-white to-zinc-50 dark:from-[#111] dark:to-zinc-900 rounded-[1.5rem] p-6 shadow-xl border border-zinc-200/80 dark:border-zinc-800 relative overflow-hidden flex flex-col">
                    <div className="absolute top-0 right-0 p-8 opacity-5 dark:opacity-10 text-zinc-900 dark:text-white">
                        <Trophy className="w-48 h-48" />
                    </div>
                    
                    <div className="flex items-center gap-3 mb-6 relative z-10 shrink-0">
                        <div className="bg-[#c79c5e]/10 dark:bg-[#c79c5e]/20 p-2.5 rounded-xl border border-[#c79c5e]/20 dark:border-[#c79c5e]/30">
                            <Award className="w-5 h-5 text-[#c79c5e]" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-white leading-tight">Elite Members</h3>
                            <p className="text-xs text-zinc-500 font-semibold">Most deals closed successfully</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 relative z-10 shrink-0">
                        {leaderboard.length > 0 ? leaderboard.map((member, idx) => (
                            <div key={idx} className="flex items-center gap-4 bg-zinc-100/50 dark:bg-white/5 hover:bg-zinc-200/60 dark:hover:bg-white/10 p-3 rounded-2xl transition-all border border-zinc-200/60 dark:border-transparent hover:border-zinc-300 dark:hover:border-zinc-700/50 cursor-pointer">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-sm ${idx === 0 ? 'bg-[#c79c5e] text-white shadow-[#c79c5e]/30 shadow-lg' : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700'}`}>
                                    #{idx + 1}
                                </div>
                                <div className="flex flex-col flex-1">
                                    <span className="font-bold text-zinc-900 dark:text-zinc-100 text-base leading-tight">{member.name}</span>
                                    <span className="text-zinc-500 text-[11px] font-bold tracking-wider">{member.closed} DEALS CLOSED</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-zinc-400" />
                            </div>
                        )) : (
                            <div className="text-center py-6 text-zinc-500 text-sm font-medium">
                                No closed deals yet.
                            </div>
                        )}
                    </div>
                </div>

                {/* Council Rankings (Fills remaining height) */}
                {selectedCouncil === "all" && councilPerformance && (
                    <div className="bg-white dark:bg-[#111] rounded-[1.5rem] p-6 shadow-sm border border-zinc-100 dark:border-zinc-800 flex flex-col flex-1">
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-4 shrink-0">Council Rankings</h3>
                        <div className="flex flex-col gap-4 flex-1 overflow-y-auto no-scrollbar">
                            {councilPerformance.slice(0,4).map((c, i) => (
                                <div key={i} className="flex flex-col mb-1 group">
                                    <div className="flex justify-between items-center mb-1.5">
                                        <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 group-hover:text-[#c79c5e] transition-colors">{c.name}</span>
                                        <span className="text-sm font-bold text-zinc-900 dark:text-white">₹{c.rev.toLocaleString()}</span>
                                    </div>
                                    <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                                        <div 
                                            className="bg-[#c79c5e] h-full rounded-full transition-all duration-1000 ease-out" 
                                            style={{ width: `${Math.min(100, Math.max(2, (c.rev / Math.max(1, councilPerformance[0]?.rev)) * 100))}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
