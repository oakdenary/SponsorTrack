import Silk from "@/components/Silk";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative h-screen w-full overflow-hidden font-sans bg-[#161719]">
      {/* Background Silk Layer */}
      <div className="absolute inset-0 z-0">
        <Silk
          speed={5}
          scale={1}
          color="#C69B56"
          noiseIntensity={1.5}
          rotation={0}
        />
        {/* Soft blackout to guarantee the overlaid text contrasts perfectly */}
        <div className="absolute inset-0 bg-black/40 mix-blend-multiply pointer-events-none"></div>
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center pointer-events-none">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight drop-shadow-2xl">
          Welcome to <span className="text-[#d19d5a]">SponsorTrack</span>
        </h1>
        <p className="text-zinc-50 text-lg md:text-xl max-w-2xl mb-12 font-semibold drop-shadow-lg leading-relaxed">
          The ultimate platform to manage sponsor relationships, track your deal pipeline, and monitor revenue flows beautifully.
        </p>

        {/* Pointer events bound to link layer so button is clickable over the text flow */}
        <div className="pointer-events-auto">
          <Link href="/login">
            <button className="bg-white hover:bg-zinc-200 text-zinc-900 font-extrabold px-10 py-4 rounded-full transition-all text-lg shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] hover:-translate-y-1">
              Login to Dashboard
            </button>
          </Link>
        </div>
      </div>

    </div>
  );
}
