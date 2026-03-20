import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const formData = await request.formData();
    const audio = formData.get("audio") as File;

    if (!audio) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

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
```

Save with **Ctrl+S**, then go to Git Bash and run:
```
git add .
```
```
git commit -m "fix transcribe build error"
```
```
git push origin main