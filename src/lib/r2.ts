// Cloudflare R2 Object Storage Service
import { getR2 } from "./cloudflare-context";

export async function uploadToR2(
  key: string,
  data: ArrayBuffer | Uint8Array | ReadableStream | string,
  contentType?: string,
) {
  const r2 = getR2();
  if (!r2) {
    throw new Error("Cloudflare R2 storage binding (STORAGE) not available");
  }
  return await r2.put(key, data, {
    httpMetadata: contentType ? { contentType } : undefined,
  });
}

export async function getFromR2(key: string) {
  const r2 = getR2();
  if (!r2) return null;
  return await r2.get(key);
}

export async function deleteFromR2(key: string) {
  const r2 = getR2();
  if (!r2) return;
  return await r2.delete(key);
}

export async function listFromR2(options?: { prefix?: string; limit?: number }) {
  const r2 = getR2();
  if (!r2) return [];
  return await r2.list(options);
}
