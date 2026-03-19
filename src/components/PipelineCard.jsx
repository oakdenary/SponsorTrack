// src/components/PipelineCard.jsx
"use client";

import React from 'react';

export function PipelineCard() {
    const stats = [
        { label: 'Cold', count: 10, color: 'bg-blue-100/50 text-blue-700 border-blue-200' },
        { label: 'Contacted', count: 5, color: 'bg-amber-100/50 text-amber-700 border-amber-200' },
        { label: 'Negotiation', count: 3, color: 'bg-purple-100/50 text-purple-700 border-purple-200' },
        { label: 'Closed', count: 2, color: 'bg-emerald-100/50 text-emerald-700 border-emerald-200' },
    ];

    return (
        <div className="bg-white rounded-[1.5rem] p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-zinc-100 flex flex-col h-full w-full">
            <h2 className="text-zinc-900 font-bold text-lg tracking-tight mb-4">Pipeline Status</h2>
            <div className="grid grid-cols-2 gap-3 flex-1">
                {stats.map((stat, idx) => (
                    <div key={idx} className={`flex flex-col justify-center px-4 py-3 rounded-[1rem] border ${stat.color}`}>
                        <span className="text-2xl font-black tracking-tight leading-none mb-1">{stat.count}</span>
                        <span className="text-[11px] font-bold uppercase tracking-wider">{stat.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
