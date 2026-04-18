// src/components/PipelineCard.jsx
"use client";

import React from 'react';

const STATUS_COLORS = {
    'Cold': 'bg-blue-100/60 text-blue-700 border-blue-200/80 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50',
    'Warm': 'bg-amber-100/60 text-amber-700 border-amber-200/80 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50',
    'Replied': 'bg-cyan-100/60 text-cyan-700 border-cyan-200/80 dark:bg-cyan-900/30 dark:text-cyan-400 dark:border-cyan-800/50',
    'Follow-up Required': 'bg-orange-100/60 text-orange-700 border-orange-200/80 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800/50',
    'Negotiation': 'bg-purple-100/60 text-purple-700 border-purple-200/80 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800/50',
    'On Hold': 'bg-zinc-100/60 text-zinc-700 border-zinc-200/80 dark:bg-zinc-800/50 dark:text-zinc-300 dark:border-zinc-700/50',
    'Closed': 'bg-emerald-100/60 text-emerald-700 border-emerald-200/80 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50',
};

const DEFAULT_COLOR = 'bg-zinc-100/60 text-zinc-600 border-zinc-200/80 dark:bg-zinc-800/50 dark:text-zinc-300 dark:border-zinc-700/50';

export function PipelineCard({ pipelineStats }) {
    // Static fallback data
    const fallbackStats = [
        { label: 'Cold', count: 10 },
        { label: 'Warm', count: 5 },
        { label: 'Negotiation', count: 3 },
        { label: 'Closed', count: 2 },
    ];

    const stats = (pipelineStats && pipelineStats.length > 0)
        ? pipelineStats
        : fallbackStats;

    return (
        <div className="bg-white dark:bg-[#111] rounded-[1.5rem] p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-zinc-100 dark:border-zinc-800 flex flex-col h-full w-full overflow-hidden transition-colors">
            <h2 className="text-zinc-900 dark:text-zinc-100 font-bold text-base tracking-tight mb-3 shrink-0">Pipeline Status</h2>
            <div className="flex flex-wrap gap-2 flex-1 content-start overflow-y-auto">
                {stats.map((stat, idx) => (
                    <div key={idx} className={`flex items-center gap-2 px-4 py-3.5 rounded-xl border ${STATUS_COLORS[stat.label] || DEFAULT_COLOR} shrink-0`}>
                        <span className="text-lg font-black tracking-tight leading-none">{stat.count}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">{stat.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
