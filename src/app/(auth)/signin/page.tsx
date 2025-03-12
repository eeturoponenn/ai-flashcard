"use client"
import { signIn } from 'next-auth/react';

export default function SignIn() {
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement); 
    const email = formData.get('email') as string; 
    const password = formData.get('password') as string; 

    await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/decks",
    });
  };

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
    >
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Kirjaudu Sisään</h2>

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
        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Kirjaudu sisään
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
