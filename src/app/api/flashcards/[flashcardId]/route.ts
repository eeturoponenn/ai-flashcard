import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/authOptions";


export async function GET(req: Request, { params }: { params: Promise<{ flashcardId: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Ei oikeutta' }, { status: 401 });
  }

  const { flashcardId } = await params;

  try {

      const flashcard = await prisma.flashcard.findUnique({
          where: { id: flashcardId },
          include: { deck: true },
      });

      if (!flashcard) {
          return NextResponse.json({ error: 'Muistikorttia ei löytynyt' }, { status: 404 });
      }

      
      if (flashcard.deck.userId !== session.user.id) {
          return NextResponse.json({ error: 'Ei oikeutta tähän muistikorttiin' }, { status: 403 });
      }

    return NextResponse.json(flashcard);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Virhe muistikortin haussa' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ flashcardId: string }> }) {
    const session = await getServerSession(authOptions);
  
    if (!session) {
      return NextResponse.json({ error: 'Ei oikeutta' }, { status: 401 });
    }
  
    const { flashcardId } = await params;
    const { question, answer } = await req.json();
  
    if (!question || !answer) {
      return NextResponse.json({ error: 'Kysymys ja vastaus ovat pakollisia.' }, { status: 400 });
    }
  
    try {
      const updatedFlashcard = await prisma.flashcard.update({
        where: { id: flashcardId },
        data: {
          question,
          answer,
        },
        include: { deck: true }
      });

      if (!updatedFlashcard || updatedFlashcard.deck.userId !== session.user.id) {
        return NextResponse.json({ error: 'Ei oikeutta päivittää tätä muistikorttia' }, { status: 403 });
      }
  
      return NextResponse.json(updatedFlashcard);
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Muistikortin päivitys epäonnistui' }, { status: 500 });
    }
  }

  
export async function DELETE(req: Request, { params }: { params: Promise<{ flashcardId: string }> }) {
    const session = await getServerSession(authOptions);
  
    if (!session) {
      return NextResponse.json({ error: 'Ei oikeutta' }, { status: 401 });
    }
  
    const { flashcardId } = await params;
  
    try {
      const flashcard = await prisma.flashcard.findUnique({
        where: { id: flashcardId },
        include: { deck: true },
      });
  
      if (!flashcard) {
        return NextResponse.json({ error: 'Muistikorttia ei löydy.' }, { status: 404 });
      }

        if (flashcard.deck.userId !== session.user.id) {
            return NextResponse.json({ error: 'Ei oikeutta poistaa tätä muistikorttia' }, { status: 403 });
        }
  
      await prisma.flashcard.delete({
        where: { id: flashcardId },
      });
  
      return NextResponse.json({ message: 'Muistikortti poistettu' }, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Virhe muistikortin poistamisessa' }, { status: 500 });
    }
  }
  
