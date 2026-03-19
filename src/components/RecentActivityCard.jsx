import React from 'react';
import { Phone, Users, Calendar, ArrowUpRight } from 'lucide-react';

export function RecentActivityCard() {
    const activities = [
        {
            id: 1,
            type: 'contact',
            title: 'Contacted Google Sponsor Rep',
            time: '2 hours ago',
            icon: <Phone className="w-3.5 h-3.5 text-blue-600" />,
            color: 'bg-blue-100 ring-4 ring-white'
        },
        {
            id: 2,
            type: 'meeting',
            title: 'Meeting with AWS Team',
            time: '5 hours ago',
            icon: <Users className="w-3.5 h-3.5 text-emerald-600" />,
            color: 'bg-emerald-100 ring-4 ring-white'
        },
        {
            id: 3,
            type: 'event',
            title: 'Tech Summit Planning',
            time: '1 day ago',
            icon: <Calendar className="w-3.5 h-3.5 text-rose-600" />,
            color: 'bg-rose-100 ring-4 ring-white'
        },
        {
            id: 4,
            type: 'contact',
            title: 'Emailed Microsoft Rep',
            time: '2 days ago',
            icon: <Phone className="w-3.5 h-3.5 text-blue-600" />,
            color: 'bg-blue-100 ring-4 ring-white'
        },
        {
            id: 5,
            type: 'meeting',
            title: 'Follow-up with OpenAI',
            time: '2 days ago',
            icon: <Users className="w-3.5 h-3.5 text-emerald-600" />,
            color: 'bg-emerald-100 ring-4 ring-white'
        }
    ];

    return (
        <div className="bg-white rounded-[1.5rem] p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-zinc-100 flex flex-col h-full w-full">
            <div className="flex justify-between items-center mb-5">
                <div>
                    <h2 className="text-zinc-900 font-bold text-lg tracking-tight">Recent Activity</h2>
                    <p className="text-xs text-zinc-500 font-medium mt-0.5">Your latest interactions</p>
                </div>
                <button className="text-zinc-400 hover:text-zinc-900 transition-colors border border-zinc-200 rounded-full p-1.5 hover:bg-zinc-50">
                    <ArrowUpRight className="w-4 h-4" />
                </button>
            </div>

            <div className="flex flex-col flex-1 overflow-y-auto pr-2 relative">
                <div className="absolute left-[15px] top-4 bottom-4 w-px bg-zinc-100 z-0"></div>
                {activities.map((activity) => (
                    <div key={activity.id} className="flex gap-4 items-start py-3 cursor-pointer group relative z-10">
                        <div className={`mt-0.5 flex items-center justify-center min-w-7 h-7 rounded-full shadow-sm z-10 transition-transform group-hover:scale-110 ${activity.color}`}>
                            {activity.icon}
                        </div>
                        <div className="flex flex-col bg-white/50 group-hover:bg-zinc-50 rounded-xl px-3 py-1.5 -ml-2 transition-colors w-full border border-transparent group-hover:border-zinc-100">
                            <span className="text-zinc-800 font-semibold text-sm leading-tight tracking-tight">{activity.title}</span>
                            <span className="text-zinc-400 text-xs mt-0.5 font-medium">{activity.time}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
