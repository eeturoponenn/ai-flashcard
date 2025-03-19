'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setMessage('Salasanat eivät täsmää');
      return;
    }

    setIsLoading(true); 
    setMessage(null);

    try {
      const res = await fetch("/api/profile", {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Salasana vaihdettu onnistuneesti');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setMessage(data.error || 'Jotain meni pieleen');
      }
    } catch (error) {
      setMessage('Virhe salasanan vaihdossa ' + error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') return <p>Ladataan...</p>;
  if (!session) return <p>Sinun täytyy olla kirjautunut nähdäksesi tämän sivun.</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded-xl shadow-md bg-white">
      <h1 className="text-2xl font-bold mb-4">Profiili</h1>
      <p className="mb-2">Sähköposti: <span className="font-semibold">{session.user?.email}</span></p>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Vaihda salasana</h2>
        <input
          type="password"
          placeholder="Uusi salasana"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        <input
          type="password"
          placeholder="Vahvista salasana"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        <button
          onClick={handlePasswordChange}
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Vaihdetaan...' : 'Vaihda salasana'}
        </button>
        {message && <p className="mt-3 text-sm text-red-600">{message}</p>}
      </div>
    </div>
  );
}
