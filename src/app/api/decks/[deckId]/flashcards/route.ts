import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; 
import { getServerSession } from 'next-auth'; 
import { authOptions } from '../../../auth/[...nextauth]/route'; 


type FlashcardInput = {
    question: string;
    answer: string;
  };

export async function GET(req: Request, { params }: { params: Promise<{ deckId: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Ei oikeutta' }, { status: 401 });
  }

  
  const { deckId } = await params;

  try {
    const flashcards = await prisma.flashcard.findMany({
      where: {
        deckId: deckId,
      },
    });



    return NextResponse.json(flashcards);
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Virhe muistikorttien hakemisessa' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ deckId: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Ei oikeutta' }, { status: 401 });
  }

  const { deckId } = await params;
  const { flashcards } = await request.json();

  try {
    const createdFlashcards = await Promise.all(
      flashcards.map(({ question, answer }: FlashcardInput) => {
        if (!question || !answer) {
          throw new Error('Molemmat kysymys sekä vastaus ovat pakollisia');
        }

        return prisma.flashcard.create({
          data: {
            question,
            answer,
            deckId,
          },
        });
      })
    );

    return NextResponse.json(createdFlashcards, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Muistikorttien luominen epäonnistui' }, { status: 500 });
  }
}
