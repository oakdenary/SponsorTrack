import React, { useState } from 'react';
import { MessageSquare, Calendar, Quote, Search } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminFeedback({ data }) {
    const feedbackList = data?.feedback || [];
    const [searchTerm, setSearchTerm] = useState('');

    const filteredFeedback = feedbackList.filter(f => 
        (f.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (f.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (f.message || '').toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a,b) => new Date(b.created_at) - new Date(a.created_at));

    return (
        <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <div className="bg-white dark:bg-[#111] rounded-[1.5rem] p-6 shadow-sm border border-zinc-100 dark:border-zinc-800 flex flex-col min-h-[calc(100vh-200px)]">
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-[#c79c5e]" />
                            User Feedback Panel
                        </h2>
                        <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mt-1">Review sentiments and feedback submitted via the platform.</p>
                    </div>

                    <div className="relative w-full sm:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-[#c79c5e] transition-colors" />
                        <input
                            type="text"
                            placeholder="Filter feedback..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-5 py-2.5 rounded-full border border-zinc-200/80 dark:border-zinc-800 outline-none focus:ring-2 focus:ring-[#c79c5e]/20 bg-zinc-50 dark:bg-black shadow-sm text-sm text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 transition-all font-medium"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-max">
                    {filteredFeedback.length > 0 ? filteredFeedback.map((fb, idx) => (
                        <div key={fb.id || idx} className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-6 hover:shadow-md transition-all group flex flex-col h-full relative overflow-hidden">
                            
                            <Quote className="absolute top-4 right-4 w-12 h-12 text-zinc-200 dark:text-zinc-800/50 -rotate-6" />

                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <div>
                                    <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-lg leading-tight">{fb.name}</h3>
                                    <p className="text-sm font-semibold text-[#c79c5e]">{fb.email}</p>
                                </div>
                            </div>
                            
                            <div className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed mb-6 flex-1 relative z-10 whitespace-pre-wrap">
                                {fb.message}
                            </div>
                            
                            <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 pt-4 border-t border-zinc-200 dark:border-zinc-800 mt-auto relative z-10">
                                <Calendar className="w-3.5 h-3.5" />
                                {fb.created_at ? format(new Date(fb.created_at), 'MMM dd, yyyy • hh:mm a') : 'Unknown Date'}
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-full py-20 flex flex-col items-center justify-center text-zinc-400">
                            <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
                            <p className="font-medium text-center max-w-sm">No feedback matching your filters at this time.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
