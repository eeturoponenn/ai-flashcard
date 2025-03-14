// /api/decks/[deckId]/flashcards/[flashcardId]
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; 
import { getServerSession } from 'next-auth'; 
import { authOptions } from '../../../../auth/[...nextauth]/route'; 

export async function DELETE(req: Request, { params }: { params: Promise<{ deckId: string, flashcardId: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Ei oikeutta' }, { status: 401 });
  }

  const { deckId, flashcardId } = await params;

  try {
    const flashcard = await prisma.flashcard.findUnique({
      where: { id: flashcardId },
    });

    if (!flashcard || flashcard.deckId !== deckId) {
      return NextResponse.json({ error: 'Muistikorttia ei löydy tai tätä pakkaa ei ole olemassa' }, { status: 404 });
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
