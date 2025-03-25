'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from "next-auth/react";

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()


  const callbackUrl = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000/decks'
  : process.env.NEXTAUTH_URL + "/decks";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password || !confirmPassword) {
      setError('Kaikki kentät ovat pakollisia')
      return
    }

    if(password.length < 8){
      setError('Salasanan täytyy olla ainakin 8 merkkiä pitkä')
      return
    }

    if (!/\d/.test(password)) {
      setError('Salasanassa täytyy olla ainakin yksi numero')
      return
    }

    if (password !== confirmPassword) {
      setError('Salasanat eivät täsmää')
      return
    }

    setIsLoading(true)

    try {
   
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.status === 400) {
        setError(data.error)
      } else {
        
        const signInResponse = await signIn('credentials', {
          redirect: true,
          email,
          password,
          callbackUrl: callbackUrl
        })

        if (signInResponse?.error) {
          setError('Rekisteröitymisen jälkeinen kirjautuminen epäonnistui. Yritä uudestaan.')
        } else {
          
          router.push('/decks')
        }
      }

      setIsLoading(false)

    } catch (error) {
      console.error(error)
      setError('Tapahtui virhe. Yritä uudelleen myöhemmin.')
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Rekisteröidy</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <label className="block text-gray-700 mb-2" htmlFor="email">
          Sähköposti
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label className="block text-gray-700 mb-2" htmlFor="password">
          Salasana
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type='password'
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">
          Vahvista salasana
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type='password'
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        >
          {isLoading ? 'Rekisteröitymässä...' : 'Rekisteröidy'}
        </button>

        <div className="mt-4 text-center text-gray-600">
          <span> Onko jo käyttäjä? </span>
          <a href="/signin" className="text-blue-500 hover:underline">
            Kirjaudu
          </a>
        </div>
      </form>
    </div>
  )
}
