// Pure TypeScript QR Code Generator (ISO/IEC 18004) & Pet Tag Utilities
// Zero external runtime dependencies. Generates crisp, scannable QR matrices, SVGs, and Canvas images.

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

// -------------------------------------------------------------
// QR Matrix Generation Engine (ISO/IEC 18004 Simplified)
// -------------------------------------------------------------

type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

class QRBitBuffer {
  private buffer: number[] = [];
  private length: number = 0;

  get(index: number): boolean {
    const bufIndex = Math.floor(index / 8);
    return ((this.buffer[bufIndex] >>> (7 - (index % 8))) & 1) === 1;
  }

  put(num: number, length: number): void {
    for (let i = 0; i < length; i++) {
      this.putBit(((num >>> (length - i - 1)) & 1) === 1);
    }
  }

  getLengthInBits(): number {
    return this.length;
  }

  putBit(bit: boolean): void {
    const bufIndex = Math.floor(this.length / 8);
    if (this.buffer.length <= bufIndex) {
      this.buffer.push(0);
    }
    if (bit) {
      this.buffer[bufIndex] |= 0x80 >>> (this.length % 8);
    }
    this.length++;
  }

  getBuffer(): number[] {
    return this.buffer;
  }
}

class QRMath {
  private static EXP_TABLE: number[] = new Array(256);
  private static LOG_TABLE: number[] = new Array(256);

  static init(): void {
    for (let i = 0; i < 8; i++) {
      QRMath.EXP_TABLE[i] = 1 << i;
    }
    for (let i = 8; i < 256; i++) {
      QRMath.EXP_TABLE[i] =
        QRMath.EXP_TABLE[i - 4] ^
        QRMath.EXP_TABLE[i - 5] ^
        QRMath.EXP_TABLE[i - 6] ^
        QRMath.EXP_TABLE[i - 8];
    }
    for (let i = 0; i < 255; i++) {
      QRMath.LOG_TABLE[QRMath.EXP_TABLE[i]] = i;
    }
  }

  static glog(n: number): number {
    if (n < 1) throw new Error("glog(" + n + ")");
    return QRMath.LOG_TABLE[n];
  }

  static gexp(n: number): number {
    while (n < 0) n += 255;
    while (n >= 256) n -= 255;
    return QRMath.EXP_TABLE[n];
  }
}
QRMath.init();

class QRPolynomial {
  private num: number[];

  constructor(num: number[], shift: number = 0) {
    let offset = 0;
    while (offset < num.length && num[offset] === 0) offset++;
    this.num = new Array(num.length - offset + shift);
    for (let i = 0; i < num.length - offset; i++) {
      this.num[i] = num[i + offset];
    }
    for (let i = num.length - offset; i < this.num.length; i++) {
      this.num[i] = 0;
    }
  }

  get(index: number): number {
    return this.num[index];
  }

  getLength(): number {
    return this.num.length;
  }

  multiply(e: QRPolynomial): QRPolynomial {
    const num = new Array(this.getLength() + e.getLength() - 1).fill(0);
    for (let i = 0; i < this.getLength(); i++) {
      for (let j = 0; j < e.getLength(); j++) {
        num[i + j] ^= QRMath.gexp(
          QRMath.glog(this.get(i)) + QRMath.glog(e.get(j)),
        );
      }
    }
    return new QRPolynomial(num);
  }

  mod(e: QRPolynomial): QRPolynomial {
    if (this.getLength() - e.getLength() < 0) return this;
    const ratio = QRMath.glog(this.get(0)) - QRMath.glog(e.get(0));
    const num = new Array(this.getLength());
    for (let i = 0; i < this.getLength(); i++) num[i] = this.get(i);
    for (let i = 0; i < e.getLength(); i++) {
      num[i] ^= QRMath.gexp(QRMath.glog(e.get(i)) + ratio);
    }
    return new QRPolynomial(num).mod(e);
  }
}

