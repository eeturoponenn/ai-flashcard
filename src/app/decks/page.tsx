'use client';

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Deck = {
  id: number;
  name: string;
  description: string;
  userId: number;
};


export default function Decks() {
  const { data: session, status } = useSession();
  const [decks, setDecks] = useState<Deck[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchDecks = async () => {
      const res = await fetch("/api/decks");

      const data = await res.json();


      setDecks(data);
    };

    if (session) {
      fetchDecks();
    }
  }, [session]);


  if (status === "loading") {
    return <div>Ladataan...</div>;
  }


  if (!session) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Kirjaudu sisään nähdäkseen pakkasi.</p>
        <button
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
          onClick={() => router.push("/signin")}
        >
          Kirjaudu Sisään
        </button>
      </div>
    );
  }



  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Sinun pakat</h1>
      
      <div className="mb-6">
        <button
          onClick={() => router.push("/decks/create")}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg"
        >
          Luo pakka
        </button>
      </div>

      <div>
        {decks.length === 0 ? (
          <p className="text-gray-600">Ei pakkoja.</p>
        ) : (
          <ul className="space-y-4">
            {decks.map((deck) => (
              <li key={deck.id} 
              className="p-4 border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              onClick={() => router.push(`/decks/${deck.id}`)}>
                <h2 className="text-2xl font-semibold text-blue-600">{deck.name}</h2>
                <p className="text-gray-700 mt-2">{deck.description || ""}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
