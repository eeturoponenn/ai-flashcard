"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateDeck() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/decks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description: description || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Pakan luonti epäonnistui");
      }

      
        alert("Pakka luotiin onnistuneesti!");
        setLoading(false);
        router.push("/decks");
      

    } catch (error: unknown) {

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Jokin meni pieleen.");
      }
      
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="max-w-4xl mx-auto py-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-black">Luo uusi korttipakka</h1>
      {error && <p className="text-red-500">{error}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-lg font-medium text-black">
            Pakan nimi
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
