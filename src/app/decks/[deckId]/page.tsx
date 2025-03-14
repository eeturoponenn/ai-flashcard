// /decks/[deckId]/page.tsx

"use client";

import { useSession } from "next-auth/react";
import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

type Deck = {
  id: string;
  name: string;
  description: string | null;
};

export default function DeckDetails({ params }: { params: Promise<{ deckId: string }> }) {
  const router = useRouter();
  const { data: session } = useSession();
  const { deckId } = use(params);

  const [deck, setDeck] = useState<Deck | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!deckId) return;

    const fetchDeck = async () => {
      try {
        const res = await fetch(`/api/decks/${deckId}`);
        if (res.ok) {
          const data = await res.json();
          setDeck(data);
        } else {
          setError("Pakkaa ei löytynyt tai sinä et omista sitä");
        }
      } catch (err) {
        console.error(err);
        setError("Virhe haettaessa pakkaa.");
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
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-6">
      <div className="mb-6">
        <button
          onClick={() => router.push("/decks")}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="font-medium">Takaisin pakkoihin</span>
        </button>
      </div>

      <h1 className="text-2xl font-bold text-gray-800 mb-2">{deck.name}</h1>
      <p className="text-gray-600 mb-6">{deck.description}</p>

      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => router.push(`/decks/create-cards/${deck.id}`)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition-colors shadow"
        >
          Luo muistikortteja pakalle
        </button>
        <button
          onClick={() => router.push(`/decks/practise/${deck.id}`)}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-xl transition-colors shadow"
        >
          Harjoittele pakkaa
        </button>
        <button
          onClick={() => router.push(`/decks/${deck.id}/flashcards`)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-xl transition-colors shadow"
        >
          Tarkastele muistikortteja
        </button>
      </div>
    </div>
  );
}
