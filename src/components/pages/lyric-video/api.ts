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

/**
 * Create lyric video project (client-side)
 */
export async function createLyricVideoClient(data: {
  audioId: string;
  lyrics: string;
  style?: string;
  font?: string;
  textColor?: string;
  highlightColor?: string;
  backgroundColor?: string;
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
 * Transcribe audio to text using AssemblyAI (client-side)
 * Returns transcript text plus optional word/line timestamps when AssemblyAI is available.
 */
export async function transcribeAudioClient(audioId: string): Promise<{
  transcript: string;
  words?: AssemblyWord[];
  lines?: AssemblyLine[];
}> {
  const axios = await GetAxiosWithAuth();
  const response = await axios.post<{ transcript: string; words?: AssemblyWord[]; lines?: AssemblyLine[] }>(
    "lyric-videos/transcribe",
    { audioId }
  );
  return response.data;
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
    backgroundImage?: string | null;
  }
): Promise<LyricVideo> {
  const axios = await GetAxiosWithAuth();
  const response = await axios.put<LyricVideo>(`lyric-videos/${lyricVideoId}`, data);
  return response.data;
}
