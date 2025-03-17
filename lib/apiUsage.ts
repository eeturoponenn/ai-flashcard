import { prisma } from '@/lib/prisma';

const MAX_CALLS_PER_DAY = 100;

export async function checkAndIncrementApiUsage(userId: string) {
  const today = new Date();
  
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  // Etsitään käyttäjän API-käyttö tietokannasta tämän päivän ajalta
  let usage = await prisma.apiUsage.findFirst({
    where: {
      userId,
      date: {
        gte: startOfDay,
      },
    },
  });

  // Jos käyttäjällä ei ole käyttöä tälle päivälle, luodaan uusi rivi
  if (!usage) {
    usage = await prisma.apiUsage.create({
      data: {
        userId,
        calls: 1,
      },
    });
    return;
  }

  // Jos kutsuja on jo saavutettu, heitä virhe
  if (usage.calls >= MAX_CALLS_PER_DAY) {
    throw new Error("Olet ylittänyt API-kutsurajan tänään.");
  }

  // Muuten päivitetään kutsujen määrä
  await prisma.apiUsage.update({
    where: { id: usage.id },
    data: { calls: { increment: 1 } },
  });
}
