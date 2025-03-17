'use client';

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trash } from "lucide-react";

type Deck = {
  id: string;
  name: string;
  description: string;
  userId: number;
};

export default function Decks() {
  const { data: session, status } = useSession();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const res = await fetch("/api/decks");
        const data = await res.json();
        setDecks(data);
      } catch (error) {
        setError("Pakkojen haku epäonnistui: " + error);
        console.error("Pakkojen haku epäonnistui:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchDecks();
    } else {
      setLoading(false);
    }
  }, [session]);

  const handleDelete = async (deckId: string) => {
    const confirm = window.confirm("Haluatko varmasti poistaa tämän pakan?");
    if (!confirm) return;

    try {
      const res = await fetch(`/api/decks/${deckId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setDecks(prev => prev.filter(deck => deck.id !== deckId));
      } else {
        const data = await res.json();
        setError(data.error || "Pakan poistaminen epäonnistui.");
      }
    } catch (err) {
      console.error(err);
      setError("Pakan poistaminen epäonnistui.");
    }
  };

  if (status === "loading") {
    return <div>Ladataan...</div>;
  }

  if (!session) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p>Kirjaudu sisään nähdäksesi pakkasi.</p>
          <button
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
            onClick={() => router.push("/signin")}
          >
            Kirjaudu sisään
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Sinun pakat</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="mb-6">
        <button
          onClick={() => router.push("/decks/create")}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg"
        >
          Luo pakka
        </button>
      </div>

      <div>
        {loading ? (
          <p className="text-gray-600 animate-pulse">Ladataan pakkoja...</p>
        ) : decks.length === 0 ? (
          <p className="text-gray-600">Ei pakkoja.</p>
        ) : (
          <ul className="space-y-4">
            {decks.map((deck) => (
              <li
                key={deck.id}
                className="relative p-4 border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
               
                <button
                  onClick={() => handleDelete(deck.id)}
                  className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                  title="Poista pakka"
                >
                  <Trash className="w-5 h-5" />
                </button>

                
                <div onClick={() => router.push(`/decks/${deck.id}`)} className="cursor-pointer pr-6">
                  <h2 className="text-2xl font-semibold text-blue-600">{deck.name}</h2>
                  <p className="text-gray-700 mt-2">{deck.description || ""}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
