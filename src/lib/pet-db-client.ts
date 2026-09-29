/**
 * Client-side helper for Pet CRUD and Pet Sub-records (Cloudflare D1 & R2).
 * Completely bypasses Supabase so pet operations work reliably.
 */

export async function fetchPet(id: string): Promise<any | null> {
  const res = await fetch(`/api/pets?id=${encodeURIComponent(id)}`);
  if (!res.ok) return null;
  return res.json();
}

export async function fetchUserPets(userId: string): Promise<any[]> {
  const res = await fetch(`/api/pets?userId=${encodeURIComponent(userId)}`);
  if (!res.ok) return [];
  return res.json();
}

export async function updatePet(id: string, updates: any): Promise<void> {
  const res = await fetch("/api/pets", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...updates }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to update pet");
  }
}

export async function deletePet(id: string): Promise<void> {
  const res = await fetch(`/api/pets?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to delete pet");
  }
}

export async function fetchPetRecords<T = any>(table: string, petId: string): Promise<T[]> {
  const res = await fetch(`/api/pet-records?table=${encodeURIComponent(table)}&petId=${encodeURIComponent(petId)}`);
  if (!res.ok) return [];
  return res.json();
}

export async function insertPetRecord<T = any>(table: string, record: any): Promise<T> {
  const res = await fetch("/api/pet-records", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ table, record }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to save record");
  }
  return res.json();
}

export async function updatePetRecord(table: string, id: string, updates: any): Promise<void> {
  const res = await fetch("/api/pet-records", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ table, id, updates }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to update record");
  }
}

export async function deletePetRecord(table: string, id: string): Promise<void> {
  const res = await fetch(`/api/pet-records?table=${encodeURIComponent(table)}&id=${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to delete record");
  }
}

