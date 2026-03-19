"use client";

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ChevronDown } from 'lucide-react';

export function RevenueFlowCard() {
    const [view, setView] = useState('Monthly');
    const [isOpen, setIsOpen] = useState(false);

    const dataMonthly = [
        { name: 'Jan', value: 30 },
        { name: 'Feb', value: 40 },
        { name: 'Mar', value: 35 },
        { name: 'Apr', value: 50 },
        { name: 'May', value: 45 },
        { name: 'Jun', value: 60 },
        { name: 'Jul', value: 85 },
        { name: 'Aug', value: 65 },
        { name: 'Sep', value: 55 },
        { name: 'Oct', value: 70 },
        { name: 'Nov', value: 45 },
        { name: 'Dec', value: 50 },
    ];

    const dataEvent = [
        { name: 'Summit', value: 120 },
        { name: 'Hackathon', value: 65 },
        { name: 'Cult Fest', value: 95 },
        { name: 'Sports', value: 40 },
        { name: 'Workshop', value: 25 },
    ];

    const data = view === 'Monthly' ? dataMonthly : dataEvent;

    return (
        <div className="bg-emerald-50 rounded-[1.5rem] p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-emerald-100 flex flex-col h-full w-full relative">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-emerald-950 font-bold text-lg tracking-tight">Revenue Flow</h2>
                    <p className="text-xs text-emerald-800/60 font-medium mt-0.5">Funding breakdown metrics</p>
                </div>
                <div className="relative">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-1.5 text-emerald-800 hover:text-emerald-950 font-semibold text-xs border border-emerald-200/60 rounded-full px-3 py-1.5 hover:bg-emerald-100 transition-colors bg-white/50"
                    >
                        {view} <ChevronDown className="w-3 h-3" />
                    </button>

                    {isOpen && (
                        <div className="absolute right-0 top-full mt-2 w-32 bg-white border border-emerald-100 rounded-xl shadow-lg overflow-hidden z-20">
                            <button
                                onClick={() => { setView('Monthly'); setIsOpen(false); }}
                                className="w-full text-left px-4 py-2 text-xs font-semibold text-emerald-900 hover:bg-emerald-50 transition-colors"
                            >
                                Monthly
                            </button>
                            <button
                                onClick={() => { setView('Per Event'); setIsOpen(false); }}
                                className="w-full text-left px-4 py-2 text-xs font-semibold text-emerald-900 hover:bg-emerald-50 transition-colors"
                            >
                                Per Event
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 w-full min-h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 20, right: 0, left: -25, bottom: 0 }}>
                        <XAxis dataKey="name" stroke="#065f46" opacity={0.5} fontSize={11} tickLine={false} axisLine={false} dy={10} />
                        <YAxis stroke="#065f46" opacity={0.5} fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} />
                        <Tooltip
                            cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }}
                            contentStyle={{ backgroundColor: '#064e3b', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '13px', padding: '8px 12px' }}
                            itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                            formatter={(val) => [`₹${(val * 1000).toLocaleString()}`, 'Revenue']}
                        />
                        <Bar dataKey="value" radius={[4, 4, 4, 4]} barSize={view === 'Monthly' ? 26 : 40}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.name === 'Jul' || entry.name === 'Summit' ? '#064e3b' : '#34d399'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
