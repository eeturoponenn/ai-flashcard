import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY
});

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    const prompt = `
    Luo korkeintaan 20 flashcardia seuraavasta tekstistä JSON-muodossa.
    Palauta vastaus ainoastaan seuraavan JSON-muodon mukaisesti:

    [
    {"question": "Kysymys 1", "answer": "Vastaus 1"},
    {"question": "Kysymys 2", "answer": "Vastaus 2"},
    ...
    ]

    Älä lisää mitään muuta tekstiä.
    Teksti: ${text}
    `;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Käytettävä malli
      temperature: 0.7, // Kontrolloi luovuuden tasoa: matala arvo tuottaa tarkempia vastauksia
      max_tokens: 5000, // Rajaa vastausten pituutta (max 5000 tokenia)
      messages: [
        {
          role: "system", // Järjestelmälle viesti, joka määrittelee AI:n käyttäytymisen.
          content:
            `Olet suomenkielinen assistentti, joka palauttaa täsmälleen oikean JSON-muotoisen vastauksen ilman mitään ylimääräistä tekstiä. 
            Luo korkeintaan 20 ja vähintään 1 muistikortti. 
            Jos käyttäjä pyytää enemmän, tee silti enintään 20. Älä koskaan tee yli 20 korttia.`,
        },
        {
          role: "user", // Käyttäjän syöte
          content: prompt,
        },
      ],
    });

    // Haetaan API-vastauksen sisältö
    const content = completion.choices[0]?.message?.content;

    // Parsitaan JSON ja lähetetään vastaus tai virheilmoitus asiakaspuolelle
    try {
      const parsed = JSON.parse(content || "[]");

      return NextResponse.json({ flashcards: parsed });
    } catch (error) {
      console.error("JSON-parsinta epäonnistui:", error);
      return NextResponse.json(
        { error: "AI vastaus ei ollut validi JSON. Yritä uudestaan lyhyemmällä syötteellä." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Virhe AI-käsittelyssä:", error);
    return NextResponse.json(
      { error: "Jotain meni pieleen AI-käsittelyssä. Yritä uudestaan." },
      { status: 500 }
    );
  }
}
