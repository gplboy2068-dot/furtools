import { supabase } from "@/integrations/supabase/client";

export const PET_BUCKET = "pet-files";

/** Uploads a file to pet-files under `<userId>/<petId>/<kind>/<name>` and returns the storage path. */
export async function uploadPetFile(
  userId: string,
  petId: string,
  kind: string,
  file: File,
): Promise<string> {
  const ext = file.name.includes(".") ? file.name.slice(file.name.lastIndexOf(".")) : "";
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  const path = `${userId}/${petId}/${kind}/${safeName}`;
  const { error } = await supabase.storage.from(PET_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) throw error;
  return path;
}

/** Creates a short-lived signed URL for a private pet file (default 1 hour). */
export async function signedPetFileUrl(path: string, expiresSeconds = 60 * 60): Promise<string | null> {
  if (!path) return null;
  const { data, error } = await supabase.storage.from(PET_BUCKET).createSignedUrl(path, expiresSeconds);
  if (error) return null;
  return data?.signedUrl ?? null;
}

export async function deletePetFile(path: string) {
  if (!path) return;
  await supabase.storage.from(PET_BUCKET).remove([path]);
}
