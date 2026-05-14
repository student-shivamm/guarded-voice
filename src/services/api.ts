import type { DeepfakeResponse, SpeakerResponse } from "@/types/api";

// Configure your backend base URL via VITE_API_BASE_URL or replace below.
const BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "";

async function postForm<T>(path: string, form: FormData): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { method: "POST", body: form });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return (await res.json()) as T;
}

export async function detectDeepfake(audio: Blob): Promise<DeepfakeResponse> {
  // If no backend configured, return a deterministic mock for demo purposes.
  if (!BASE) {
    await new Promise((r) => setTimeout(r, 1800));
    const real = Math.random() > 0.4;
    return {
      prediction: real ? "REAL" : "DEEPFAKE",
      confidence: +(85 + Math.random() * 14).toFixed(1),
    };
  }
  const fd = new FormData();
  fd.append("audio", audio, "suspicious.wav");
  return postForm<DeepfakeResponse>("/api/detect-deepfake", fd);
}

export async function verifySpeaker(
  suspicious: Blob,
  reference: Blob,
): Promise<SpeakerResponse> {
  if (!BASE) {
    await new Promise((r) => setTimeout(r, 1800));
    const match = Math.random() > 0.4;
    return {
      match,
      similarity: +((match ? 80 : 50) + Math.random() * 15).toFixed(1),
    };
  }
  const fd = new FormData();
  fd.append("suspicious_audio", suspicious, "suspicious.wav");
  fd.append("reference_audio", reference, "reference.wav");
  return postForm<SpeakerResponse>("/api/verify-speaker", fd);
}
