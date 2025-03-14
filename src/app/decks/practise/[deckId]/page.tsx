"use client"

import { useEffect, useState, use } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type Deck = {
    id: string;
    name: string;
    description: string;
    userId: number;
  };
  
  type Flashcard = {
    id: string;
    question: string;
    answer: string;
    deckId: string;
};

export default function Practise({ params }: { params: Promise<{ deckId: string }> }){

    const router = useRouter();
    const [deck, setDeck] = useState<Deck | null>(null);
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [practiceEnded, setPracticeEnded] = useState(false);

    const { deckId } = use(params);

    useEffect(() => {
        const fetchDeck = async () => {
            try {
                const res = await fetch(`/api/decks/${deckId}`);
                if (res.ok) {
                    const data = await res.json();
                    setDeck(data);
                } else {
                    console.error('Pakan haku epäonnstui:', res.statusText);
                }
            } catch (error) {
                console.error('Virhe pakan haussa:', error);
            }
        };

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
            } finally {
                setLoading(false);
            }
        };

        if (deckId) {
            fetchDeck();
            fetchFlashcards();
        }
    }, [deckId]);

    const shuffleArray = (array: Flashcard[]) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
      };

      const handleNextCard = () => {
        if (currentIndex < flashcards.length - 1) {
          setCurrentIndex((prev) => prev + 1);
          setShowAnswer(false);
        } else {
          setPracticeEnded(true);
        }
      };

      const handleRepeat = () => {
        const reshuffled = shuffleArray(flashcards);
        setFlashcards(reshuffled);
        setCurrentIndex(0);
        setShowAnswer(false);
        setPracticeEnded(false);
      };

    if (loading) return <p>Loading...</p>;

    if (!flashcards.length) return (
        <div>
            <div className="mb-4 text-left">
                <button
                    onClick={() => router.push(`/decks/${deckId}`)}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                >
                    <ArrowLeft className="w-5 h-5 mr-1" />
                    Takaisin pakan tietoihin
                </button>
            </div>
            <p>Ei muistikortteja pakassa.</p>
        </div>
    )
  
    const currentCard = flashcards[currentIndex];
  
    return (
        <div className="max-w-md mx-auto mt-10 text-center">
            <div className="mb-4 text-left">
                <button
                    onClick={() => router.push(`/decks/${deckId}`)}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                >
                    <ArrowLeft className="w-5 h-5 mr-1" />
                    Takaisin pakan tietoihin
                </button>
            </div>
            <h1 className="text-2xl font-bold mb-2">{deck?.name}</h1>
            <p className="text-gray-600 mb-6">{deck?.description}</p>

            {!practiceEnded ? (
                <>
                    <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 min-h-[150px] flex flex-col justify-center">
                        <h2 className="text-xl font-semibold">{currentCard.question}</h2>
                        {showAnswer && <p className="text-gray-700 mt-4">{currentCard.answer}</p>}
                    </div>

                    <div className="mt-6 flex justify-center gap-4">
                        {!showAnswer ? (
                            <button
                                onClick={() => setShowAnswer(true)}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                            >
                                Näytä vastaus
                            </button>
                        ) : (
                            <button
                                onClick={handleNextCard}
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                            >
                                Seuraava kortti
                            </button>
                        )}
                    </div>

                    <p className="mt-4 text-sm text-gray-500">
                        Kortti {currentIndex + 1} / {flashcards.length}
                    </p>
                </>
            ) : (
                <>
                    <p className="text-xl font-semibold mb-4">Harjoitus valmis!</p>
                    <button
                        onClick={handleRepeat}
                        className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg"
                    >
                        Harjoittele uudelleen
                    </button>
                </>
            )}
        </div>
    );
  }
