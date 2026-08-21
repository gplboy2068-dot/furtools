import QRCode from "qrcode";

export type QrActionType = "web" | "call" | "whatsapp" | "vcard" | "text";

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
  qrActionType?: QrActionType;
}

export interface QROptions {
  size?: number;
  color?: string;
  bgColor?: string;
  margin?: number;
  errorCorrectionLevel?: "L" | "M" | "Q" | "H";
}

/**
 * Sanitizes phone numbers for standard tel: and wa.me protocols.
 */
export function cleanPhoneNumber(phone: string): string {
  return (phone || "").replace(/[^0-9+]/g, "");
}

/**
 * Generates standard vCard 3.0 format for contacts.
 */
export function generateVCard(data: PetTagData): string {
  const phone = cleanPhoneNumber(data.primaryPhone);
  const backup = cleanPhoneNumber(data.backupPhone || "");
  const alerts = (data.medicalAlerts || []).join(", ");
  const notes = [
    data.isLost ? "🚨 LOST PET ALERT!" : "Pet Contact Tag",
    `Pet: ${data.petName} (${data.breed || data.species})`,
    data.microchipNumber ? `Microchip: ${data.microchipNumber}` : "",
    alerts ? `Medical Alerts: ${alerts}` : "",
    data.rewardAmount ? `Reward: ${data.rewardAmount}` : "",
    data.behaviorNotes ? `Notes: ${data.behaviorNotes}` : "",
  ]
    .filter(Boolean)
    .join(" | ");

  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${data.petName} (Lost Pet);Owner: ${data.ownerName};;;`,
    `FN:LOST PET: ${data.petName} (Owner: ${data.ownerName})`,
    `ORG:Pet Safety Contact`,
    `TEL;TYPE=CELL,VOICE:${phone}`,
    backup ? `TEL;TYPE=HOME,VOICE:${backup}` : "",
    data.cityArea ? `ADR;TYPE=HOME:;;${data.cityArea};;;;` : "",
    `NOTE:${notes}`,
    "END:VCARD",
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * Generates simple emergency text summary.
 */
export function generateEmergencyText(data: PetTagData): string {
  const alerts = (data.medicalAlerts || []).join(", ");
  return [
    `🚨 LOST PET: ${data.petName} (${data.breed || data.species})`,
    `Owner: ${data.ownerName}`,
    `Primary Phone: ${data.primaryPhone}`,
    data.backupPhone ? `Backup Phone: ${data.backupPhone}` : "",
    data.microchipNumber ? `Microchip ID: ${data.microchipNumber}` : "",
    alerts ? `Critical Medical: ${alerts}` : "",
    data.rewardAmount ? `Reward: ${data.rewardAmount}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * Encodes full pet data into a portable base64 URL payload.
 */
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
  // Use production domain or window origin if available
  let origin = "https://furtools.com";
  if (typeof window !== "undefined") {
    // If not localhost, use the actual domain
    if (!window.location.hostname.includes("localhost") && !window.location.hostname.includes("127.0.0.1")) {
      origin = window.location.origin;
    }
  }
  if (baseUrl) {
    origin = baseUrl;
  }

  if (data.id) {
    return `${origin}/tag/${data.id}`;
  }
  const payload = encodePetTagPayload(data);
  return `${origin}/tag/p?data=${payload}`;
}

/**
 * Returns the exact scannable payload according to the selected QR Action Type.
 */
export function getQrScannableContent(data: PetTagData, actionType: QrActionType = "web"): string {
  const phone = cleanPhoneNumber(data.primaryPhone);

  switch (actionType) {
    case "call":
      return `tel:${phone}`;

    case "whatsapp": {
      const msg = encodeURIComponent(
        `Hello ${data.ownerName}, I found your lost pet ${data.petName}! Please reply so we can reunite.`,
      );
      return `https://wa.me/${phone.replace(/^\+/, "")}?text=${msg}`;
    }

    case "vcard":
      return generateVCard(data);

    case "text":
      return generateEmergencyText(data);

    case "web":
    default:
      return generateTagPublicUrl(data);
  }
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
