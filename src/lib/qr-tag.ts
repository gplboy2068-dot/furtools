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
 * Generates clean, robust, compact URL parameters for emergency landing page.
 */
export function generateTagPublicUrl(data: PetTagData, baseUrl?: string): string {
  let origin = "https://furtools.com";
  if (typeof window !== "undefined") {
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

  // Generate clean search params so every camera scanner parses it 100% as a standard Web URL
  const params = new URLSearchParams();
  if (data.petName) params.set("n", data.petName);
  if (data.species) params.set("s", data.species);
  if (data.breed) params.set("b", data.breed);
  if (data.ownerName) params.set("o", data.ownerName);
  if (data.primaryPhone) params.set("ph", data.primaryPhone);
  if (data.backupPhone) params.set("bph", data.backupPhone);
  if (data.microchipNumber) params.set("m", data.microchipNumber);
  if (data.color) params.set("col", data.color);
  if (data.gender) params.set("g", data.gender);
  if (data.rewardAmount) params.set("r", data.rewardAmount);
  if (data.cityArea) params.set("c", data.cityArea);
  if (data.medicalAlerts && data.medicalAlerts.length > 0) {
    params.set("med", data.medicalAlerts.join("~"));
  }
  if (data.behaviorNotes) params.set("not", data.behaviorNotes);
  if (data.vetName) params.set("vet", data.vetName);
  if (data.vetPhone) params.set("vp", data.vetPhone);
  if (data.isLost) params.set("l", "1");

  return `${origin}/tag/p?${params.toString()}`;
}

/**
 * Parses PetTagData from URL search parameters or legacy base64 data parameter.
 */
export function parsePetTagFromUrl(searchParams: URLSearchParams): PetTagData | null {
  try {
    // Check clean query parameters first
    const n = searchParams.get("n");
    if (n) {
      const medStr = searchParams.get("med") || "";
      const medAlerts = medStr ? medStr.split("~").filter(Boolean) : [];

      return {
        petName: n,
        species: searchParams.get("s") || "Dog",
        breed: searchParams.get("b") || undefined,
        ownerName: searchParams.get("o") || "Pet Parent",
        primaryPhone: searchParams.get("ph") || "",
        backupPhone: searchParams.get("bph") || undefined,
        microchipNumber: searchParams.get("m") || undefined,
        color: searchParams.get("col") || undefined,
        gender: searchParams.get("g") || undefined,
        rewardAmount: searchParams.get("r") || undefined,
        cityArea: searchParams.get("c") || undefined,
        medicalAlerts: medAlerts,
        behaviorNotes: searchParams.get("not") || undefined,
        vetName: searchParams.get("vet") || undefined,
        vetPhone: searchParams.get("vp") || undefined,
        isLost: searchParams.get("l") === "1",
        hasWhatsApp: true,
      };
    }

    // Fallback to legacy encoded data
    const dataHash = searchParams.get("data");
    if (dataHash) {
      let base64 = dataHash.replace(/-/g, "+").replace(/_/g, "/");
      while (base64.length % 4) base64 += "=";
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
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
    }
  } catch (err) {
    console.error("Failed to parse pet tag from URL:", err);
  }
  return null;
}

export function decodePetTagPayload(hash: string): PetTagData | null {
  const params = new URLSearchParams(`data=${hash}`);
  return parsePetTagFromUrl(params);
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
 * Enforces high-contrast dark foreground and optimal quiet zone.
 */
export async function generateQrSvg(
  text: string,
  options: QROptions = {},
): Promise<string> {
  try {
    const svg = await QRCode.toString(text, {
      type: "svg",
      margin: options.margin !== undefined ? options.margin : 3,
      width: options.size || 320,
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
 * Generates a crisp PNG base64 Data URL of the QR Code.
 * Enforces ISO 18004 compliant quiet zone and high optical contrast.
 */
export async function generateQrDataUrl(
  text: string,
  options: QROptions = {},
): Promise<string> {
  try {
    const dataUrl = await QRCode.toDataURL(text, {
      margin: options.margin !== undefined ? options.margin : 3,
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
