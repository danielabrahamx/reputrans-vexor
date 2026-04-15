import type { GradeLetter } from "./grades";

export interface Portfolio {
  id: string;
  grades: GradeLetter[];
  proof: string;
  publicInputs: number[];
  metadata: {
    filename: string;
    rowCount: number;
    uploadedAt: string;
  };
  status: "pending_verification" | "verified" | "failed";
}

export interface ProofResult {
  grades: GradeLetter[];
  proof: Uint8Array;
  publicInputs: number[];
}

export interface CSVRow {
  app_id: string;
  bureau_score: number;
  [key: string]: string | number;
}

export interface APIError {
  error: string;
}