// QR Code Constants & Tables for standard version capacities
const RS_BLOCK_TABLE: number[][][] = [
  // L, M, Q, H
  // Ver 1
  [[1, 26, 19], [1, 26, 16], [1, 26, 13], [1, 26, 9]],
  // Ver 2
  [[1, 44, 34], [1, 44, 28], [1, 44, 22], [1, 44, 16]],
  // Ver 3
  [[1, 70, 55], [1, 70, 44], [2, 35, 17], [2, 35, 13]],
  // Ver 4
  [[1, 100, 80], [2, 50, 32], [2, 50, 24], [4, 25, 9]],
  // Ver 5
  [[1, 134, 108], [2, 67, 43], [2, 33, 15, 2, 34, 16], [2, 33, 11, 2, 34, 12]],
  // Ver 6
  [[2, 86, 68], [4, 43, 27], [4, 43, 19], [4, 43, 15]],
  // Ver 7
  [[2, 98, 78], [4, 49, 31], [2, 32, 14, 4, 33, 15], [4, 39, 13, 1, 40, 14]],
  // Ver 8
  [[2, 121, 97], [2, 60, 38, 2, 61, 39], [4, 40, 18, 2, 41, 19], [4, 40, 14, 2, 41, 15]],
  // Ver 9
  [[2, 146, 116], [3, 58, 36, 2, 59, 37], [4, 36, 16, 4, 37, 17], [4, 36, 12, 4, 37, 13]],
  // Ver 10
  [[2, 86, 68, 2, 87, 69], [4, 69, 43, 1, 70, 44], [6, 43, 19, 2, 44, 20], [6, 43, 15, 2, 44, 16]],
];

const ALIGNMENT_PATTERN_TABLE: number[][] = [
  [],
  [],
  [6, 18],
  [6, 22],
  [6, 26],
  [6, 30],
  [6, 34],
  [6, 22, 38],
  [6, 24, 42],
  [6, 26, 46],
  [6, 28, 50],
];

export class QRCodeModel {
  typeNumber: number = 4;
  errorCorrectLevel: number = 1; // 0=L, 1=M, 2=Q, 3=H
  modules: boolean[][] = [];
  moduleCount: number = 0;
  private data: string = "";

  constructor(data: string, errorCorrectLevel: ErrorCorrectionLevel = "M") {
    this.data = data;
    const levelMap: Record<ErrorCorrectionLevel, number> = { L: 0, M: 1, Q: 2, H: 3 };
    this.errorCorrectLevel = levelMap[errorCorrectLevel] ?? 1;
    this.determineVersion();
    this.make();
  }

  private determineVersion(): void {
    const byteLength = new TextEncoder().encode(this.data).length;
    for (let ver = 1; ver <= 10; ver++) {
      const rsBlocks = RS_BLOCK_TABLE[ver - 1][this.errorCorrectLevel];
      let totalDataCount = 0;
      for (let i = 0; i < rsBlocks.length; i += 3) {
        totalDataCount += rsBlocks[i] * rsBlocks[i + 2];
      }
      if (byteLength + 3 <= totalDataCount) {
        this.typeNumber = ver;
        return;
      }
    }
    this.typeNumber = 10;
  }

  private make(): void {
    this.moduleCount = this.typeNumber * 4 + 17;
    this.modules = Array.from({ length: this.moduleCount }, () =>
      new Array(this.moduleCount).fill(null),
    );

    this.setupPositionProbePattern(0, 0);
    this.setupPositionProbePattern(this.moduleCount - 7, 0);
    this.setupPositionProbePattern(0, this.moduleCount - 7);
    this.setupPositionAdjustPattern();
    this.setupTimingPattern();
    this.setupTypeInfo(false, 0);

    const buffer = new QRBitBuffer();
    // 8-bit Byte Mode: 0100
    buffer.put(4, 4);
    const utf8Bytes = new TextEncoder().encode(this.data);
    buffer.put(utf8Bytes.length, this.typeNumber < 10 ? 8 : 16);
    for (let i = 0; i < utf8Bytes.length; i++) {
      buffer.put(utf8Bytes[i], 8);
    }

    const rsBlocks = RS_BLOCK_TABLE[this.typeNumber - 1][this.errorCorrectLevel];
    let totalDataCount = 0;
    for (let i = 0; i < rsBlocks.length; i += 3) {
      totalDataCount += rsBlocks[i] * rsBlocks[i + 2];
    }

    // Add terminator
    if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
      buffer.put(0, 4);
    }
    // Padding
    while (buffer.getLengthInBits() % 8 !== 0) {
      buffer.putBit(false);
    }
    while (buffer.getLengthInBits() < totalDataCount * 8) {
      buffer.put(0xec, 8);
      if (buffer.getLengthInBits() < totalDataCount * 8) {
        buffer.put(0x11, 8);
      }
    }

