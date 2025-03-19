'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  let errorMessage = "Tapahtui virhe kirjautumisessa.";
  if (error === "CredentialsSignin") {
    errorMessage = "Virheellinen sähköposti tai salasana.";
  } else if (error === "AccessDenied") {
    errorMessage = "Pääsy evätty.";
  }


  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Kirjautumisvirhe</h1>
      <p className="mb-6">{errorMessage}</p>
      <Link href="/signin" className="text-blue-500 hover:underline">
        Yritä uudelleen
      </Link>
    </div>
  );
}
