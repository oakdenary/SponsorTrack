"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Search, ChevronDown } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const categories = [
    "All",
    "Banking",
    "Food & Beverage",
    "Education",
    "Fashion",
    "Media",
    "Technology",
    "Travel",
    "Entertainment",
    "Beauty & Personal Care",
  ];

  useEffect(() => {
    async function fetchSponsors() {
      try {
        const res = await fetch("/api/sponsors");
        const data = await res.json();
        setSponsors(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setSponsors([]);
      }
    }
    fetchSponsors();
  }, []);

  const filteredSponsors = sponsors.filter((s) => {
    const matchesSearch = s.companyname
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || s.categoryname === filter;

    return matchesSearch && matchesFilter;
  });

  const getCategoryStyle = (category) => {
    switch (category) {
      case "Banking":
        return "bg-blue-100 text-blue-700";
      case "Food & Beverage":
        return "bg-green-100 text-green-700";
      case "Fashion":
        return "bg-pink-100 text-pink-700";
      case "Technology":
        return "bg-purple-100 text-purple-700";
      case "Media":
        return "bg-yellow-100 text-yellow-700";
      case "Education":
        return "bg-indigo-100 text-indigo-700";
      case "Travel":
        return "bg-cyan-100 text-cyan-700";
      case "Entertainment":
        return "bg-orange-100 text-orange-700";
      case "Beauty & Personal Care":
        return "bg-rose-100 text-rose-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#161719]">
      <Sidebar />

      <main className="flex-1 bg-[#f4f4f5] dark:bg-black rounded-tl-[2rem] rounded-bl-[2rem] p-8 overflow-y-auto transition-colors">
        <div className="max-w-6xl mx-auto flex flex-col">

          {/* HEADER */}
          <div className="mb-6 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
                Sponsor Catalogue
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400">
                Manage and explore all sponsors
              </p>
            </div>
            <ThemeToggle />
          </div>

          {/* SEARCH + FILTER */}
          <div className="flex gap-4 mb-5">

            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-zinc-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search sponsors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111] shadow-sm focus:ring-2 focus:ring-[#c79c5e]/20 outline-none text-zinc-900 dark:text-white placeholder-zinc-400"
              />
            </div>

            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm text-zinc-900 dark:text-white font-medium min-w-[200px] justify-between"
              >
                <span>{filter}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg z-50">

                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setFilter(c);
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
                    >
                      {c}
                    </button>
                  ))}

                </div>
              )}
            </div>

          </div>

          {/* COUNT */}
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">
            {filteredSponsors.length} sponsors found
          </p>

          {/* TABLE */}
          <div className="bg-white dark:bg-[#111] rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">

            <table className="w-full text-sm">

              <thead className="bg-gray-50 dark:bg-[#161719] text-gray-600 dark:text-gray-400 uppercase text-xs border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="px-6 py-4 text-left">Company</th>
                  <th className="px-6 py-4 text-left">Category</th>
                  <th className="px-6 py-4 text-left">Contact Person</th>
                  <th className="px-6 py-4 text-left">Designation</th>
                  <th className="px-6 py-4 text-left">Phone</th>
                  <th className="px-6 py-4 text-left">Email</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">

                {filteredSponsors.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-gray-400 dark:text-zinc-600">
                      No sponsors found 
                    </td>
                  </tr>
                ) : (
                  filteredSponsors.map((row) => (
                    <tr key={row.sponsorid} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 text-zinc-800 dark:text-zinc-200">

                      <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-white">
                        {row.companyname}
                      </td>

                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs rounded-full ${getCategoryStyle(row.categoryname)}`}>
                          {row.categoryname}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        {row.contactperson}
                      </td>

                      <td className="px-6 py-4">
                        {row.designation}
                      </td>

                      <td className="px-6 py-4">
                        {row.phoneno}
                      </td>

                      <td className="px-6 py-4 text-blue-600">
                        {row.email}
                      </td>

                    </tr>
                  ))
                )}

              </tbody>
            </table>

          </div>

        </div>
      </main>
    </div>
  );
}
