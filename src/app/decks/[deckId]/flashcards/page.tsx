"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Trash, Edit, ArrowLeft } from "lucide-react";

type Flashcard = {
  id: string;
  question: string;
  answer: string;
};

export default function Flashcards({ params }: { params: Promise<{ deckId: string }> }) {
  const { deckId } = use(params);
  const router = useRouter();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage] = useState(5);

  useEffect(() => {
    const fetchFlashcards = async () => {
        try {
            const res = await fetch(`/api/decks/${deckId}/flashcards`);
            if (res.ok) {
                const data = await res.json();
                setFlashcards(data);
            } else {
                console.error('Korttien haku epäonnistui:', res.statusText);
            }
        } catch (error) {
            console.error('Virhe korttien haussa:', error);
        }
    };

    fetchFlashcards();
  }, [deckId]);

  const handleDelete = async (flashcardId: string) => {
    try {
      const res = await fetch(`/api/flashcards/${flashcardId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setFlashcards(flashcards.filter(card => card.id !== flashcardId));
      } else {
        setError("Virhe poistaessa muistikorttia.");
      }
    } catch (err) {
      console.error(err)
      setError("Virhe poistaessa muistikorttia.");
    }
  };

  if (error) {
    return <p>{error}</p>;
  }

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = flashcards.slice(indexOfFirstCard, indexOfLastCard);

  const totalPages = Math.ceil(flashcards.length / cardsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-6">
            <div className="mb-4 text-left">
                <button
                    onClick={() => router.push(`/decks/${deckId}`)}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                >
                    <ArrowLeft className="w-5 h-5 mr-1" />
                    Takaisin pakan tietoihin
                </button>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Muistikortit</h1>

            <button
                onClick={() => router.push(`/decks/create-cards/ai/${deckId}`)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl mb-4"
            >
                Lisää muistikortteja
            </button>

            {flashcards.length === 0 ? (
                <p>Ei muistikortteja.</p>
            ) : (
                <ul>
                    {currentCards.map((flashcard) => (
                        <li key={flashcard.id} className="flex justify-between items-center p-4 bg-gray-100 rounded-lg mb-4">
                            <div>
                                <strong>Kysymys:</strong> {flashcard.question}
                                <br />
                                <strong>Vastaus:</strong> {flashcard.answer}
                            </div>



                            <div className="flex gap-2">
                                <button
                                    onClick={() => router.push(`/decks/${deckId}/flashcards/edit/${flashcard.id}`)}
                                    className="text-yellow-500 hover:text-yellow-700"
                                >
                                    <Edit className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleDelete(flashcard.id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <Trash className="w-5 h-5" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${currentPage === 1 ? "bg-gray-400 cursor-not-allowed" : ""
                        }`}
                >
                    Previous
                </button>

                <div className="text-sm text-gray-700 mr-2 ml-2">
                    Page {currentPage} of {totalPages}
                </div>

                <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${currentPage === totalPages ? "bg-gray-400 cursor-not-allowed" : ""
                        }`}
                >
                    Next
                </button>
            </div>

        </div>
    );
}
