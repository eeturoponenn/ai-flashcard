"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const callbackUrl = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000/decks'
  : process.env.NEXTAUTH_URL + "decks";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null); 

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: callbackUrl,
    });

    if (result?.error) {
      console.log('result:', result);
      setError("Virheellinen sähköposti tai salasana.");
      setLoading(false);
    } else {
      console.log('Logged in:', result);
      router.push("/decks")
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
    >
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        Kirjaudu Sisään
      </h2>

      {error && (
        <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
      )}

      <label className="block text-gray-700 mb-2" htmlFor="email">
        Sähköposti
      </label>
      <input
        id="email"
        name="email"
        type="email"
        required
        className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <label className="block text-gray-700 mb-2" htmlFor="password">
        Salasana
      </label>
      <input
        id="password"
        name="password"
        type="password"
        required
        className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        type="submit"
        className={`w-full py-3 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        disabled={loading}
      >
        {loading ? "Kirjaudutaan..." : "Kirjaudu sisään"}
      </button>

      <div className="mt-4 text-center text-gray-600">
        <span>Eikö ole käyttäjää? </span>
        <a href="/signup" className="text-blue-500 hover:underline">
          Rekisteröidy
        </a>
      </div>
    </form>
  );
}
