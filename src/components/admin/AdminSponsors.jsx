import React, { useState } from 'react';
import { Search, Building2, Phone, Mail, MoreHorizontal, Edit, Trash } from 'lucide-react';

export default function AdminSponsors({ data }) {
    const sponsors = data?.sponsors || [];
    const [searchTerm, setSearchTerm] = useState('');

    const filteredSponsors = sponsors.filter(s => 
        (s.companyname || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.contactperson || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <div className="bg-white dark:bg-[#111] rounded-[1.5rem] p-6 shadow-sm border border-zinc-100 dark:border-zinc-800 flex flex-col h-[calc(100vh-200px)]">
                
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Sponsor Directory</h2>
                        <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mt-1">Cross-council complete list</p>
                    </div>
                    
                    <div className="relative w-full sm:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-[#c79c5e] transition-colors" />
                        <input
                            type="text"
                            placeholder="Search sponsors or contacts..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-5 py-2.5 rounded-full border border-zinc-200/80 dark:border-zinc-800 outline-none focus:ring-2 focus:ring-[#c79c5e]/20 bg-zinc-50 dark:bg-black shadow-sm text-sm text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 transition-all font-medium"
                        />
                    </div>
                </div>

                {/* Table Layout */}
                <div className="flex-1 overflow-auto rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50 dark:bg-black/50">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-zinc-100 dark:bg-zinc-900/50 sticky top-0 z-10">
                            <tr>
                                <th className="py-3 px-5 text-xs font-bold text-zinc-500 uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800 rounded-tl-xl w-[30%]">Company</th>
                                <th className="py-3 px-5 text-xs font-bold text-zinc-500 uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800 w-[20%]">Category</th>
                                <th className="py-3 px-5 text-xs font-bold text-zinc-500 uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800 w-[30%]">Contact</th>
                                <th className="py-3 px-5 text-xs font-bold text-zinc-500 uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800 text-right rounded-tr-xl w-[20%]">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSponsors.length > 0 ? filteredSponsors.map((sponsor, idx) => (
                                <tr key={sponsor.sponsorid || idx} className="hover:bg-white dark:hover:bg-[#111] transition-colors border-b border-zinc-100 dark:border-zinc-800/50 last:border-0 group">
                                    <td className="py-4 px-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                                                <Building2 className="w-5 h-5 text-zinc-500" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-zinc-900 dark:text-zinc-100 text-sm leading-tight">{sponsor.companyname}</p>
                                                <p className="text-xs text-zinc-500 font-medium mt-0.5 max-w-[200px] truncate">{sponsor.sponsorcategory?.categoryname || 'Uncategorized'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-5">
                                        <span className="inline-flex items-center rounded-md bg-zinc-200/50 dark:bg-zinc-800 px-2 py-1 text-xs font-bold text-zinc-600 dark:text-zinc-300">
                                            {sponsor.sponsorcategory?.categoryname || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-5">
                                        <div className="flex flex-col gap-1">
                                            <p className="font-bold text-zinc-800 dark:text-zinc-200 text-sm">{sponsor.contactperson || '—'}</p>
                                            <div className="flex items-center gap-3 text-xs text-zinc-500">
                                                {sponsor.phoneno && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{sponsor.phoneno}</span>}
                                                {sponsor.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> <span className="truncate max-w-[120px]">{sponsor.email}</span></span>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-5 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 transition-colors" title="Edit">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 hover:bg-rose-100 dark:hover:bg-rose-900/30 rounded-lg text-rose-500 transition-colors" title="Delete">
                                                <Trash className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="py-12 text-center text-zinc-500 font-medium bg-white dark:bg-[#111]">
                                        No sponsors found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}
