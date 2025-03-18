import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

import { prisma } from "@/lib/prisma";
import bcryptjs from "bcryptjs";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Ei oikeutta" }, { status: 401 });


  const { password } = await request.json();


  if (!password || password.length < 8) {
    return NextResponse.json({ error: "Salasanan tulee olla vähintään 8 merkkiä" }, { status: 400 });
  }

  const hashedPassword = await bcryptjs.hash(password, 10);

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ message: "Salasana vaihdettu" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Virhe salasanan vaihdossa" }, { status: 500 });
  }
}
