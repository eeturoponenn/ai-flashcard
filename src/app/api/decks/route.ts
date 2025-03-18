import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

import { prisma } from '@/lib/prisma'


export async function GET() {
    const session = await getServerSession(authOptions);
  
    if (!session) {
      return NextResponse.json({ error: "Ei oikeutta" }, { status: 401 });
    }
  
    const userId = session.user.id;  
  
    const decks = await prisma.deck.findMany({
      where: {
        userId: userId,  
      },
    });
  
    return NextResponse.json(decks);
}


  export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
  
    if (!session) {
      return NextResponse.json({ error: "Ei oikeutta" }, { status: 401 });
    }
  
    const requestBody = await request.json();
  
    const { name, description } = requestBody;
  
    if (!name) {
      return NextResponse.json({ error: "Nimi on pakollinen" }, { status: 400 });
    }

  
    try {

      const deckCount = await prisma.deck.count({
        where: { userId: session.user.id },
      });
  
      if (deckCount >= 10) {
        return NextResponse.json({ error: "Voit luoda enintään 10 pakkaa" }, { status: 403 });
      }
  
      const deck = await prisma.deck.create({
        data: {
          name,
          description: description || null,
          userId: session.user.id,
        },
      });
  
      return NextResponse.json(deck, { status: 201 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Vika pakkaa luodessa" }, { status: 500 });
    }
  }
  