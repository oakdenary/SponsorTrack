"use client";

import React, { useState, useEffect } from 'react';
import { format, addDays } from 'date-fns';
import { ChevronRight } from 'lucide-react';

export function HorizontalCalendarCard({ events = [] }) {
    const [currentDate] = useState(new Date());
    const [isCompact, setIsCompact] = useState(false);

    useEffect(() => {
        const check = () => setIsCompact(window.innerWidth < 1100);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    const days = Array.from({ length: 7 }).map((_, i) => addDays(currentDate, i - 1));

    return (
        <div className="bg-white dark:bg-[#111] rounded-[1.5rem] p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-zinc-100 dark:border-zinc-800 flex flex-col h-full w-full overflow-hidden transition-colors">
            <div className="flex justify-between items-center mb-3 shrink-0">
                <div>
                    <h2 className="text-zinc-900 dark:text-zinc-100 font-bold text-base tracking-tight">Timeline</h2>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium mt-0.5">{format(currentDate, "MMMM yyyy")} Follow-ups</p>
                </div>
                <button className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors border border-zinc-200 dark:border-zinc-800 rounded-full p-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            {isCompact ? (
                /* Compact mode: just dates in a row with colored dots */
                <div className="flex gap-3 items-center justify-between flex-1 overflow-x-auto px-1">
                    {days.map((day, idx) => {
                        const isToday = idx === 1;
                        const dayEvents = events.filter((event) => {
                            const eventDate = new Date(event.start?.dateTime || event.start?.date);
                            return format(eventDate, "yyyy-MM-dd") === format(day, "yyyy-MM-dd");
                        });
                        const followUp = dayEvents[0];
                        return (
                            <div key={idx} className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0">
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${isToday ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400 dark:text-zinc-600'}`}>
                                    {format(day, 'E').slice(0, 2)}
                                </span>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${isToday ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900' : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}>
                                    {format(day, 'd')}
                                </div>
                                {followUp ? (
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                ) : (
                                    <div className="w-1.5 h-1.5"></div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                /* Full mode: detailed cards */
                <div className="flex gap-3 overflow-x-auto overflow-y-hidden pb-2 pt-1 px-1 -mx-1 snap-x scrollbar-hide flex-1 min-h-0">
                    {days.map((day, idx) => {
                        const isToday = idx === 1;
                        const dayEvents = events.filter((event) => {
                            const eventDate = new Date(event.start?.dateTime || event.start?.date);
                            return format(eventDate, "yyyy-MM-dd") === format(day, "yyyy-MM-dd");
                        });
                        const followUp = dayEvents[0];
                        return (
                            <div
                                key={idx}
                                className={`flex-shrink-0 flex flex-col p-3 w-[140px] rounded-2xl cursor-pointer transition-all snap-start shadow-sm border ${isToday ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100' : 'bg-zinc-50 dark:bg-[#161719] hover:bg-zinc-100 dark:hover:bg-zinc-800 border-zinc-200/60 dark:border-zinc-800'}`}
                            >
                                <div className="flex justify-between items-center mb-3">
                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isToday ? 'text-zinc-400 dark:text-zinc-600' : 'text-zinc-500 dark:text-zinc-400'}`}>
                                        {format(day, 'E')}
                                    </span>
                                    <span className={`text-lg font-bold ${isToday ? 'text-white dark:text-zinc-900' : 'text-zinc-900 dark:text-zinc-100'}`}>
                                        {format(day, 'dd')}
                                    </span>
                                </div>
                                <div className="flex flex-col flex-1 min-h-0">
                                    {followUp ? (
                                        <>
                                            <span className={`text-xs font-bold truncate mb-0.5 ${isToday ? 'text-white dark:text-zinc-900' : 'text-zinc-800 dark:text-zinc-200'}`}>
                                                {followUp.summary}
                                            </span>
                                            <span className={`text-[10px] font-medium truncate mb-0.5 ${isToday ? 'text-zinc-300 dark:text-zinc-600' : 'text-zinc-600 dark:text-zinc-400'}`}>
                                                Google Event
                                            </span>
                                            <span className={`text-[10px] font-semibold mb-2 ${isToday ? 'text-zinc-400 dark:text-zinc-500' : 'text-zinc-500 dark:text-zinc-500'}`}>
                                                {new Date(followUp.start?.dateTime || followUp.start?.date).toLocaleTimeString()}
                                            </span>
                                            <span className="mt-auto px-2 py-0.5 rounded-md text-[9px] uppercase tracking-wide font-bold w-fit bg-blue-100 text-blue-700">
                                                Event
                                            </span>
                                        </>
                                    ) : (
                                        <div className="flex items-center justify-center h-full">
                                            <span className={`text-[11px] font-semibold ${isToday ? 'text-zinc-600' : 'text-zinc-400'}`}>No tasks</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
