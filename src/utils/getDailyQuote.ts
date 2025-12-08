import { quotes } from "@/data/quotes";


export function getDailyQuote(personality: string) {
  const list = quotes[personality as keyof typeof quotes] || quotes.general;

  // Create a seed based on today's date
  const today = new Date();
  const seed = today.getFullYear() + today.getMonth() + today.getDate();

  // Pick quote deterministically (same quote for whole day)
  const index = seed % list.length;

  return list[index];
}
