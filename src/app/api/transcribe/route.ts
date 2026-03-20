import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audio = formData.get("audio") as File;

    if (!audio) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    // Whisper API has a 25MB limit
    if (audio.size > 25 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File exceeds Whisper's 25MB limit. Please use a smaller file." },
        { status: 400 }
      );
    }

    const transcription = await openai.audio.transcriptions.create({
      file: audio,
      model: "whisper-1",
      response_format: "text",
    });

    // whisper-1 with response_format "text" returns a plain string
    const text = typeof transcription === "string" ? transcription : (transcription as { text: string }).text;

    return NextResponse.json({ text });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json(
      { error: err.message || "Transcription failed" },
      { status: 500 }
    );
  }
}
