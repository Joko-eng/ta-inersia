export const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const randomDelay = (min: number, max: number): Promise<void> =>
  wait(Math.floor(Math.random() * (max - min + 1)) + min);

export const pickRandom = <T>(arr: readonly T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

export function cleanText(text: string): string {
  return text.replace(/\s+/g, " ").replace(/[\n\r]/g, " ").trim();
}

export function parseRating(text: string): number {
  try {
    return parseFloat(text.split(" ")[0].replace(",", ".")) || 0;
  } catch {
    return 0;
  }
}

export function parseReviewCount(text: string): number {
  const digits = text.replace(/\D/g, "");
  return digits ? parseInt(digits) : 0;
}

export function formatPhoneNumber(raw: string): string {
  if (!raw) return "";
  const clean = raw.replace(/[^\d+]/g, "");
  if (clean.startsWith("0")) return "62" + clean.slice(1);
  if (!clean.startsWith("+") && !clean.startsWith("62")) return "62" + clean;
  return clean;
}