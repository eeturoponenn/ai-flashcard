"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";

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
      const res = await fetch(`/api/decks/${deckId}`);
      if (res.ok) {
        const data = await res.json();
        setDeck(data);
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
    
      alert("Failed to save flashcards.");
    }
  };

  return (
    <div>
      <h1>Luo muistikortteja pakalle: {deck?.name}</h1>
      <div>
        <label>
          Kysymys:
          <input
            type="text"
            value={newFlashcard.question}
            onChange={(e) => setNewFlashcard({ ...newFlashcard, question: e.target.value })}
            className="mt-2 p-2 border"
          />
        </label>
        <br />
        <label>
          Vastaus:
          <input
            type="text"
            value={newFlashcard.answer}
            onChange={(e) => setNewFlashcard({ ...newFlashcard, answer: e.target.value })}
            className="mt-2 p-2 border"
          />
        </label>
        <br />
        <button onClick={handleAddFlashcard} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
          Lisää muistikortti
        </button>
      </div>

      <div className="mt-4">
        <h3>Muistikortteja joita ollaan lisäämässä:</h3>
        <ul>
          {flashcards.map((flashcard, index) => (
            <li key={index}>
              {flashcard.question} - {flashcard.answer}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <button onClick={handleSaveFlashcards} className="bg-green-500 text-white py-2 px-4 rounded">
          Tallenna muistikortit
        </button>
      </div>
    </div>
  );
}