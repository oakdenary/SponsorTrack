"use client";

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function MetricsCard() {
    const data = [
        { name: 'Jan', funds: 4000 },
        { name: 'Feb', funds: 3000 },
        { name: 'Mar', funds: 5000 },
        { name: 'Apr', funds: 4500 },
        { name: 'May', funds: 6000 },
        { name: 'Jun', funds: 8000 },
    ];

    return (
        <div className="bg-white rounded-[1.5rem] p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-zinc-100 flex flex-col h-full w-full">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-zinc-900 font-bold text-lg tracking-tight">Funds Raised</h2>
                    <p className="text-xs text-zinc-500 font-medium mt-0.5">Last 6 Months metrics</p>
                </div>
                <button className="text-zinc-400 hover:text-zinc-900 transition-colors border border-zinc-200 rounded-full p-1.5 hover:bg-zinc-50">
                    <ArrowUpRight className="w-4 h-4" />
                </button>
            </div>

            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
                        <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                        <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value / 1000}k`} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#161719', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '13px', padding: '8px 12px' }}
                            itemStyle={{ color: '#d19d5a', fontWeight: 'bold' }}
                            cursor={{ stroke: '#f4f4f5', strokeWidth: 2 }}
                        />
                        <Line type="monotone" dataKey="funds" stroke="#c79c5e" strokeWidth={3} dot={{ r: 4, fill: '#fff', stroke: '#c79c5e', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#c79c5e', stroke: '#fff', strokeWidth: 2 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
