"use client";

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ChevronDown } from 'lucide-react';

export function MonthlyExpensesCard() {
    const data = [
        { name: 'F&B', value: 4000, color: '#10b981' },
        { name: 'Education', value: 2000, color: '#3b82f6' },
        { name: 'Marketing', value: 1500, color: '#f43f5e' },
        { name: 'Logistics', value: 1000, color: '#d19d5a' },
    ];

    const total = data.reduce((acc, item) => acc + item.value, 0);

    return (
        <div className="bg-white rounded-[1.5rem] p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-zinc-100 flex flex-col h-full w-full">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-zinc-900 font-bold text-lg tracking-tight">Monthly Expenses</h2>
                    <p className="text-xs text-zinc-500 font-medium mt-0.5">Categorized domains</p>
                </div>
                <button className="flex items-center gap-1.5 text-zinc-600 hover:text-zinc-900 font-semibold text-xs border border-zinc-200 rounded-full px-3 py-1.5 hover:bg-zinc-50 transition-colors">
                    Mar <ChevronDown className="w-3 h-3" />
                </button>
            </div>

            <div className="flex flex-1 items-center justify-between mt-2">
                <div className="relative w-1/2 h-full min-h-[160px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={70}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#161719', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                                itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-1">
                        <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Total</span>
                        <span className="text-zinc-900 font-bold text-lg leading-tight">₹{total}</span>
                    </div>
                </div>

                <div className="flex flex-col gap-3 w-1/2 pl-6">
                    {data.map((item, idx) => {
                        const percentage = Math.round((item.value / total) * 100);
                        return (
                            <div key={idx} className="flex justify-between items-center w-full">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: item.color }}></div>
                                    <span className="text-zinc-600 text-[13px] font-semibold">{item.name}</span>
                                </div>
                                <span className="text-zinc-900 font-bold text-[13px]">{percentage}%</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
