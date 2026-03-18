import Silk from "@/components/Silk"

export default function Home() {
  return (
    <div className ="h-full w-full">
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
