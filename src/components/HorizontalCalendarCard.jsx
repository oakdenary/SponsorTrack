import React from 'react';
import { format, addDays } from 'date-fns';
import { ChevronRight } from 'lucide-react';

export function HorizontalCalendarCard() {
    const [currentDate] = React.useState(new Date());

    const days = Array.from({ length: 7 }).map((_, i) => addDays(currentDate, i - 1));

    const dummyFollowUps = [
        { sponsor: 'Acme Corp', status: 'Negotiation', color: 'bg-blue-100 text-blue-700' },
        null,
        { sponsor: 'Stark Ind.', status: 'Contacted', color: 'bg-yellow-100 text-yellow-700' },
        null,
        { sponsor: 'Wayne Ent.', status: 'Closed', color: 'bg-emerald-100 text-emerald-700' },
        null,
        { sponsor: 'Global Co.', status: 'Cold', color: 'bg-gray-100 text-gray-700' },
    ];

    return (
        <div className="bg-white rounded-[1.5rem] p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-zinc-100 flex flex-col h-full w-full justify-between">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-zinc-900 font-bold text-lg tracking-tight">Timeline</h2>
                    <p className="text-xs text-zinc-500 font-medium mt-0.5">{format(currentDate, "MMMM yyyy")} Follow-ups</p>
                </div>
                <button className="text-zinc-600 hover:text-zinc-900 transition-colors border border-zinc-200 rounded-full p-1.5 hover:bg-zinc-50">
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            {/* Horizontal Scrollable Area */}
            <div className="flex gap-4 overflow-x-auto overflow-y-hidden pb-3 pt-1 px-1 -mx-1 snap-x scrollbar-hide flex-1">
                {days.map((day, idx) => {
                    const isToday = idx === 1;
                    const followUp = dummyFollowUps[idx];

                    return (
                        <div
                            key={idx}
                            className={`flex-shrink-0 flex flex-col p-4 w-[160px] rounded-2xl cursor-pointer transition-all snap-start shadow-sm border ${isToday ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-zinc-50 hover:bg-zinc-100 border-zinc-200/60'}`}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <span className={`text-xs font-bold uppercase tracking-wider ${isToday ? 'text-zinc-400' : 'text-zinc-500'}`}>
                                    {format(day, 'E')}
                                </span>
                                <span className={`text-xl font-bold ${isToday ? 'text-white' : 'text-zinc-900'}`}>
                                    {format(day, 'dd')}
                                </span>
                            </div>

                            <div className="flex flex-col flex-1 pb-1">
                                {followUp ? (
                                    <>
                                        <span className={`text-sm font-bold truncate mb-1 ${isToday ? 'text-white' : 'text-zinc-800'}`}>
                                            {followUp.sponsor}
                                        </span>
                                        <span className={`text-[11px] font-semibold mb-3 ${isToday ? 'text-zinc-400' : 'text-zinc-500'}`}>
                                            Due: {format(day, 'MMM dd')}, 2pm
                                        </span>
                                        <span className={`mt-auto px-2 py-1 rounded-md text-[10px] uppercase tracking-wide font-bold w-fit ${followUp.color}`}>
                                            {followUp.status}
                                        </span>
                                    </>
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <span className={`text-xs font-semibold ${isToday ? 'text-zinc-600' : 'text-zinc-400'}`}>No tasks</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
