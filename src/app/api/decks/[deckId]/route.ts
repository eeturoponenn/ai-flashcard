import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ deckId: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Ei oikeutta" }, { status: 401 });
  }

  const { deckId } = await params;


  const deck = await prisma.deck.findUnique({
    where: { id: deckId },
    include: {
      user: true, 
    },
  });

  if (!deck) {
    return NextResponse.json({ error: "Pakkaa ei löytynyt" }, { status: 404 });
  }

 
  if (deck.userId !== session.user.id) {
    return NextResponse.json({ error: "Sinulla ei ole oikeutta tähän pakkaan" }, { status: 403 });
  }

  return NextResponse.json(deck);
}


export async function DELETE(req: Request, { params }: { params: Promise<{ deckId: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Ei oikeutta" }, { status: 401 });
  }

  const { deckId } = await params;

  try {
    const deck = await prisma.deck.findUnique({
      where: { id: deckId },
    });

    if (!deck) {
      return NextResponse.json({ error: "Pakkaa ei löydy" }, { status: 404 });
    }

    if (deck.userId !== session.user.id) {
      return NextResponse.json({ error: "Ei oikeutta poistaa tätä pakkaa" }, { status: 403 });
    }

    await prisma.deck.delete({
      where: { id: deckId },
    });

    return NextResponse.json({ message: "Pakka poistettu onnistuneesti" }, { status: 200 });
  } catch (error) {
    console.error("Virhe poistettaessa pakkaa:", error);
    return NextResponse.json({ error: "Jokin meni pieleen" }, { status: 500 });
  }
}

