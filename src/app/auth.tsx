'use client'

import { signIn, signOut } from 'next-auth/react'
import { useSession } from 'next-auth/react';

export const LoginButton = () => {
const { data: session } = useSession();

  if (session) {
    return null;
  }
  return <button onClick={() => signIn()} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Kirjaudu sisään</button>
}

export const LogoutButton = () => {
const { data: session } = useSession();

  if (!session) {
    return null;
  }
  
  return <button onClick={() => signOut()} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Kirjaudu ulos</button>
}