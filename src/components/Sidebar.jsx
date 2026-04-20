"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, LayoutDashboard, Users, TrackedInfo, User, BookOpen } from "lucide-react";
import React from "react";

export function Sidebar() {
  const pathname = usePathname();

  const [isAdmin, setIsAdmin] = React.useState(() => {
    if (typeof window !== 'undefined') return window.localStorage.getItem('role') === 'admin';
    return false;
  });

  const standardLinks = [
    { name: 'Home', href: '/dashboard' },
    { name: 'Sponsor list', href: '/sponsors' },
    { name: 'Tracker', href: '/tracker' },
    { name: 'Profile', href: '/profile' },
    { name: 'Feedback', href: '/feedback' },
  ];

  const adminLinks = [
    { name: 'Admin Dashboard', href: '/admin/dashboard' },
    { name: 'Role Manager', href: '/admin/roles' },
    { name: 'Council Leaderboard', href: '/admin/leaderboard' },
    { name: 'Feedback', href: '/admin/feedback' },
  ];

  React.useEffect(() => {
    const checkRole = async () => {
      try {
        const { supabase } = await import('@/lib/supabase');
        const { data: authData } = await supabase.auth.getUser();
        if (authData?.user) {
          const res = await fetch(`/api/user?id=${authData.user.id}`);
          const userInfo = await res.json();
          if (userInfo.role === 'admin') {
            setIsAdmin(true);
            window.localStorage.setItem('role', 'admin');
          } else {
            window.localStorage.setItem('role', 'user');
          }
        }
      } catch (err) {
        console.error("Failed to check admin status", err);
      }
    };
    checkRole();
  }, []);

  const links = isAdmin ? adminLinks : standardLinks;

  const handleLogout = async () => {
    window.localStorage.removeItem('role');
    const { supabase } = await import('@/lib/supabase');
    await supabase.auth.signOut();
  };

  return (
    <aside className="w-[240px] flex flex-col py-8 px-6 text-white h-full relative border-r-0 shrink-0 bg-[#161719] z-10">
      {/* Logo Placeholder */}
      <div className="bg-white/10 h-10 rounded-full w-full mb-12 flex items-center justify-center">
        <span className="font-bold tracking-widest text-sm text-white/50">LOGO</span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 flex-1">
        {links.map((link) => {
          // Precise active logic to avoid false positives (e.g., /admin matching /admin/roles)
          let isActive = pathname === link.href;
          if (pathname === '/' && link.name === 'Home') isActive = true;
          if (pathname === '/admin' && link.name === 'Admin Dashboard') isActive = true;

          return (
            <Link
              key={link.name}
              href={link.href}
              className={`px-5 py-3 rounded-2xl font-bold transition-all text-[14px] leading-tight border border-transparent ${isActive ? 'bg-[#d19d5a] text-white shadow-[#d19d5a]/20 shadow-lg' : 'text-zinc-400 hover:bg-white/5 hover:text-white hover:border-white/5'}`}
            >
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <Link href="/" onClick={handleLogout} className="mt-auto w-full">
        <button className="flex items-center justify-start gap-4 text-zinc-400 font-bold px-5 py-3 hover:bg-white/5 hover:text-white border border-transparent hover:border-white/5 rounded-2xl transition-all text-[15px] w-full">
          <LogOut className="w-5 h-5 text-zinc-500" />
          Logout
        </button>
      </Link>
    </aside>
  );
}
