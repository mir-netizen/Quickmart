import { delay } from "@/lib/utils";

export async function mockLatency<T>(value: T, ms = 420): Promise<T> {
  await delay(Math.min(ms, 80));
  return value;
}
