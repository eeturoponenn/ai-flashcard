"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";
import { ArrowLeft } from "lucide-react";

type Flashcard = {
  question: string;
  answer: string;
};

export default function CreateFlashcards({ params }: { params: Promise<{ deckId: string }> }) {
  const { deckId } = use(params);
  const [deck, setDeck] = useState<{ name: string; description: string | null } | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [newFlashcard, setNewFlashcard] = useState<Flashcard>({ question: "", answer: "" });
  const router = useRouter();

  useEffect(() => {
    const fetchDeck = async () => {
        try {
            const res = await fetch(`/api/decks/${deckId}`);
            if (res.ok) {
                const data = await res.json();
                setDeck(data);
            } else {
                console.error('Pakan haku epäonnistui:', res.statusText);
            }
        } catch (error) {
            console.error('Virhe pakan haussa:', error);
        }
    };
    fetchDeck();
}, [deckId]);


  const handleAddFlashcard = () => {
    setFlashcards([...flashcards, newFlashcard]);
    setNewFlashcard({ question: "", answer: "" });
  };

  const handleSaveFlashcards = async () => {
  
    const res = await fetch(`/api/decks/${deckId}/flashcards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ flashcards }),
    });

    if (res.ok) {
      
      router.push(`/decks/${deckId}`);
    } else {
    
      alert("Korttien luonti epäonnistui. Yritä uudestaan.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-6">
      <div className="mb-6">
        <button
          onClick={() => router.push(`/decks/${deckId}`)}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="font-medium">Takaisin pakan tietoihin</span>
        </button>
      </div>
  
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Luo muistikortteja pakalle: <span className="text-blue-600">{deck?.name}</span>
      </h1>
  
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Kysymys:</label>
          <input
            type="text"
            value={newFlashcard.question}
            onChange={(e) => setNewFlashcard({ ...newFlashcard, question: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
  
        <div>
          <label className="block text-gray-700 font-medium mb-1">Vastaus:</label>
          <input
            type="text"
            value={newFlashcard.answer}
            onChange={(e) => setNewFlashcard({ ...newFlashcard, answer: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
  
        <button
          onClick={handleAddFlashcard}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow"
        >
          Lisää muistikortti
        </button>
      </div>
  
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Muistikortit joita ollaan lisäämässä:</h3>
        {flashcards.length > 0 ? (
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {flashcards.map((flashcard, index) => (
              <li key={index}>
                <span className="font-medium">{flashcard.question}</span> – {flashcard.answer}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Ei muistikortteja lisättynä vielä.</p>
        )}
      </div>
  
      <div className="mt-6">
        <button
          onClick={handleSaveFlashcards}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow"
        >
          Tallenna muistikortit
        </button>
      </div>
    </div>
  );
  
}