"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, LayoutDashboard, Users, TrackedInfo, User, BookOpen } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: 'Home', href: '/dashboard' },
    { name: 'Sponsor list', href: '/sponsors' },
    { name: 'Tracker', href: '/tracker' },
    { name: 'Profile', href: '/profile' },
    { name: 'History', href: '/history' },
    { name: 'Feedback', href: '/feedback' },
  ];

  return (
    <aside className="w-[240px] flex flex-col py-8 px-6 text-white h-full relative border-r-0 shrink-0 bg-[#161719] z-10">
      {/* Logo Placeholder */}
      <div className="bg-white/10 h-10 rounded-full w-full mb-12 flex items-center justify-center">
        <span className="font-bold tracking-widest text-sm text-white/50">LOGO</span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 flex-1">
        {links.map((link) => {
          const isActive = pathname === link.href || (pathname === '/' && link.name === 'Home');
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`px-5 py-3 rounded-2xl font-bold transition-all text-[15px] border border-transparent ${isActive ? 'bg-[#d19d5a] text-white shadow-md' : 'text-zinc-300 hover:bg-white/5 hover:text-white hover:border-white/5'}`}
            >
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <Link href="/" className="mt-auto w-full">
        <button className="flex items-center justify-start gap-4 text-zinc-400 font-bold px-5 py-3 hover:bg-white/5 hover:text-white border border-transparent hover:border-white/5 rounded-2xl transition-all text-[15px] w-full">
          <LogOut className="w-5 h-5 text-zinc-500" />
          Logout
        </button>
      </Link>
    </aside>
  );
}
