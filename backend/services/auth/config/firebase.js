import { cert, initializeApp } from "firebase-admin";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let credential;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  // Production (Render): parse service account from env var
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  credential = cert(serviceAccount);
} else {
  // Local development: read from file
  try {
    const serviceAccount = JSON.parse(
      readFileSync(join(__dirname, "../serviceAccountKey.json"), "utf-8")
    );
    credential = cert(serviceAccount);
  } catch (err) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT env var is not set and serviceAccountKey.json was not found. " +
      "On Render, set FIREBASE_SERVICE_ACCOUNT to the full JSON contents of your service account key."
    );
  }
}

export const app = initializeApp({ credential });