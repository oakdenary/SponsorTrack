"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Search, ChevronDown } from "lucide-react";

const sponsorData = [
    { id: 'SP-001', company: 'TechNova', industry: 'Technology', contact: 'Alice Smith', phone: '+91 98765 43210', email: 'alice@technova.com' },
    { id: 'SP-002', company: 'Global Finance Corp', industry: 'Finance', contact: 'Bob Johnson', phone: '+91 87654 32109', email: 'bob@gfc.com' },
    { id: 'SP-003', company: 'FreshBites', industry: 'Food & Beverage', contact: 'Carol Williams', phone: '+91 76543 21098', email: 'carol@freshbites.com' },
    { id: 'SP-004', company: 'CineStream', industry: 'Media', contact: 'David Brown', phone: '+91 65432 10987', email: 'david@cinestream.com' },
    { id: 'SP-005', company: 'Apex Retail', industry: 'Retail', contact: 'Eve Davis', phone: '+91 54321 09876', email: 'eve@apexretail.in' },
    { id: 'SP-006', company: 'HealthPlus', industry: 'Healthcare', contact: 'Frank Miller', phone: '+91 43210 98765', email: 'frank@healthplus.org' },
    { id: 'SP-007', company: 'CodeWorks', industry: 'Technology', contact: 'Grace Wilson', phone: '+91 99887 76655', email: 'grace@codeworks.dev' },
    { id: 'SP-008', company: 'TrustBank', industry: 'Finance', contact: 'Henry Moore', phone: '+91 88776 65544', email: 'henry@trustbank.co.in' },
    { id: 'SP-009', company: 'Tasty Treats', industry: 'Food & Beverage', contact: 'Ivy Taylor', phone: '+91 77665 54433', email: 'ivy@tastytreats.com' },
    { id: 'SP-010', company: 'NewsNet', industry: 'Media', contact: 'Jack Anderson', phone: '+91 66554 43322', email: 'jack@newsnet.media' },
    { id: 'SP-011', company: 'MegaMart', industry: 'Retail', contact: 'Karen Thomas', phone: '+91 55443 32211', email: 'karen@megamart.com' },
    { id: 'SP-012', company: 'CareLife', industry: 'Healthcare', contact: 'Leo Jackson', phone: '+91 44332 21100', email: 'leo@carelife.com' },
    { id: 'SP-013', company: 'CloudSystems', industry: 'Technology', contact: 'Mia White', phone: '+91 91234 56789', email: 'mia@cloudsys.com' },
    { id: 'SP-014', company: 'WealthCap', industry: 'Finance', contact: 'Noah Harris', phone: '+91 82345 67890', email: 'noah@wealthcap.in' },
    { id: 'SP-015', company: 'Sip & Bite', industry: 'Food & Beverage', contact: 'Olivia Martin', phone: '+91 73456 78901', email: 'olivia@sipbite.com' },
    { id: 'SP-016', company: 'Visionary TV', industry: 'Media', contact: 'Paul Thompson', phone: '+91 64567 89012', email: 'paul@visionary.tv' },
    { id: 'SP-017', company: 'StyleStore', industry: 'Retail', contact: 'Quinn Garcia', phone: '+91 55678 90123', email: 'quinn@stylestore.com' },
    { id: 'SP-018', company: 'Wellness First', industry: 'Healthcare', contact: 'Ryan Martinez', phone: '+91 46789 01234', email: 'ryan@wellnessfirst.org' },
    { id: 'SP-019', company: 'InnovaTech', industry: 'Technology', contact: 'Sophia Robinson', phone: '+91 97890 12345', email: 'sophia@innovatech.com' },
    { id: 'SP-020', company: 'SecureInvest', industry: 'Finance', contact: 'Tom Clark', phone: '+91 88901 23456', email: 'tom@secureinvest.com' }
];

