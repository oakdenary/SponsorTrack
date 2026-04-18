"use client";

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ChevronDown } from 'lucide-react';

export function RevenueFlowCard({ revenueFlow }) {
    const [isOpen, setIsOpen] = useState(false);

    // Transform API revenue flow data into monthly format
    const getMonthlyData = () => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlyTotals = {};
        months.forEach(m => { monthlyTotals[m] = 0; });

        if (revenueFlow && revenueFlow.length > 0) {
            revenueFlow.forEach((entry) => {
                const date = new Date(entry.date);
                const monthName = months[date.getMonth()];
                monthlyTotals[monthName] += entry.amount || 0;
            });
        }

        return months.map(m => ({
            name: m,
            value: monthlyTotals[m],
        }));
    };

    const data = getMonthlyData();
    const hasData = data.some(d => d.value > 0);

    // Find the max value bar for highlighting
    const maxValue = Math.max(...data.map(d => d.value));

    return (
        <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-[1.5rem] p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-emerald-100 dark:border-emerald-900/40 flex flex-col h-full w-full relative transition-colors">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-emerald-950 dark:text-emerald-100 font-bold text-lg tracking-tight">Revenue Flow</h2>
                    <p className="text-xs text-emerald-800/60 dark:text-emerald-200/60 font-medium mt-0.5">Funding breakdown metrics</p>
                </div>
                <div className="relative">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-200 hover:text-emerald-950 dark:hover:text-emerald-100 font-semibold text-xs border border-emerald-200/60 dark:border-emerald-700/60 rounded-full px-3 py-1.5 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors bg-white/50 dark:bg-transparent"
                    >
                        Monthly <ChevronDown className="w-3 h-3" />
                    </button>
                </div>
            </div>

            <div className="flex-1 w-full min-h-[220px]">
                {!hasData ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-emerald-800/40 dark:text-emerald-200/40 font-semibold text-sm">No payment data yet</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 20, right: 0, left: -25, bottom: 0 }}>
                            <XAxis dataKey="name" stroke="#065f46" opacity={0.5} fontSize={11} tickLine={false} axisLine={false} dy={10} />
                            <YAxis stroke="#065f46" opacity={0.5} fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val >= 1000 ? `${(val/1000).toFixed(0)}k` : val}`} />
                            <Tooltip
                                cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }}
                                contentStyle={{ backgroundColor: '#064e3b', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '13px', padding: '8px 12px' }}
                                itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                                formatter={(val) => [`₹${val.toLocaleString()}`, 'Revenue']}
                            />
                            <Bar dataKey="value" radius={[4, 4, 4, 4]} barSize={26}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.value === maxValue && entry.value > 0 ? '#064e3b' : '#34d399'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}
