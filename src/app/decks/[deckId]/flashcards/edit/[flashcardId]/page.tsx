"use client"

import React, {useEffect, useState, use} from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
  

export default function EditCards({ params }: { params: Promise<{ deckId: string, flashcardId: string }> }) {

  const { deckId, flashcardId } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");


  useEffect(() => {
    const fetchFlashcard = async () => {
      try {
        const res = await fetch(`/api/flashcards/${flashcardId}`);
        if (res.ok) {
          const data = await res.json();
          setQuestion(data.question);
          setAnswer(data.answer);
        } else {
          setError("Virhe muistikortin hakemisessa.");
        }
      } catch (err) {
        setError("Virhe palvelinyhteydessä: " + err);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcard();
  }, [deckId, flashcardId]);

  const handleSave = async () => {

    if (question === "" || answer === "") {
      setError("Molemmat kysymys sekä vastaus ovat pakollisia")
      return
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/flashcards/${flashcardId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, answer }),
      });

      if (res.ok) {
        router.push(`/decks/${deckId}/flashcards`);
      } else {
        setError("Virhe muistikortin tallentamisessa.");
      }
    } catch (err) {
      setError("Virhe palvelinyhteydessä: " + err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6 text-gray-600">Ladataan muistikorttia...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-4 text-left">
        <button
          onClick={() => router.push(`/decks/${deckId}/flashcards`)}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Takaisin tarkastelemaan muistikortteja
        </button>
      </div>
      <h1 className="text-2xl font-bold mb-6">Muokkaa muistikorttia</h1>

      <label className="block mb-2 text-gray-700 font-semibold">Kysymys</label>
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="w-full border px-4 py-2 rounded-lg mb-4"
      />

      <label className="block mb-2 text-gray-700 font-semibold">Vastaus</label>
      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        className="w-full border px-4 py-2 rounded-lg mb-4"
      />

      {error && <p className="text-red-500 m-2">{error}</p>}


      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
      >
        {saving ? "Tallennetaan..." : "Tallenna muutokset"}
      </button>
    </div>
  );

}