import Papa from "papaparse";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const CIRCUIT_SIZE = 100;

export interface ParseResult {
  scores: number[];
  rowCount: number;
  padded: boolean;
  truncated: boolean;
  warnings: string[];
}

export function parseCSV(file: File): Promise<ParseResult> {
  return new Promise((resolve, reject) => {
    if (file.size > MAX_FILE_SIZE) {
      reject(new Error(`File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum is 10MB.`));
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete(results) {
        const warnings: string[] = [];

        // Check for bureau_score column
        const fields = results.meta.fields ?? [];
        if (!fields.includes("bureau_score")) {
          reject(new Error(`CSV missing "bureau_score" column. Found columns: ${fields.join(", ")}`));
          return;
        }

        // Extract and validate scores
        const rawScores: number[] = [];
        for (let i = 0; i < results.data.length; i++) {
          const row = results.data[i] as Record<string, string>;
          const val = Number(row.bureau_score);
          if (isNaN(val)) {
            reject(new Error(`Non-numeric bureau_score at row ${i + 1}: "${row.bureau_score}"`));
            return;
          }
          if (val < 0 || val > 1000) {
            reject(new Error(`bureau_score out of range (0-1000) at row ${i + 1}: ${val}`));
            return;
          }
          rawScores.push(Math.floor(val));
        }

        const rowCount = rawScores.length;
        let scores = rawScores;
        let padded = false;
        let truncated = false;

        // Pad or truncate to CIRCUIT_SIZE
        if (scores.length < CIRCUIT_SIZE) {
          warnings.push(`CSV has ${scores.length} rows. Padding to ${CIRCUIT_SIZE} with zeros (will be filtered in results).`);
          scores = [...scores, ...new Array(CIRCUIT_SIZE - scores.length).fill(0)];
          padded = true;
        } else if (scores.length > CIRCUIT_SIZE) {
          warnings.push(`CSV has ${scores.length} rows. Using first ${CIRCUIT_SIZE} only.`);
          scores = scores.slice(0, CIRCUIT_SIZE);
          truncated = true;
        }

        resolve({ scores, rowCount, padded, truncated, warnings });
      },
      error(err) {
        reject(new Error(`CSV parse error: ${err.message}`));
      },
    });
  });
}
