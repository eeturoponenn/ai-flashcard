'use client'

import { signOut } from 'next-auth/react'
import { useSession } from 'next-auth/react';
import Link from 'next/link'; 

export const LoginButton = () => {
  const { data: session } = useSession();

  if (session) {
    return null;  // If the user is already logged in, hide the login button
  }

  return (
    <div className='p-2'>
      <Link href="/signin">
        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-3'>
          Kirjaudu sisään
        </button>
      </Link>
      <Link href="/signup">
        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
          Rekisteröidy
        </button>
      </Link>
    </div>
  );
}

export const LogoutButton = () => {
  const { data: session } = useSession();

  if (!session) {
    return null;  // If the user is not logged in, hide the logout button
  }

  return (
    <button
      onClick={() => signOut({ callbackUrl: "/signin" })}  // Redirect to sign-in page after logging out
      className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
    >
      Kirjaudu ulos
    </button>
  );
}
