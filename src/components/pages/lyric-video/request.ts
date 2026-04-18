"use server";
import GetServerAxiosWithAuth from "@/lib/axios-instance-server";
import { AxiosError } from "axios";

export interface AudioUploadResponse {
  audioId: string;
  duration: number;
  filePath: string;
  audioUrl: string;
  planLimit: number;
}

export interface CreateLyricVideoResponse {
  lyricVideoId: number;
  status: string;
  audioDuration: number;
}

export interface TimingData {
  words: Array<{
    word: string;
    startTime: number;
    endTime: number;
    lineIndex: number;
    wordIndex: number;
    isHighlighted?: boolean;
  }>;
  lines: Array<{
    text: string;
    startTime: number;
    endTime: number;
    lineIndex: number;
    words: Array<{
      word: string;
      startTime: number;
      endTime: number;
      lineIndex: number;
      wordIndex: number;
      isHighlighted?: boolean;
    }>;
  }>;
}

export interface LyricVideo {
  id: number;
  userId: number;
  audioPath: string;
  audioDuration: number;
  lyrics: string;
  lyricsData: unknown;
  style: string | null;
  font: string | null;
  textColor: string | null;
  highlightColor: string | null;
  backgroundColor: string | null;
  backgroundPreset: string | null;
  backgroundImage: string | null;
  aspectRatio: string | null;
  status: string;
  previewVideoPath: string | null;
  finalVideoPath: string | null;
  audioUrl: string | null;
  previewVideoUrl: string | null;
  finalVideoUrl: string | null;
  words?: Array<{
    id: number;
    word: string;
    startTime: number;
    endTime: number;
    lineIndex: number;
    wordIndex: number;
    isHighlighted: boolean;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface LyricVideosListResponse {
  videos: LyricVideo[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface JobStatusResponse {
  id: string;
  state: string;
  progress: unknown;
  result: unknown;
  failedReason: string | null;
  data: unknown;
}

/**
 * Upload audio file
 */
export async function uploadAudio(file: File): Promise<AudioUploadResponse | "error"> {
  const formData = new FormData();
  formData.append("audio", file);

  try {
    const axios = await GetServerAxiosWithAuth();
    const response = await axios.post<AudioUploadResponse>("lyric-videos/upload-audio", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    const e = error as AxiosError;
    console.error("Audio upload failed:", e);
    throw new Error("Failed to upload audio file");
  }
}

/**
 * Create lyric video project
 */
export async function createLyricVideo(data: {
  audioId: string;
  lyrics: string;
  style?: string;
  font?: string;
  textColor?: string;
  highlightColor?: string;
  backgroundColor?: string;
  backgroundPreset?: string;
  backgroundImage?: string;
}): Promise<CreateLyricVideoResponse | "error"> {
  try {
    const axios = await GetServerAxiosWithAuth();
    const response = await axios.post<CreateLyricVideoResponse>("lyric-videos/create", data);

    return response.data;
  } catch (error) {
    const e = error as AxiosError;
    console.error("Create lyric video failed:", e);
    throw new Error("Failed to create lyric video");
  }
}

/**
 * Align lyrics timing
 */
export async function alignTiming(audioId: string, lyrics: string): Promise<TimingData | "error"> {
  try {
    const axios = await GetServerAxiosWithAuth();
    const response = await axios.post<TimingData>("lyric-videos/align-timing", {
      audioId,
      lyrics,
    });

    return response.data;
  } catch (error) {
    const e = error as AxiosError;
    console.error("Align timing failed:", e);
    throw new Error("Failed to align lyrics timing");
  }
}

/**
 * Update word timing
 */
export async function updateTiming(
  lyricVideoId: number,
  words: TimingData["words"]
): Promise<{ success: boolean } | "error"> {
  try {
    const axios = await GetServerAxiosWithAuth();
    const response = await axios.put<{ success: boolean }>(`lyric-videos/${lyricVideoId}/timing`, {
      words,
    });

    return response.data;
  } catch (error) {
    const e = error as AxiosError;
    console.error("Update timing failed:", e);
    throw new Error("Failed to update timing");
  }
}

/**
 * Regenerate timing
 */
export async function regenerateTiming(lyricVideoId: number): Promise<TimingData | "error"> {
  try {
    const axios = await GetServerAxiosWithAuth();
    const response = await axios.post<TimingData>(`lyric-videos/${lyricVideoId}/regenerate-timing`);

    return response.data;
  } catch (error) {
    const e = error as AxiosError;
    console.error("Regenerate timing failed:", e);
    throw new Error("Failed to regenerate timing");
  }
}

/**
 * Get lyric video by ID
 */
export async function getLyricVideoById(id: number): Promise<LyricVideo | "error"> {
  try {
    const axios = await GetServerAxiosWithAuth();
    const response = await axios.get<LyricVideo>(`lyric-videos/${id}`);

    return response.data;
  } catch (error) {
    const e = error as AxiosError;
    console.error("Get lyric video failed:", e);
    throw new Error("Failed to fetch lyric video");
  }
}

/**
 * Get all lyric videos
 */
export async function getLyricVideos(params?: {
  page?: number;
  limit?: number;
  status?: string;
}): Promise<LyricVideosListResponse | "error"> {
  try {
    const axios = await GetServerAxiosWithAuth();
    const response = await axios.get<LyricVideosListResponse>("lyric-videos", {
      params,
    });

    return response.data;
  } catch (error) {
    const e = error as AxiosError;
    console.error("Get lyric videos failed:", e);
    throw new Error("Failed to fetch lyric videos");
  }
}

/**
 * Generate preview video
 */
export async function generatePreview(lyricVideoId: number): Promise<{ jobId: string; status: string } | "error"> {
  try {
    const axios = await GetServerAxiosWithAuth();
    const response = await axios.post<{ jobId: string; status: string }>(
      `lyric-videos/${lyricVideoId}/preview`
    );

    return response.data;
  } catch (error) {
    const e = error as AxiosError;
    console.error("Generate preview failed:", e);
    throw new Error("Failed to start preview generation");
  }
}

/**
 * Generate final video
 */
export async function generateFinalVideo(
  lyricVideoId: number,
  aspectRatio: "1:1" | "9:16" | "16:9" = "16:9"
): Promise<{ jobId: string; status: string; aspectRatio: string } | "error"> {
  try {
    const axios = await GetServerAxiosWithAuth();
    const response = await axios.post<{ jobId: string; status: string; aspectRatio: string }>(
      `lyric-videos/${lyricVideoId}/generate`,
      { aspectRatio }
    );

    return response.data;
  } catch (error) {
    const e = error as AxiosError;
    console.error("Generate final video failed:", e);
    throw new Error("Failed to start final video generation");
  }
}

/**
 * Get job status
 */
export async function getJobStatus(jobId: string): Promise<JobStatusResponse | "error"> {
  try {
    const axios = await GetServerAxiosWithAuth();
    const response = await axios.get<JobStatusResponse>(`lyric-videos/jobs/${jobId}`);

    return response.data;
  } catch (error) {
    const e = error as AxiosError;
    console.error("Get job status failed:", e);
    throw new Error("Failed to fetch job status");
  }
}
