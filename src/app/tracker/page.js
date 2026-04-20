"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function TrackerPage() {
  const [data, setData] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [events, setEvents] = useState([]);
  const [members, setMembers] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [categoryFilter, setCategoryFilter] = useState("All");

  const [showForm, setShowForm] = useState(false);

  const [newEntry, setNewEntry] = useState({
    sponsorid: "",
    contactmode: "Email",
    status: "Cold",
    notes: "",
    eventid: "",
    memberid: "",
    deal_type: "Monetary",
    deal_value: "",
  });

  // Fetch outreach data from the outreach_view
  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:5001/outreach");
      const result = await res.json();

      if (Array.isArray(result)) {
        setData(result);
      } else if (result && result.error) {
        console.error("API returned error:", result.error);
        setData([]);
      } else {
        console.error("Unexpected API response:", result);
        setData([]);
      }
    } catch (err) {
      console.error("Fetch failed:", err);
      setData([]);
    }
  };

  const fetchSponsors = async () => {
    try {
      const res = await fetch("http://localhost:5001/sponsors");
      const result = await res.json();

      if (Array.isArray(result)) {
        setSponsors(result);
      } else {
        setSponsors([]);
      }
    } catch (err) {
      console.error(err);
      setSponsors([]);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch("http://localhost:5001/events");
      const result = await res.json();
      setEvents(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error(err);
      setEvents([]);
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await fetch("http://localhost:5001/teammembers");
      const result = await res.json();
      setMembers(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error(err);
      setMembers([]);
    }
  };

  useEffect(() => {
    fetchData();
    fetchSponsors();
    fetchEvents();
    fetchMembers();
  }, []);

  // ADD
  const addOutreach = async () => {
    console.log("ADD CLICKED", newEntry);
    if (!newEntry.sponsorid) {
      alert("Select sponsor");
      return;
    }

    await fetch("http://localhost:5001/outreach", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEntry),
    });

    setShowForm(false);
    setNewEntry({
      sponsorid: "",
      contactmode: "Email",
      status: "Cold",
      notes: "",
      eventid: "",
      memberid: "",
      deal_type: "Monetary",
      deal_value: "",
    });
    fetchData();
  };

  // UPDATE
  const updateRow = async (id, status, notes) => {
    await fetch("http://localhost:5001/outreach", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ outreachid: id, status, notes }),
    });

    fetchData();
  };

  // DELETE
  const deleteRow = async (id) => {
    await fetch("http://localhost:5001/outreach", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ outreachid: id }),
    });

    fetchData();
  };

  // Filter logic
  const filteredData = data.filter((row) => {
    const searchMatch = row.companyname
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const statusMatch =
      statusFilter === "All" ||
      (row.status && row.status.toLowerCase() === statusFilter.toLowerCase());

    const categoryMatch =
      categoryFilter === "All" || row.categoryname === categoryFilter;

    return searchMatch && statusMatch && categoryMatch;
  });

  return (
    <div className="flex h-screen bg-[#161719]">
      <Sidebar />

      <main className="flex-1 bg-[#f4f4f5] dark:bg-black rounded-l-[2rem] p-6 overflow-y-auto transition-colors">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              Outreach Tracker
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
              Manage and track all sponsor outreach efficiently
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-gradient-to-r from-[#c79c5e] to-[#b5894d] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow hover:scale-[1.03] transition"
            >
              + Add Outreach
            </button>
          </div>
        </div>

        {/* SEARCH + FILTER */}
        <div className="flex gap-3 mb-5 flex-wrap">

          <input
            placeholder="Search company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111] text-zinc-900 dark:text-white placeholder-zinc-400 px-4 py-2 rounded-xl text-sm shadow-sm focus:ring-2 focus:ring-[#c79c5e]/30 outline-none"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111] text-zinc-900 dark:text-white px-4 py-2 rounded-xl text-sm shadow-sm"
          >
            <option>All</option>
            <option>Cold</option>
            <option>Warm</option>
            <option>Replied</option>
            <option>Follow-up Required</option>
            <option>Negotiation</option>
            <option>On Hold</option>
            <option>Closed</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111] text-zinc-900 dark:text-white px-4 py-2 rounded-xl text-sm shadow-sm"
          >
            <option>All</option>
            <option>Banking</option>
            <option>Food & Beverage</option>
            <option>Education</option>
            <option>Fashion</option>
            <option>Media</option>
            <option>Technology</option>
            <option>Travel</option>
            <option>Entertainment</option>
            <option>Beauty & Personal Care</option>
          </select>

        </div>

        {/* FORM */}
        {showForm && (
          <div className="bg-white dark:bg-[#111] p-4 rounded-xl mb-4 flex gap-2 flex-wrap shadow-sm border border-zinc-100 dark:border-zinc-800">

            <select
              onChange={(e) =>
                setNewEntry({ ...newEntry, sponsorid: Number(e.target.value) })
              }
              className="border border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-900 dark:text-white p-2 rounded-lg text-sm"
            >
              <option value="">Select Sponsor</option>
              {sponsors.map((s) => (
                <option key={s.sponsorid} value={s.sponsorid}>
                  {s.companyname}
                </option>
              ))}
            </select>

            <select
              onChange={(e) =>
                setNewEntry({ ...newEntry, memberid: Number(e.target.value) })
              }
              className="border border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-900 dark:text-white p-2 rounded-lg text-sm"
            >
              <option value="">Select Member</option>
              {members.map((m) => (
                <option key={m.memberid} value={m.memberid}>
                  {m.membername}
                </option>
              ))}
            </select>

            <select
              onChange={(e) =>
                setNewEntry({ ...newEntry, eventid: Number(e.target.value) })
              }
              className="border border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-900 dark:text-white p-2 rounded-lg text-sm"
            >
              <option value="">Select Event</option>
              {events.map((ev) => (
                <option key={ev.eventid} value={ev.eventid}>
                  {ev.eventname}
                </option>
              ))}
            </select>

            <select
              onChange={(e) =>
                setNewEntry({ ...newEntry, contactmode: e.target.value })
              }
              className="border border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-900 dark:text-white p-2 rounded-lg text-sm"
            >
              <option>Email</option>
              <option>Call</option>
              <option>LinkedIn</option>
            </select>

            <select
              onChange={(e) =>
                setNewEntry({ ...newEntry, deal_type: e.target.value })
              }
              className="border border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-900 dark:text-white p-2 rounded-lg text-sm"
            >
              <option>Monetary</option>
              <option>In-Kind</option>
            </select>
            
            <input
              placeholder="Deal Value"
              type="number"
              onChange={(e) =>
                setNewEntry({ ...newEntry, deal_value: Number(e.target.value) })
              }
              className="border border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-900 dark:text-white p-2 rounded-lg text-sm w-32"
            />

            <select
              value={newEntry.status}
              onChange={(e) =>
                setNewEntry({ ...newEntry, status: e.target.value })
              }
              className="border border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-900 dark:text-white p-2 rounded-lg text-sm"
            >
              <option>Cold</option>
              <option>Warm</option>
              <option>Replied</option>
              <option>Follow-up Required</option>
              <option>Negotiation</option>
              <option>On Hold</option>
              <option>Closed</option>
            </select>

            <input
              placeholder="Notes"
              value={newEntry.notes}
              onChange={(e) =>
                setNewEntry({ ...newEntry, notes: e.target.value })
              }
              className="border border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-900 dark:text-white placeholder-zinc-400 p-2 rounded-lg text-sm flex-1 min-w-[150px]"
            />

            <button
              onClick={addOutreach}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
            >
              Save
            </button>
          </div>
        )}

        {/* TABLE */}
        <div className="bg-white dark:bg-[#111] rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden">
          <table className="w-full text-sm">

            <thead className="bg-zinc-50 dark:bg-[#161719] border-b dark:border-zinc-800">
              <tr className="text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-wider">
                <th className="p-4 text-left">Company</th>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-left">Contacted By</th>
                <th className="p-4 text-left">Event</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Mode</th>
                <th className="p-4 text-left">Notes</th>
                <th className="p-4 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-zinc-400 dark:text-zinc-600">
                    No outreach records found
                  </td>
                </tr>
              ) : (
                filteredData.map((row) => (
                  <tr key={row.outreachid} className="border-b dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition">

                    <td className="p-4 font-semibold text-zinc-900 dark:text-white">
                      {row.companyname}
                    </td>

                    <td className="p-4">
                      <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 px-3 py-1 rounded-lg text-xs font-semibold">
                        {row.categoryname}
                      </span>
                    </td>

                    <td className="p-4 text-zinc-700 dark:text-zinc-300">
                      {row.membername} {row.councilname ? `(${row.councilname})` : ""}
                    </td>

                    <td className="p-4 text-zinc-600 dark:text-zinc-400">
                      {row.eventname}
                    </td>

                    {/* STATUS BADGE */}
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold
                        ${row.status === "Closed" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                          row.status === "Negotiation" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                          row.status === "Replied" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                          row.status === "Warm" ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" :
                          row.status === "Follow-up Required" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                          row.status === "On Hold" ? "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300" :
                          "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                        {row.status}
                      </span>
                    </td>

                    <td className="p-4 text-zinc-600 dark:text-zinc-400">
                      {row.contactmode}
                    </td>

                    <td className="p-4">
                      <input
                        value={row.notes || ""}
                        onChange={(e) =>
                          updateRow(row.outreachid, row.status, e.target.value)
                        }
                        className="border dark:border-zinc-800 bg-transparent text-zinc-900 dark:text-white px-2 py-1 rounded text-xs w-full"
                      />
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => deleteRow(row.outreachid)}
                        className="text-red-500 text-xs font-semibold hover:underline"
                      >
                        Delete
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>

      </main>
    </div>
  );
}