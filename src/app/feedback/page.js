"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import Silk from "@/components/Silk"

export default function FeedbackPage() {
    
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState("idle");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim() || !email.trim() || !message.trim()) return;

        setStatus("submitting");
        // Simulate API call
        setTimeout(() => {
            setStatus("success");
            setName("");
            setEmail("");
            setMessage("");

            // Reset success message after 5 seconds
            setTimeout(() => setStatus("idle"), 5000);
        }, 800);
    };

    return (
        <div className="flex h-screen w-full bg-[#161719] overflow-hidden font-sans">
            <Silk className="rounded-tl-[2rem] rounded-bl-[2rem]"
          speed={5}
          scale={1}
          color="#C69B56"
          noiseIntensity={1.5}
          rotation={0}
        />
            <Sidebar />
            <main className="flex-1 bg-[#f4f4f5] rounded-tl-[2rem] rounded-bl-[2rem] p-8 md:px-10 flex flex-col h-screen shadow-2xl border-l border-white/5 overflow-y-auto w-full">
            
                <div className="flex flex-col items-center justify-center h-full w-full max-w-7xl mx-auto">
                    
                    <div className="bg-white rounded-[2rem] p-10 md:p-14 w-full max-w-xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] border border-zinc-100 relative overflow-hidden">
                        {/* Decorative Background Accent */}
                        <div className="absolute top-0 left-0 right-0 h-2 bg-[#d19d5a]"></div>

                        <div className="text-center mb-10">
                            <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Contact / Feedback</h1>
                            <p className="text-zinc-500 font-medium mt-3 text-[15px] leading-relaxed max-w-sm mx-auto">
                                We'd love to hear your feedback to improve SponsorTrack. Share your thoughts or issues below.
                            </p>
                        </div>

                        {status === "success" ? (
                            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 text-center animate-in fade-in zoom-in duration-300">
                                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                                <h3 className="text-emerald-900 font-bold text-lg mb-1">Message Sent!</h3>
                                <p className="text-emerald-700/80 text-sm font-medium">Thank you for your feedback. Our team will review it shortly.</p>
                                <button
                                    onClick={() => setStatus("idle")}
                                    className="mt-6 text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="name" className="text-xs font-bold text-zinc-800 uppercase tracking-wide">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Jane Doe"
                                        className="w-full border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#c79c5e]/30 focus:border-[#c79c5e] bg-zinc-50/50 hover:bg-zinc-50 transition-all font-medium text-[15px] text-zinc-900 placeholder:text-zinc-400"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label htmlFor="email" className="text-xs font-bold text-zinc-800 uppercase tracking-wide">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="jane@example.com"
                                        className="w-full border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#c79c5e]/30 focus:border-[#c79c5e] bg-zinc-50/50 hover:bg-zinc-50 transition-all font-medium text-[15px] text-zinc-900 placeholder:text-zinc-400"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label htmlFor="message" className="text-xs font-bold text-zinc-800 uppercase tracking-wide">Message</label>
                                    <textarea
                                        id="message"
                                        required
                                        rows={4}
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="How can we help you today?"
                                        className="w-full border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#c79c5e]/30 focus:border-[#c79c5e] bg-zinc-50/50 hover:bg-zinc-50 transition-all font-medium text-[15px] text-zinc-900 placeholder:text-zinc-400 resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={status === "submitting"}
                                    className="w-full bg-[#161719] hover:bg-black text-white font-bold rounded-xl py-3.5 mt-2 shadow-[0_4px_14px_0_rgba(0,0,0,0.15)] transition-all text-[15px] disabled:opacity-70 flex items-center justify-center gap-2"
                                >
                                    {status === "submitting" ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                            Submitting...
                                        </>
                                    ) : (
                                        "Submit Feedback"
                                    )}
                                </button>
                            </form>
                        )}

                    </div>
                </div>
            </main>
        </div>
    );
}
