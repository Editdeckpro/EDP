"use client";
import { GetAxiosWithAuth } from "@/lib/axios-instance";
import type {
  AudioUploadResponse,
  CreateLyricVideoResponse,
  TimingData,
  LyricVideo,
  LyricVideosListResponse,
  JobStatusResponse,
} from "./request";

export type { LyricVideo };

/**
 * Upload audio file (client-side)
 */
export async function uploadAudioClient(file: File): Promise<AudioUploadResponse> {
  const formData = new FormData();
  formData.append("audio", file);

  const axios = await GetAxiosWithAuth();
  const response = await axios.post<AudioUploadResponse>("lyric-videos/upload-audio", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

/** Line-level timing entry used for direct lyricsData injection */
export interface LyricsDataLine {
  text: string;
  start: number;
  end: number;
}

/**
 * Create lyric video project (client-side)
 * Pass `lyricsData` to skip the async Whisper alignment on the backend
 * (e.g. when AssemblyAI already gave us accurate timestamps).
 */
export async function createLyricVideoClient(data: {
  audioId: string;
  lyrics: string;
  lyricsData?: { lines: LyricsDataLine[] };
  style?: string;
  font?: string;
  textColor?: string;
  highlightColor?: string;
  backgroundColor?: string;
  backgroundPreset?: string;
  backgroundImage?: string;
}): Promise<CreateLyricVideoResponse> {
  const axios = await GetAxiosWithAuth();
  const response = await axios.post<CreateLyricVideoResponse>("lyric-videos/create", data);
  return response.data;
}

export interface AssemblyWord {
  text: string;
  start: number;
  end: number;
}

export interface AssemblyLine {
  text: string;
  start: number;
  end: number;
}

/**
 * Transcribe audio to text using AssemblyAI / Whisper.
 * Starts an async job on the backend and polls every 3 seconds until complete.
 */
export async function transcribeAudioClient(audioId: string): Promise<{
  transcript: string;
  words?: AssemblyWord[];
  lines?: AssemblyLine[];
}> {
  const axios = await GetAxiosWithAuth();

  const startRes = await axios.post<{ jobId: string }>("lyric-videos/transcribe", { audioId });
  const { jobId } = startRes.data;

  const POLL_INTERVAL_MS = 3_000;
  const MAX_POLLS = 100; // 5 minutes

  for (let i = 0; i < MAX_POLLS; i++) {
    await new Promise<void>((r) => setTimeout(r, POLL_INTERVAL_MS));

    const pollRes = await axios.get<{
      status: "processing" | "completed" | "failed";
      transcript?: string;
      words?: AssemblyWord[];
      lines?: AssemblyLine[];
      error?: string;
    }>(`lyric-videos/transcribe/${jobId}`);

    const { status, transcript, words, lines, error } = pollRes.data;

    if (status === "completed") return { transcript: transcript!, words, lines };
    if (status === "failed") throw new Error(error || "Transcription failed");
    // "processing" — continue polling
  }

  throw new Error("Transcription timed out after 5 minutes");
}

/**
 * Align lyrics timing (client-side)
 */
export async function alignTimingClient(audioId: string, lyrics: string): Promise<TimingData> {
  const axios = await GetAxiosWithAuth();
  const response = await axios.post<TimingData>("lyric-videos/align-timing", {
    audioId,
    lyrics,
  });
  return response.data;
}

/**
 * Update word timing (client-side)
 */
export async function updateTimingClient(
  lyricVideoId: number,
  words: TimingData["words"]
): Promise<{ success: boolean }> {
  const axios = await GetAxiosWithAuth();
  const response = await axios.put<{ success: boolean }>(`lyric-videos/${lyricVideoId}/timing`, {
    words,
  });
  return response.data;
}

/**
 * Regenerate timing (client-side)
 */
export async function regenerateTimingClient(lyricVideoId: number): Promise<TimingData> {
  const axios = await GetAxiosWithAuth();
  const response = await axios.post<TimingData>(`lyric-videos/${lyricVideoId}/regenerate-timing`);
  return response.data;
}

/**
 * Get lyric video by ID (client-side)
 */
export async function getLyricVideoByIdClient(id: number): Promise<LyricVideo> {
  const axios = await GetAxiosWithAuth();
  const response = await axios.get<LyricVideo>(`lyric-videos/${id}`);
  return response.data;
}

/**
 * Get all lyric videos (client-side)
 */
export async function getLyricVideosClient(params?: {
  page?: number;
  limit?: number;
  status?: string;
}): Promise<LyricVideosListResponse> {
  const axios = await GetAxiosWithAuth();
  const response = await axios.get<LyricVideosListResponse>("lyric-videos", {
    params,
  });
  return response.data;
}

/**
 * Generate preview video (client-side)
 */
export async function generatePreviewClient(
  lyricVideoId: number
): Promise<{ jobId?: string; status?: string; message?: string; previewUrl?: string }> {
  const axios = await GetAxiosWithAuth();
  const response = await axios.post<{ jobId?: string; status?: string; message?: string; previewUrl?: string }>(
    `lyric-videos/${lyricVideoId}/preview`
  );
  return response.data;
}

/**
 * Generate final video (client-side)
 */
export async function generateFinalVideoClient(
  lyricVideoId: number,
  aspectRatio: "1:1" | "9:16" | "16:9" = "16:9"
): Promise<{ jobId?: string; status?: string; aspectRatio?: string; finalUrl?: string; exportUrl?: string }> {
  const axios = await GetAxiosWithAuth();
  const response = await axios.post<{ jobId?: string; status?: string; aspectRatio?: string; finalUrl?: string; exportUrl?: string }>(
    `lyric-videos/${lyricVideoId}/generate`,
    { aspectRatio }
  );
  return response.data;
}

/**
 * Get job status (client-side)
 */
export async function getJobStatusClient(jobId: string): Promise<JobStatusResponse> {
  const axios = await GetAxiosWithAuth();
  const response = await axios.get<JobStatusResponse>(`lyric-videos/jobs/${jobId}`);
  return response.data;
}

/**
 * Upload a background image (client-side)
 */
export async function uploadBackgroundImageClient(file: File): Promise<{ imageUrl: string }> {
  const formData = new FormData();
  formData.append("image", file);
  const axios = await GetAxiosWithAuth();
  const response = await axios.post<{ imageUrl: string }>("lyric-videos/upload-background", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

/**
 * Generate an AI background image for a lyric video (client-side)
 */
export async function generateBackgroundImageClient(
  lyricVideoId: number,
  prompt: string
): Promise<{ imageUrl: string }> {
  const axios = await GetAxiosWithAuth();
  const response = await axios.post<{ imageUrl: string }>(
    `lyric-videos/${lyricVideoId}/generate-background`,
    { prompt }
  );
  return response.data;
}

/**
 * Update lyric video settings (client-side)
 */
export async function updateLyricVideoClient(
  lyricVideoId: number,
  data: {
    style?: string;
    font?: string;
    textColor?: string;
    highlightColor?: string;
    backgroundColor?: string;
    backgroundPreset?: string | null;
    backgroundImage?: string | null;
  }
): Promise<LyricVideo> {
  const axios = await GetAxiosWithAuth();
  const response = await axios.put<LyricVideo>(`lyric-videos/${lyricVideoId}`, data);
  return response.data;
}
