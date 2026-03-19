"use client";

import Link from "next/link";
import React, { useState } from 'react';
import Silk from "@/components/Silk"
import { motion, AnimatePresence } from "framer-motion";

// Inline SVGs for social buttons
const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

const AppleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.32 10.51c-.02-2.58 2.08-3.83 2.18-3.88-1.2-1.74-3.04-1.98-3.71-2.01-1.57-.16-3.07.93-3.88.93-.8 0-2.03-.92-3.32-.89-1.68.02-3.23.97-4.1 2.49-1.76 3.06-.45 7.57 1.25 10.05.85 1.22 1.85 2.58 3.16 2.54 1.25-.05 1.73-.81 3.25-.81 1.5 0 1.94.81 3.27.79 1.35-.02 2.21-1.25 3.04-2.47 1-1.45 1.4-2.85 1.43-2.92-.03-.01-2.54-.98-2.57-3.82zm-2.09-6.31c.69-.85 1.15-2.02 1.02-3.2-.99.04-2.22.67-2.93 1.52-.56.67-1.11 1.86-.96 3 1.1.08 2.18-.46 2.87-1.32z" />
    </svg>
);

export default function LoginPage() {
    const [mode, setMode] = useState("login"); // "login" | "signup"
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");

    // Supabase Placeholder Triggers
    const handleGoogleLogin = () => {
        console.log("Supabase OAuth: Google");
        // supabase.auth.signInWithOAuth({ provider: "google" })
    };

    const handleAppleLogin = () => {
        console.log("Supabase OAuth: Apple");
        // supabase.auth.signInWithOAuth({ provider: "apple" })
    };

    const handleMagicLink = (e) => {
        e.preventDefault();
        console.log("Supabase OTP Signup:", { email, username });
        /* 
        supabase.auth.signInWithOtp({
            email,
            options: { data: { username } }
        }) 
        */
    };

    const loginVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
        exit: { opacity: 0, x: 20, transition: { duration: 0.2, ease: "easeIn" } }
    };

    return (
        <div className="flex h-screen w-full overflow-hidden font-sans bg-[#161719]">
            <div className="absolute inset-0 z-0 pointer-events-none">
                <Silk
                    speed={5}
                    scale={1}
                    color="#C69B56"
                    noiseIntensity={1.5}
                    rotation={0}
                />
            </div>

            {/* Left Pane - Login Card centered */}
            <div className="flex-1 flex items-center justify-center p-6 relative z-10 w-full h-full">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="bg-white rounded-3xl p-8 sm:p-10 w-full max-w-sm shadow-2xl relative overflow-hidden"
                    style={{ minHeight: '480px' }}
                >
                    <AnimatePresence mode="wait">
                        {mode === "login" ? (
                            <motion.div
                                key="login-view"
                                variants={loginVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="flex flex-col h-full"
                            >
                                <div className="text-center mb-8">
                                    <h1 className="text-xl font-bold text-zinc-900">Sign in to SponsorTrack</h1>
                                    <p className="text-sm text-zinc-500 mt-1.5">Welcome back! Please sign in to continue</p>
                                </div>

                                <div className="flex flex-col gap-3 mb-6">
                                    <button onClick={handleGoogleLogin} type="button" className="flex items-center justify-center gap-3 w-full border border-zinc-200 rounded-xl py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors">
                                        <GoogleIcon />
                                        Continue with Google
                                    </button>
                                    <button onClick={handleAppleLogin} type="button" className="flex items-center justify-center gap-3 w-full border border-zinc-200 rounded-xl py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors">
                                        <AppleIcon />
                                        Continue with Apple
                                    </button>
                                </div>

                                <div className="flex items-center gap-4 mb-6">
                                    <div className="flex-1 border-t border-zinc-200"></div>
                                    <span className="text-xs text-zinc-400 font-medium tracking-wide disabled">or</span>
                                    <div className="flex-1 border-t border-zinc-200"></div>
                                </div>

                                <form className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="login-email" className="text-xs font-bold text-zinc-900">Email Address</label>
                                        <input
                                            type="email"
                                            id="login-email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#c79c5e]/30 focus:border-[#c79c5e] text-sm text-zinc-900 transition-all font-medium"
                                        />
                                    </div>

                                    <Link href="/dashboard" className="w-full">
                                        <button type="button" className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-xl py-3 mt-2 shadow-[0_4px_14px_0_rgba(0,0,0,0.15)] transition-all text-sm">
                                            Continue
                                        </button>
                                    </Link>
                                </form>

                                <p className="text-xs text-center text-zinc-500 font-medium mt-auto pt-6">
                                    Don't have an account? <button type="button" onClick={() => setMode("signup")} className="font-bold text-zinc-900 hover:underline">Sign up</button>
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="signup-view"
                                variants={loginVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="flex flex-col h-full"
                            >
                                <div className="text-center mb-8">
                                    <h1 className="text-xl font-bold text-zinc-900">Create your account</h1>
                                    <p className="text-sm text-zinc-500 mt-1.5">Enter your email to get a secure login link</p>
                                </div>

                                <form onSubmit={handleMagicLink} className="flex flex-col gap-5 h-full pt-1">
                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="signup-username" className="text-xs font-bold text-zinc-900">Username</label>
                                        <input
                                            type="text"
                                            id="signup-username"
                                            required
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#c79c5e]/30 focus:border-[#c79c5e] text-sm text-zinc-900 transition-all font-medium placeholder:text-zinc-300"
                                            placeholder="Your name or organization"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="signup-email" className="text-xs font-bold text-zinc-900">Email Address</label>
                                        <input
                                            type="email"
                                            id="signup-email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#c79c5e]/30 focus:border-[#c79c5e] text-sm text-zinc-900 transition-all font-medium placeholder:text-zinc-300"
                                            placeholder="jane@example.com"
                                        />
                                    </div>

                                    <div className="mt-auto pt-6 flex flex-col items-center">
                                        <button type="submit" className="w-full bg-[#c79c5e] hover:bg-[#b58c53] text-white font-bold rounded-xl py-3 shadow-[0_4px_14px_0_rgba(199,156,94,0.3)] transition-all text-sm mb-4">
                                            Send Magic Link
                                        </button>

                                        <p className="text-[11px] text-center text-zinc-500 font-medium leading-relaxed px-2 mb-6">
                                            We'll email you a secure link to sign up and log in instantly.
                                        </p>

                                        <p className="text-xs text-center text-zinc-500 font-medium">
                                            Already have an account? <button type="button" onClick={() => setMode("login")} className="font-bold text-zinc-900 hover:underline">Sign in</button>
                                        </p>
                                    </div>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Right Pane - Grey Branding Content */}
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex-1 bg-[#E8E8E8] rounded-tl-[3rem] rounded-bl-[3rem] p-12 lg:p-20 relative flex flex-col justify-between hidden md:flex z-20 shadow-[-10px_0_30px_rgba(0,0,0,0.1)]"
            >
                {/* LOGO SPACE */}
                <div className="flex justify-center mb-12">
                    <div className="bg-zinc-900 text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full w-fit mb-12">
                        LOGO SPACE
                    </div>
                </div>

                <div className="flex-1 flex flex-col justify-center items-center text-center max-w-xl mx-auto">
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-zinc-900 mb-6 leading-tight tracking-tight">
                        Simplify Sponsorship Management
                    </h1>
                    <p className="text-zinc-600 text-lg lg:text-xl font-medium mb-12 leading-relaxed">
                        SponsorTrack helps event organizers manage sponsor relationships, track deal progress, and monitor revenue — all in one place.
                    </p>

                    <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
                        <div className="flex items-start gap-3 w-fit mx-auto">
                            <span className="w-2 h-2 bg-zinc-800 rounded-full shrink-0 mt-2"></span>
                            <span className="text-zinc-800 font-bold text-lg text-left">Track sponsorship deals in real time</span>
                        </div>
                        <div className="flex items-start gap-3 w-fit mx-auto">
                            <span className="w-2 h-2 bg-zinc-800 rounded-full shrink-0 mt-2"></span>
                            <span className="text-zinc-800 font-bold text-lg text-left">Never miss follow-ups with reminders</span>
                        </div>
                        <div className="flex items-start gap-3 w-fit mx-auto">
                            <span className="w-2 h-2 bg-zinc-800 rounded-full shrink-0 mt-2"></span>
                            <span className="text-zinc-800 font-bold text-lg text-left">Monitor revenue and performance easily</span>
                        </div>
                    </div>
                </div>

                {/* Small branding tagline */}
                <div className="mt-12 text-zinc-500 font-bold text-sm justify-center text-center">
                    Built for event teams and marketing professionals.
                </div>
            </motion.div>

        </div>
    );
}
