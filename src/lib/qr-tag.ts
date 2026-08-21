import QRCode from "qrcode";

export interface PetTagData {
  id?: string;
  petName: string;
  species: string;
  breed?: string;
  photoUrl?: string;
  microchipNumber?: string;
  color?: string;
  gender?: string;
  weight?: string;
  birthdate?: string;
  isLost?: boolean;
  rewardAmount?: string;
  ownerName: string;
  primaryPhone: string;
  hasWhatsApp?: boolean;
  backupPhone?: string;
  cityArea?: string;
  medicalAlerts: string[];
  behaviorNotes?: string;
  vetName?: string;
  vetPhone?: string;
  tagShape?: "circle" | "bone" | "shield" | "hexagon";
  tagColor?: string;
  tagline?: string;
}

export interface QROptions {
  size?: number;
  color?: string;
  bgColor?: string;
  margin?: number;
  errorCorrectionLevel?: "L" | "M" | "Q" | "H";
}

/**
 * Generates an SVG string representation of a standard, 100% scannable QR Code.
 */
export async function generateQrSvg(
  text: string,
  options: QROptions = {},
): Promise<string> {
  try {
    const svg = await QRCode.toString(text, {
      type: "svg",
      margin: options.margin !== undefined ? options.margin : 2,
      width: options.size || 300,
      color: {
        dark: options.color || "#0f172a",
        light: options.bgColor || "#ffffff",
      },
      errorCorrectionLevel: options.errorCorrectionLevel || "M",
    });
    return svg;
  } catch (err) {
    console.error("QR Code SVG generation error:", err);
    return "";
  }
}

/**
 * Generates a PNG base64 Data URL of the QR Code.
 */
export async function generateQrDataUrl(
  text: string,
  options: QROptions = {},
): Promise<string> {
  try {
    const dataUrl = await QRCode.toDataURL(text, {
      margin: options.margin !== undefined ? options.margin : 2,
      width: options.size || 1024,
      color: {
        dark: options.color || "#0f172a",
        light: options.bgColor || "#ffffff",
      },
      errorCorrectionLevel: options.errorCorrectionLevel || "M",
    });
    return dataUrl;
  } catch (err) {
    console.error("QR Code DataURL generation error:", err);
    return "";
  }
}

// -------------------------------------------------------------
// Tag URL Payload Encoding & Decoding
// -------------------------------------------------------------

export function encodePetTagPayload(data: PetTagData): string {
  try {
    const compact = {
      n: data.petName,
      s: data.species,
      b: data.breed || "",
      p: data.photoUrl || "",
      m: data.microchipNumber || "",
      l: data.isLost ? 1 : 0,
      r: data.rewardAmount || "",
      o: data.ownerName,
      ph: data.primaryPhone,
      wa: data.hasWhatsApp ? 1 : 0,
      bph: data.backupPhone || "",
      c: data.cityArea || "",
      med: data.medicalAlerts || [],
      not: data.behaviorNotes || "",
      vet: data.vetName || "",
      vp: data.vetPhone || "",
      sh: data.tagShape || "circle",
      col: data.tagColor || "#dc2626",
      tl: data.tagline || "",
    };
    const json = JSON.stringify(compact);
    const bytes = new TextEncoder().encode(json);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  } catch (err) {
    console.error("Failed to encode tag payload:", err);
    return "";
  }
}

export function decodePetTagPayload(hash: string): PetTagData | null {
  try {
    let base64 = hash.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const json = new TextDecoder().decode(bytes);
    const c = JSON.parse(json);

    return {
      petName: c.n || "Pet",
      species: c.s || "Dog",
      breed: c.b || undefined,
      photoUrl: c.p || undefined,
      microchipNumber: c.m || undefined,
      isLost: Boolean(c.l),
      rewardAmount: c.r || undefined,
      ownerName: c.o || "Pet Parent",
      primaryPhone: c.ph || "",
      hasWhatsApp: Boolean(c.wa),
      backupPhone: c.bph || undefined,
      cityArea: c.c || undefined,
      medicalAlerts: Array.isArray(c.med) ? c.med : [],
      behaviorNotes: c.not || undefined,
      vetName: c.vet || undefined,
      vetPhone: c.vp || undefined,
      tagShape: c.sh || "circle",
      tagColor: c.col || "#dc2626",
      tagline: c.tl || undefined,
    };
  } catch (err) {
    console.error("Failed to decode tag payload:", err);
    return null;
  }
}

export function generateTagPublicUrl(data: PetTagData, baseUrl?: string): string {
  const origin =
    baseUrl ||
    (typeof window !== "undefined" ? window.location.origin : "https://furtools.com");
  if (data.id) {
    return `${origin}/tag/${data.id}`;
  }
  const payload = encodePetTagPayload(data);
  return `${origin}/tag/p?data=${payload}`;
}
