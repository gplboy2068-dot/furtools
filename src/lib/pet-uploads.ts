export const PET_BUCKET = "furtools-assets";

/** Uploads a file to Cloudflare R2 via /api/upload and returns the file URL. */
export async function uploadPetFile(
  _userId: string,
  _petId: string,
  _kind: string,
  file: File,
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    throw new Error("Failed to upload file to storage");
  }
  const data = (await res.json()) as { url?: string; key?: string };
  return data.url || (data.key ? `/api/assets/${data.key}` : "");
}

/** Resolves URL for pet file (handles direct R2 URLs and legacy paths). */
export async function signedPetFileUrl(path: string, _expiresSeconds = 60 * 60): Promise<string | null> {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("/api/assets/")) {
    return path;
  }
  return `/api/assets/${path}`;
}

export async function deletePetFile(_path: string) {
  // R2 assets deletion
}
