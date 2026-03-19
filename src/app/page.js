import Silk from "@/components/Silk";

export default function Home() {
  return (
    <div className="relative h-screen w-full overflow-hidden font-sans bg-[#161719]">
      {/* Background Silk Layer */}
        <Silk
          speed={5}
          scale={1}
          color="#C69B56"
          noiseIntensity={1.5}
          rotation={0}
        />
        

    </div>
  );
}
