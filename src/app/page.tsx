"use client";

import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter();

  return (
    <div className="flex flex-col items-center">
      
      <section className="w-full max-w-4xl text-center py-16 px-6">
        <h1 className="text-4xl font-bold p-3">
          Älykkäät muistikortit. Tehokkaampaa oppimista.
        </h1>
        <p className="mt-4">
          Luo muistikortteja automaattisesti, ja tehosta oppimistasi tekoälyn avulla.
        </p>
        <button 
          onClick={() => router.push("/decks")}
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700">
          Aloita nyt
        </button>
      </section>

      
      <section className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 px-6">
        <FeatureCard title="Tekoälyllä luodut muistikortit" description="Luo muistikortteja automaattisesti tekstistä tai muistiinpanoista." />
        <FeatureCard title="Mukautettavat pakat" description="Järjestä muistikortit omiin oppimispakkoihisi." />
      </section>
    </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-gray-600 mt-2">{description}</p>
    </div>
  );
}
