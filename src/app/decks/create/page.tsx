"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateDeck() {
  const [deckName, setDeckName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Add the logic to create a deck (mock or connect to your API here)
    // const newDeck = { name: deckName, description: description };

    // Simulate a deck creation success
    setTimeout(() => {
      alert("Deck created successfully!");
      setLoading(false);
      router.push("/decks"); // Redirect to the decks list page
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-black">Luo uusi korttipakka</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="deckName" className="block text-lg font-medium text-black">
            Pakka nimi
          </label>
          <input
            type="text"
            id="deckName"
            value={deckName}
            onChange={(e) => setDeckName(e.target.value)}
            required
            className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
            placeholder="Anna korttipakan nimi"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-lg font-medium text-black">
            Kuvaus
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
            placeholder="Anna korttipakan kuvaus"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow disabled:bg-gray-400"
        >
          {loading ? "Luodaan..." : "Luo pakka"}
        </button>
      </form>
    </div>
  );
}
