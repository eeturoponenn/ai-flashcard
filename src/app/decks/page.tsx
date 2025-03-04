"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Decks(){
    const { data: session, status } = useSession();
    const router = useRouter();
  
    if (status === "loading") {
      return <div>Loading...</div>;
    }
  
    if (!session) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <p>You need to log in to view your decks.</p>
          <button
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
            onClick={() => router.push("/signin")}
          >
            Log in
          </button>
        </div>
      ); 
    }
  
    return (
      <div>
        
        <h1>Your Decks</h1>
        
      </div>
    );
}