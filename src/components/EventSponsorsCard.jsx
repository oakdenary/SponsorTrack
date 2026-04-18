"use client";

import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ChevronDown } from 'lucide-react';

const COLORS = ['#10b981', '#3b82f6', '#f43f5e', '#d19d5a', '#8b5cf6', '#f97316', '#06b6d4', '#ec4899'];

export function EventSponsorsCard({ eventSponsors }) {
    const [isCompact, setIsCompact] = useState(false);

    useEffect(() => {
        const check = () => setIsCompact(window.innerWidth < 1100);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    // Transform API data into chart data
    const data = (eventSponsors || []).map((es, idx) => ({
        name: es.eventname,
        value: es.total,
        color: COLORS[idx % COLORS.length],
    }));

    const hasData = data.length > 0;
    const total = data.reduce((acc, item) => acc + item.value, 0);

    return (
        <div className="bg-white dark:bg-[#111] rounded-[1.5rem] p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-zinc-100 dark:border-zinc-800 flex flex-col h-full w-full relative overflow-hidden transition-colors">
            <div className="flex justify-between items-center mb-3 shrink-0">
                <div className="min-w-0">
                    <h2 className="text-zinc-900 dark:text-zinc-100 font-bold text-base tracking-tight truncate">Event Sponsors</h2>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium mt-0.5">Sponsors per event</p>
                </div>
            </div>

            {!hasData ? (
                <div className="flex items-center justify-center flex-1">
                    <p className="text-zinc-400 font-semibold text-sm">No event data yet</p>
                </div>
            ) : isCompact ? (
                /* Compact mode: no pie chart, just a clean colored list */
                <div className="flex flex-col gap-2 flex-1 justify-center overflow-y-auto">
                    <div className="text-center mb-2">
                        <span className="text-zinc-400 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Total</span>
                        <span className="text-zinc-900 dark:text-zinc-100 font-bold text-lg ml-2">{total}</span>
                    </div>
                    {data.map((item, idx) => {
                        const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
                        return (
                            <div key={idx} className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                                <div className="flex items-center gap-2 min-w-0">
                                    <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: item.color }}></div>
                                    <span className="text-zinc-700 dark:text-zinc-300 text-xs font-semibold truncate">{item.name}</span>
                                </div>
                                <span className="text-zinc-900 dark:text-zinc-100 font-bold text-xs shrink-0 ml-2">{item.value}</span>
                            </div>
                        );
                    })}
                </div>
            ) : (
                /* Full mode: pie chart + legend */
                <div className="flex flex-1 items-center justify-between min-h-0 overflow-hidden">
                    <div className="relative w-1/2 h-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius="45%"
                                    outerRadius="65%"
                                    paddingAngle={4}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#161719', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                                    itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                                    formatter={(val) => `${val} sponsors`}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-zinc-500 dark:text-zinc-400 text-[9px] font-bold uppercase tracking-wider">Total</span>
                            <span className="text-zinc-900 dark:text-zinc-100 font-bold text-base leading-tight">{total}</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2.5 w-1/2 pl-4 overflow-y-auto">
                        {data.map((item, idx) => {
                            const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0;
                            return (
                                <div key={idx} className="flex justify-between items-center w-full">
                                    <div className="flex items-center gap-1.5 min-w-0">
                                        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }}></div>
                                        <span className="text-zinc-600 dark:text-zinc-400 text-xs font-semibold truncate">{item.name}</span>
                                    </div>
                                    <span className="text-zinc-900 dark:text-zinc-100 font-bold text-xs shrink-0 ml-1">{percentage}%</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
