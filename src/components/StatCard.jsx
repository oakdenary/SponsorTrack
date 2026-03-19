import React from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

export function StatCard({ title, amount, trend, trendValue }) {
    const isPositive = trend === 'up';

    return (
        <div className="bg-white rounded-[1.25rem] p-4 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-zinc-100 flex flex-col justify-between w-full min-h-0">
            <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                </div>
                <span className="text-zinc-500 font-semibold text-xs truncate">{title}</span>
            </div>

            <div>
                <h3 className="text-zinc-900 font-bold text-2xl tracking-tight mb-1">₹{amount}</h3>
                <div className="flex items-center gap-1.5">
                    {isPositive ? (
                        <div className="flex items-center text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px] font-bold">
                            <ArrowUpRight className="w-3 h-3 mr-0.5" />
                            {trendValue}
                        </div>
                    ) : (
                        <div className="flex items-center text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded text-[10px] font-bold">
                            <ArrowDownRight className="w-3 h-3 mr-0.5" />
                            {trendValue}
                        </div>
                    )}
                    <span className="text-zinc-400 text-[10px] font-medium">from last month</span>
                </div>
            </div>
        </div>
    );
}
