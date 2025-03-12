"use client"

import { useSession } from "next-auth/react";
import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";

type Deck = {
  id: string;
  name: string;
  description: string | null;
};


export default function DeckDetails({params}: {params: Promise<{deckId: string}>}) {

  const router = useRouter();
   
  const { data: session } = useSession();

  const { deckId }= use(params);

  const [deck, setDeck] = useState<Deck | null>(null);
  const [error, setError] = useState<string | null>(null);

 
  useEffect(() => {
    if (!deckId) return;
 
    const fetchDeck = async () => {

      const res = await fetch(`/api/decks/${deckId}`);
      if (res.ok) {
        const data = await res.json();
        setDeck(data);
      } else {
        setError("Pakkaa ei löytynyt tai sinä et omista sitä");
      }
    };

    fetchDeck();
  }, [deckId]);

  if (!session) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Kirjaudu sisään nähdäksesi pakka tietoja.</p>
      </div>
    );
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!deck) {
    return <p>Ladataan...</p>;
  }

  return (
    <div>
      <h1>{deck.name}</h1>
      <p>{deck.description}</p>
      <div className="mt-4">
        <button
          onClick={() => router.push(`/decks/create-cards/${deck.id}`)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Luo muistikortteja pakalle
        </button>
        <button
          onClick={() => router.push(`/decks/practice/${deck.id}`)}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2"
        >
          Harjoittele pakkaa
        </button>
      </div>
    </div>
  );
}
