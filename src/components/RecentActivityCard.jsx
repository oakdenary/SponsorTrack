import React from 'react';
import { Phone, Users, Calendar, ArrowUpRight } from 'lucide-react';

export function RecentActivityCard({ events = [] }) {
    const pastEvents = events
      .filter((event) => {
        const d = new Date(event.start?.dateTime || event.start?.date);
        return d < new Date();
      })
      .sort((a, b) => {
        const da = new Date(a.start?.dateTime || a.start?.date);
        const db = new Date(b.start?.dateTime || b.start?.date);
        return db - da; // latest first
      });

    return (
        <div className="bg-white dark:bg-[#111] rounded-[1.5rem] p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-zinc-100 dark:border-zinc-800 flex flex-col h-full w-full transition-colors">
            <div className="flex justify-between items-center mb-5">
                <div>
                    <h2 className="text-zinc-900 dark:text-zinc-100 font-bold text-lg tracking-tight">Recent Activity</h2>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-0.5">Your latest interactions</p>
                </div>
                <button className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors border border-zinc-200 dark:border-zinc-800 rounded-full p-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                    <ArrowUpRight className="w-4 h-4" />
                </button>
            </div>

            <div className="flex flex-col flex-1 overflow-y-auto pr-2 relative">
                <div className="absolute left-[15px] top-4 bottom-4 w-px bg-zinc-100 dark:bg-zinc-800 z-0"></div>
                {pastEvents.slice(0, 8).map((event) => {
                    const date = new Date(event.start?.dateTime || event.start?.date);
                    return (
                        <div key={event.id} className="flex gap-4 items-start py-3 cursor-pointer group relative z-10">
                            <div className="mt-0.5 flex items-center justify-center min-w-7 h-7 rounded-full shadow-sm z-10 transition-transform group-hover:scale-110 bg-zinc-100 ring-4 ring-white dark:ring-[#111]">
                                <Calendar className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
                            </div>
                            <div className="flex flex-col bg-white/50 dark:bg-transparent group-hover:bg-zinc-50 dark:group-hover:bg-zinc-800/50 rounded-xl px-3 py-1.5 -ml-2 transition-colors w-full border border-transparent group-hover:border-zinc-100 dark:group-hover:border-zinc-800/50">
                                <span className="text-zinc-800 dark:text-zinc-200 font-semibold text-sm leading-tight tracking-tight">
                                    {event.summary || "Untitled Event"}
                                </span>
                                <span className="text-zinc-400 dark:text-zinc-500 text-xs mt-0.5 font-medium">
                                    {date.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
