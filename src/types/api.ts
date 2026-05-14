export interface DeepfakeResponse {
  prediction: "REAL" | "DEEPFAKE";
  confidence: number;
}

export interface SpeakerResponse {
  match: boolean;
  similarity: number;
}
