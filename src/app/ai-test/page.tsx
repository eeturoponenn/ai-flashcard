'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

type Flashcard = {
  question: string,
  answer: string
}

export default function AiFlashcardForm() {

  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();


  const handleSubmit = async (e: React.FormEvent) => {
    setFlashcards([]);
    e.preventDefault();
    setLoading(true);
  
    try {
      setError(null);
      const res = await fetch('/api/ai-test-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError("Tuntematon virhe, yritä myöhemmin uudestaan.");
      }
  
      setFlashcards(data.flashcards);

    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error", err);
        setError("Virhe AI-generoinnissa, yritä uudestaan.");
      } else {
        console.error("Unknown error", err);
        setError("Tuntematon virhe AI-generoinnissa");
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="p-6">
      <div className="mb-6">
        <button
          onClick={() => router.push("/")}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="font-medium">Takaisin etusivulle</span>
        </button>
      </div>
      <h2 className="text-2xl font-bold mb-4">Testaa korttien luontia tekoälyn avulla</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            className="w-[500px] border border-gray-300 rounded p-2"
            maxLength={8000}
            rows={10}
            cols={10}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Kirjoita aiheesta tai syötä valmis teksti..."
            required
          />
          <p className="absolute bottom-2 right-2 text-sm text-gray-500">
            {text.length}/8000 merkkiä
          </p>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Luodaan...' : 'Luo muistikortit'}
        </button>
      </form>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {flashcards.length > 0 && (
        <div className="mt-6">
          <div className="mt-6 w-[500px]">
            <h3 className="text-xl font-semibold mb-2">Luodut kortit:</h3>
            <ul className="space-y-2">
              {flashcards.map((card, index) => (
                <li key={index} className="p-3 border rounded">
                  <strong>Kysymys:</strong> {card.question} <br />
                  <strong>Vastaus:</strong> {card.answer}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}


    </div>
  );
}