// src/components/PipelineCard.jsx
"use client";

import React from 'react';

export function PipelineCard() {
    const stats = [
        { label: 'Cold', count: 10, color: 'bg-blue-100/60 text-blue-700 border-blue-200/80' },
        { label: 'Contacted', count: 5, color: 'bg-amber-100/60 text-amber-700 border-amber-200/80' },
        { label: 'Negotiation', count: 3, color: 'bg-purple-100/60 text-purple-700 border-purple-200/80' },
        { label: 'Closed', count: 2, color: 'bg-emerald-100/60 text-emerald-700 border-emerald-200/80' },
    ];

    return (
        <div className="bg-white rounded-[1.5rem] p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-zinc-100 flex flex-col h-full w-full overflow-hidden">
            <h2 className="text-zinc-900 font-bold text-base tracking-tight mb-3 shrink-0">Pipeline Status</h2>
            <div className="flex flex-wrap gap-2 flex-1 content-start overflow-y-auto">
                {stats.map((stat, idx) => (
                    <div key={idx} className={`flex items-center gap-2 px-4 py-3.5 rounded-xl border ${stat.color} shrink-0`}>
                        <span className="text-lg font-black tracking-tight leading-none">{stat.count}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">{stat.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
