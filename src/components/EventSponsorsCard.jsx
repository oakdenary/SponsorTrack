"use client";

import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ChevronDown } from 'lucide-react';

export function EventSponsorsCard() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState('Tech Summit');
    const [isCompact, setIsCompact] = useState(false);

    useEffect(() => {
        const check = () => setIsCompact(window.innerWidth < 1100);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    const eventData = {
        'Tech Summit': [
            { name: 'F&B', value: 4000, color: '#10b981' },
            { name: 'Education', value: 2000, color: '#3b82f6' },
            { name: 'Marketing', value: 1500, color: '#f43f5e' },
            { name: 'Logistics', value: 1000, color: '#d19d5a' },
        ],
        'Hackathon 2026': [
            { name: 'Prizes', value: 5000, color: '#8b5cf6' },
            { name: 'F&B', value: 3000, color: '#10b981' },
            { name: 'Swag', value: 1500, color: '#f43f5e' },
        ],
        'Cultural Fest': [
            { name: 'Stage', value: 6000, color: '#d19d5a' },
            { name: 'Marketing', value: 2000, color: '#3b82f6' },
        ]
    };

    const data = eventData[selectedEvent];
    const total = data.reduce((acc, item) => acc + item.value, 0);

    return (
        <div className="bg-white rounded-[1.5rem] p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-zinc-100 flex flex-col h-full w-full relative overflow-hidden">
            <div className="flex justify-between items-center mb-3 shrink-0">
                <div className="min-w-0">
                    <h2 className="text-zinc-900 font-bold text-base tracking-tight truncate">Event Sponsors</h2>
                    <p className="text-[11px] text-zinc-500 font-medium mt-0.5">Categorized domains</p>
                </div>
                <div className="relative shrink-0 ml-2">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-1 text-zinc-600 hover:text-zinc-900 font-semibold text-[11px] border border-zinc-200 rounded-full px-2.5 py-1 hover:bg-zinc-50 transition-colors"
                    >
                        <span className="truncate max-w-[70px]">{selectedEvent}</span>
                        <ChevronDown className="w-3 h-3 shrink-0" />
                    </button>

                    {isOpen && (
                        <div className="absolute right-0 top-full mt-2 w-36 bg-white border border-zinc-100 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] overflow-hidden z-30">
                            {Object.keys(eventData).map(evt => (
                                <button
                                    key={evt}
                                    onClick={() => { setSelectedEvent(evt); setIsOpen(false); }}
                                    className="w-full text-left px-3 py-2 text-[11px] font-semibold text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
                                >
                                    {evt}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {isCompact ? (
                /* Compact mode: no pie chart, just a clean colored list */
                <div className="flex flex-col gap-2 flex-1 justify-center overflow-y-auto">
                    <div className="text-center mb-2">
                        <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">Total</span>
                        <span className="text-zinc-900 font-bold text-lg ml-2">₹{total.toLocaleString()}</span>
                    </div>
                    {data.map((item, idx) => {
                        const pct = Math.round((item.value / total) * 100);
                        return (
                            <div key={idx} className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-zinc-50">
                                <div className="flex items-center gap-2 min-w-0">
                                    <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: item.color }}></div>
                                    <span className="text-zinc-700 text-xs font-semibold truncate">{item.name}</span>
                                </div>
                                <span className="text-zinc-900 font-bold text-xs shrink-0 ml-2">{pct}%</span>
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
                                    formatter={(val) => `₹${val.toLocaleString()}`}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-zinc-500 text-[9px] font-bold uppercase tracking-wider">Total</span>
                            <span className="text-zinc-900 font-bold text-base leading-tight">₹{total.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2.5 w-1/2 pl-4 overflow-y-auto">
                        {data.map((item, idx) => {
                            const percentage = Math.round((item.value / total) * 100);
                            return (
                                <div key={idx} className="flex justify-between items-center w-full">
                                    <div className="flex items-center gap-1.5 min-w-0">
                                        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }}></div>
                                        <span className="text-zinc-600 text-xs font-semibold truncate">{item.name}</span>
                                    </div>
                                    <span className="text-zinc-900 font-bold text-xs shrink-0 ml-1">{percentage}%</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