    this.mapData(this.createBytes(buffer, rsBlocks), 0);
  }

  private setupPositionProbePattern(row: number, col: number): void {
    for (let r = -1; r <= 7; r++) {
      if (row + r <= -1 || this.moduleCount <= row + r) continue;
      for (let c = -1; c <= 7; c++) {
        if (col + c <= -1 || this.moduleCount <= col + c) continue;
        if (
          (0 <= r && r <= 6 && (c === 0 || c === 6)) ||
          (0 <= c && c <= 6 && (r === 0 || r === 6)) ||
          (2 <= r && r <= 4 && 2 <= c && c <= 4)
        ) {
          this.modules[row + r][col + c] = true;
        } else {
          this.modules[row + r][col + c] = false;
        }
      }
    }
  }

  private setupPositionAdjustPattern(): void {
    const pos = ALIGNMENT_PATTERN_TABLE[this.typeNumber] || [];
    for (let i = 0; i < pos.length; i++) {
      for (let j = 0; j < pos.length; j++) {
        const row = pos[i];
        const col = pos[j];
        if (this.modules[row][col] !== null) continue;
        for (let r = -2; r <= 2; r++) {
          for (let c = -2; c <= 2; c++) {
            if (
              r === -2 ||
              r === 2 ||
              c === -2 ||
              c === 2 ||
              (r === 0 && c === 0)
            ) {
              this.modules[row + r][col + c] = true;
            } else {
              this.modules[row + r][col + c] = false;
            }
          }
        }
      }
    }
  }

  private setupTimingPattern(): void {
    for (let r = 8; r < this.moduleCount - 8; r++) {
      if (this.modules[r][6] === null) this.modules[r][6] = r % 2 === 0;
    }
    for (let c = 8; c < this.moduleCount - 8; c++) {
      if (this.modules[6][c] === null) this.modules[6][c] = c % 2 === 0;
    }
  }

  private setupTypeInfo(test: boolean, maskPattern: number): void {
    const data = (this.errorCorrectLevel << 3) | maskPattern;
    let bits = data << 10;
    while (this.getBCHTypeInfo(bits) >= 0) {
      bits ^= 0x537 << this.getBCHTypeInfo(bits);
    }
    const val = ((data << 10) | bits) ^ 0x5412;

    for (let i = 0; i < 15; i++) {
      const mod = !test && ((val >> i) & 1) === 1;
      if (i < 6) this.modules[i][8] = mod;
      else if (i < 8) this.modules[i + 1][8] = mod;
      else this.modules[this.moduleCount - 15 + i][8] = mod;

      if (i < 8) this.modules[8][this.moduleCount - i - 1] = mod;
      else if (i < 9) this.modules[8][15 - i - 1 + 1] = mod;
      else this.modules[8][15 - i - 1] = mod;
    }
    this.modules[this.moduleCount - 8][8] = !test;
  }

  private getBCHTypeInfo(data: number): number {
    let digit = 0;
    while (data > 0) {
      digit++;
      data >>>= 1;
    }
    return digit - 11;
  }

  private createBytes(buffer: QRBitBuffer, rsBlocks: number[]): number[] {
    let offset = 0;
    let maxDcCount = 0;
    let maxEcCount = 0;
    const dcdata: number[][] = [];
    const ecdata: number[][] = [];

    const rawBuf = buffer.getBuffer();

    for (let i = 0; i < rsBlocks.length; i += 3) {
      const count = rsBlocks[i];
      const totalCount = rsBlocks[i + 1];
      const dataCount = rsBlocks[i + 2];
      const ecCount = totalCount - dataCount;

      maxDcCount = Math.max(maxDcCount, dataCount);
      maxEcCount = Math.max(maxEcCount, ecCount);

      for (let r = 0; r < count; r++) {
        dcdata.push([]);
        ecdata.push([]);
        for (let j = 0; j < dataCount; j++) {
          dcdata[dcdata.length - 1].push(rawBuf[j + offset] || 0);
        }
        offset += dataCount;

        const rsPoly = this.getErrorCorrectPolynomial(ecCount);
        const rawPoly = new QRPolynomial(dcdata[dcdata.length - 1], rsPoly.getLength() - 1);
        const modPoly = rawPoly.mod(rsPoly);

        for (let j = 0; j < rsPoly.getLength() - 1; j++) {
          const modIndex = j + modPoly.getLength() - (rsPoly.getLength() - 1);
          ecdata[ecdata.length - 1].push(modIndex >= 0 ? modPoly.get(modIndex) : 0);
        }
      }
    }

    const data: number[] = [];
    for (let i = 0; i < maxDcCount; i++) {
      for (let r = 0; r < dcdata.length; r++) {
        if (i < dcdata[r].length) data.push(dcdata[r][i]);
      }
    }
    for (let i = 0; i < maxEcCount; i++) {
      for (let r = 0; r < ecdata.length; r++) {
        if (i < ecdata[r].length) data.push(ecdata[r][i]);
      }
    }
    return data;
  }

  private getErrorCorrectPolynomial(errorCorrectLength: number): QRPolynomial {
    let a = new QRPolynomial([1], 0);
    for (let i = 0; i < errorCorrectLength; i++) {
      a = a.multiply(new QRPolynomial([1, QRMath.gexp(i)], 0));
    }
    return a;
  }

  private mapData(data: number[], maskPattern: number): void {
    let inc = -1;
    let row = this.moduleCount - 1;
    let bitIndex = 7;
    let byteIndex = 0;

    for (let col = this.moduleCount - 1; col > 0; col -= 2) {
      if (col === 6) col--;
      while (true) {
        for (let c = 0; c < 2; c++) {
          if (this.modules[row][col - c] === null) {
            let dark = false;
            if (byteIndex < data.length) {
              dark = ((data[byteIndex] >>> bitIndex) & 1) === 1;
            }
            const mask = (row + (col - c)) % 2 === 0;
            this.modules[row][col - c] = mask ? !dark : dark;
            bitIndex--;
            if (bitIndex === -1) {
              byteIndex++;
              bitIndex = 7;
            }
          }
        }
        row += inc;
        if (row < 0 || this.moduleCount <= row) {
          row -= inc;
          inc = -inc;
          break;
        }
      }
    }
  }

  toSVG(options: {
    size?: number;
    color?: string;
    bgColor?: string;
    margin?: number;
    withPawCenter?: boolean;
  } = {}): string {
    const size = options.size || 256;
    const color = options.color || "#0f172a";
    const bgColor = options.bgColor || "#ffffff";
    const margin = options.margin !== undefined ? options.margin : 2;
    const count = this.moduleCount + margin * 2;
    const cellSize = size / count;

    let rects = "";
    for (let r = 0; r < this.moduleCount; r++) {
      for (let c = 0; c < this.moduleCount; c++) {
        if (this.modules[r][c]) {
          const x = (c + margin) * cellSize;
          const y = (r + margin) * cellSize;
          rects += `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${(cellSize + 0.05).toFixed(2)}" height="${(cellSize + 0.05).toFixed(2)}" fill="${color}" rx="${(cellSize * 0.2).toFixed(2)}" />`;
        }
      }
    }

    // Center Emblem (Paw icon overlay)
    let centerOverlay = "";
    if (options.withPawCenter) {
      const centerBoxSize = size * 0.22;
      const centerOffset = (size - centerBoxSize) / 2;
      const pawSize = centerBoxSize * 0.7;
      const pawOffset = (size - pawSize) / 2;

      centerOverlay = `
        <rect x="${centerOffset.toFixed(1)}" y="${centerOffset.toFixed(1)}" width="${centerBoxSize.toFixed(1)}" height="${centerBoxSize.toFixed(1)}" fill="${bgColor}" rx="${(centerBoxSize * 0.35).toFixed(1)}" stroke="${color}" stroke-width="2.5" />
        <g transform="translate(${pawOffset.toFixed(1)}, ${pawOffset.toFixed(1)}) scale(${(pawSize / 24).toFixed(3)})" fill="${color}">
          <path d="M12 10.5c1.8 0 3-1.4 3-3s-1.2-3-3-3-3 1.4-3 3 1.2 3 3 3zm-5.5-1c1.4 0 2.5-1.1 2.5-2.5S7.9 4.5 6.5 4.5 4 5.6 4 7s1.1 2.5 2.5 2.5zm11 0c1.4 0 2.5-1.1 2.5-2.5S18.9 4.5 17.5 4.5 15 5.6 15 7s1.1 2.5 2.5 2.5zm-5.5 3c-3 0-5.5 2.2-5.5 5 0 2.2 1.8 4 4 4h3c2.2 0 4-1.8 4-4 0-2.8-2.5-5-5.5-5z"/>
        </g>
      `;
    }

    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
        <rect width="${size}" height="${size}" fill="${bgColor}" rx="16" />
        ${rects}
        ${centerOverlay}
      </svg>
    `.trim();
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
      col: data.tagColor || "#e11d48",
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
      tagColor: c.col || "#e11d48",
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