export default function SponsorsPage() {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const categories = ['All', 'Technology', 'Finance', 'Retail', 'Food & Beverage', 'Media', 'Healthcare'];

    const filtered = sponsorData.filter((s) => {
        const matchesSearch = s.company.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'All' || s.industry === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="flex h-screen w-full bg-[#161719] overflow-hidden font-sans">
            <Sidebar />

            <main className="flex-1 bg-[#f4f4f5] rounded-tl-[2rem] rounded-bl-[2rem] p-6 md:px-8 flex flex-col h-screen overflow-hidden shadow-2xl border-l border-white/5">
                <div className="max-w-5xl w-full mx-auto flex flex-col h-full">

                    {/* Header - Fixed */}
                    <div className="shrink-0 mb-8 pt-4">
                        <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Sponsor Catalogue</h1>
                        <p className="text-zinc-500 font-medium mt-1.5 text-[15px]">Browse all available sponsors</p>
                    </div>

                    {/* Search + Filter Bar - Fixed */}
                    <div className="flex items-center gap-4 mb-4 shrink-0 flex-wrap z-20">
                        <div className="relative flex-1 min-w-[200px]">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <input
                                type="text"
                                placeholder="Search by sponsor name..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-11 pr-5 py-3 rounded-xl border border-zinc-200/80 outline-none focus:ring-2 focus:ring-[#c79c5e]/20 focus:border-[#c79c5e] bg-white shadow-sm text-sm text-zinc-800 placeholder-zinc-400 transition-all font-medium"
                            />
                        </div>

                        {/* Category Filter Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-zinc-200/80 shadow-sm text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors min-w-[180px] justify-between"
                            >
                                {filter}
                                <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {dropdownOpen && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-zinc-100 rounded-xl shadow-[0_8px_30px_-8px_rgba(0,0,0,0.12)] overflow-hidden z-30">
                                    {categories.map((c) => (
                                        <button
                                            key={c}
                                            onClick={() => { setFilter(c); setDropdownOpen(false); }}
                                            className={`w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors ${filter === c ? 'bg-zinc-50 text-zinc-900' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}`}
                                        >
                                            {c}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Results Count - Fixed */}
                    <p className="text-xs text-zinc-400 font-semibold mb-3 shrink-0 uppercase tracking-wider relative z-10">
                        {filtered.length} sponsor{filtered.length !== 1 ? 's' : ''} found
                    </p>

                    {/* Table Container - Scrollable internal area */}
                    <div className="flex-1 min-h-0 bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden flex flex-col mb-4">
                        <div className="overflow-auto flex-1 h-full scrollbar-thin scrollbar-thumb-zinc-200 scrollbar-track-transparent">
                            <table className="w-full text-left min-w-[800px] relative">
                                <thead className="sticky top-0 z-10">
                                    <tr className="border-b border-zinc-100 bg-zinc-50 shadow-sm">
                                        <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-zinc-500 whitespace-nowrap">Sponsor ID</th>
                                        <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-zinc-500 whitespace-nowrap">Company Name</th>
                                        <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-zinc-500 whitespace-nowrap">Industry</th>
                                        <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-zinc-500 whitespace-nowrap">Contact Person</th>
                                        <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-zinc-500 whitespace-nowrap">Phone Number</th>
                                        <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-zinc-500 whitespace-nowrap">Email ID</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.length > 0 ? (
                                        filtered.map((sponsor, idx) => (
                                            <tr
                                                key={idx}
                                                className="border-b border-zinc-50 last:border-b-0 hover:bg-zinc-50/80 transition-colors cursor-pointer group"
                                            >
                                                <td className="px-6 py-4">
                                                    <span className="text-zinc-500 font-semibold text-[13px] whitespace-nowrap">{sponsor.id}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-zinc-900 font-bold text-[14px] group-hover:text-[#c79c5e] transition-colors whitespace-nowrap">{sponsor.company}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-block px-3 py-1 rounded-lg text-[11px] font-bold tracking-wide border bg-zinc-100 border-zinc-200 text-zinc-600 whitespace-nowrap">
                                                        {sponsor.industry}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-zinc-800 font-medium text-[13px] whitespace-nowrap">{sponsor.contact}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-zinc-600 font-medium text-[13px] whitespace-nowrap">{sponsor.phone}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-zinc-600 font-medium text-[13px] whitespace-nowrap">{sponsor.email}</span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center h-full">
                                                <p className="text-zinc-400 font-semibold text-sm">No sponsors match your search criteria.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
