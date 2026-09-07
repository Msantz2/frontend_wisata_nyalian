import {
  getFAQsServer,
  getFAQByIdServer,
} from "@/lib/services/faq";
import type { FAQ } from "@/types/faq";

export async function getFAQs(): Promise<FAQ[]> {
  return getFAQsServer();
}

export async function getFAQById(id: string): Promise<FAQ | undefined> {
  return getFAQByIdServer(id);
}
