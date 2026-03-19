import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export function RelevantSponsorsCard() {
    const sponsors = [
        {
            id: 1,
            name: 'Acme Corp',
            industry: 'Technology',
            score: '98%',
            status: 'High Match'
        },
        {
            id: 2,
            name: 'Global Finance',
            industry: 'Banking',
            score: '92%',
            status: 'Great Match'
        },
        {
            id: 3,
            name: 'Stark Industries',
            industry: 'Defense',
            score: '85%',
            status: 'Good Match'
        },
        {
            id: 4,
            name: 'Wayne Ent.',
            industry: 'Conglomerate',
            score: '78%',
            status: 'Fair Match'
        }
    ];

    return (
        <div className="bg-white rounded-[1.5rem] p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-zinc-100 flex flex-col h-full w-full">
            <div className="flex justify-between items-center mb-5">
                <div>
                    <h2 className="text-zinc-900 font-bold text-lg tracking-tight">Relevant Sponsors</h2>
                    <p className="text-xs text-zinc-500 font-medium mt-0.5">Top AI-matched prospects</p>
                </div>
                <button className="text-zinc-400 hover:text-zinc-900 transition-colors border border-zinc-200 rounded-full p-1.5 hover:bg-zinc-50">
                    <ArrowUpRight className="w-4 h-4" />
                </button>
            </div>

            <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-1">
                {sponsors.map((sponsor) => (
                    <div key={sponsor.id} className="bg-white border border-zinc-100 shadow-sm rounded-xl p-3.5 flex justify-between items-center hover:border-zinc-300 hover:bg-zinc-50 transition-all cursor-pointer group">
                        <div className="flex flex-col">
                            <span className="text-zinc-900 font-bold text-sm tracking-tight">{sponsor.name}</span>
                            <span className="text-zinc-500 text-xs font-medium mt-0.5">{sponsor.industry}</span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-emerald-600 font-bold text-sm tracking-wide">{sponsor.score}</span>
                            <span className="text-zinc-400 group-hover:text-zinc-500 transition-colors text-[10px] font-bold uppercase mt-0.5">{sponsor.status}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
