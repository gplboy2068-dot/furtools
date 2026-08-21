import { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  generateQrSvg,
  generateQrDataUrl,
  type PetTagData,
  generateTagPublicUrl,
} from "@/lib/qr-tag";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  QrCode,
  Smartphone,
  Printer,
  Download,
  Copy,
  Check,
  Sparkles,
  Phone,
  MessageCircle,
  MapPin,
  AlertTriangle,
  Heart,
  ShieldCheck,
  ExternalLink,
  RotateCcw,
  Palette,
  FileText,
  Plus,
  Trash2,
  Share2,
} from "lucide-react";

const COMMON_MEDICAL_ALERTS = [
  "Diabetic (Requires Daily Insulin)",
  "Severe Food Allergy (No treats!)",
  "Deaf / Hard of Hearing",
  "Blind / Visually Impaired",
  "Daily Heart / Seizure Medication",
  "Nervous & Skittish (Do not chase)",
  "Friendly & Gentle with Kids",
  "Needs Immediate Veterinary Care",
  "Microchipped",
];

const THEME_COLORS = [
  { name: "Alert Crimson", value: "#dc2626", text: "text-red-600", bg: "bg-red-600" },
  { name: "Sapphire Blue", value: "#2563eb", text: "text-blue-600", bg: "bg-blue-600" },
  { name: "Sunset Amber", value: "#d97706", text: "text-amber-600", bg: "bg-amber-600" },
  { name: "Emerald Forest", value: "#059669", text: "text-emerald-600", bg: "bg-emerald-600" },
  { name: "Royal Purple", value: "#7c3aed", text: "text-purple-600", bg: "bg-purple-600" },
  { name: "Midnight Slate", value: "#0f172a", text: "text-slate-900", bg: "bg-slate-900" },
  { name: "Hot Coral", value: "#ea580c", text: "text-orange-600", bg: "bg-orange-600" },
];

export function SmartCollarQRTool() {
  const [petName, setPetName] = useState("Buddy");
  const [species, setSpecies] = useState("Dog");
  const [breed, setBreed] = useState("Golden Retriever");
  const [photoUrl, setPhotoUrl] = useState(
    "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80",
  );
  const [microchipNumber, setMicrochipNumber] = useState("985141002348912");
  const [gender, setGender] = useState("Male");
  const [color, setColor] = useState("Golden Cream");
  const [isLost, setIsLost] = useState(true);
  const [rewardAmount, setRewardAmount] = useState("$250 Reward");

  // Owner Contacts
  const [ownerName, setOwnerName] = useState("Sarah Jenkins");
  const [primaryPhone, setPrimaryPhone] = useState("+1 (555) 234-5678");
  const [hasWhatsApp, setHasWhatsApp] = useState(true);
  const [backupPhone, setBackupPhone] = useState("+1 (555) 876-5432");
  const [cityArea, setCityArea] = useState("Austin, TX (Downtown Area)");

  // Medical & Behavior
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([
    "Diabetic (Requires Daily Insulin)",
    "Friendly & Gentle with Kids",
    "Microchipped",
  ]);
  const [customAlertInput, setCustomAlertInput] = useState("");
  const [behaviorNotes, setBehaviorNotes] = useState(
    "Buddy loves squeaky toys and peanut butter. He might be timid if approached quickly—please call our number immediately.",
  );
  const [vetName, setVetName] = useState("Central Animal Hospital");
  const [vetPhone, setVetPhone] = useState("+1 (555) 999-8877");

  // Tag Styling
  const [tagShape, setTagShape] = useState<"circle" | "bone" | "shield" | "hexagon">("circle");
  const [tagColor, setTagColor] = useState("#dc2626");
  const [tagline, setTagline] = useState("IF I AM ALONE, I AM LOST! SCAN ME.");

  // Preview & Export State
  const [previewTab, setPreviewTab] = useState<"collar" | "mobile" | "flyer">("collar");
  const [tagSide, setTagSide] = useState<"front" | "back">("front");
  const [copied, setCopied] = useState(false);

  const tagData: PetTagData = useMemo(
    () => ({
      petName,
      species,
      breed,
      photoUrl,
      microchipNumber,
      gender,
      color,
      isLost,
      rewardAmount,
      ownerName,
      primaryPhone,
      hasWhatsApp,
      backupPhone,
      cityArea,
      medicalAlerts: selectedAlerts,
      behaviorNotes,
      vetName,
      vetPhone,
      tagShape,
      tagColor,
      tagline,
    }),
    [
      petName,
      species,
      breed,
      photoUrl,
      microchipNumber,
      gender,
      color,
      isLost,
      rewardAmount,
      ownerName,
      primaryPhone,
      hasWhatsApp,
      backupPhone,
      cityArea,
      selectedAlerts,
      behaviorNotes,
      vetName,
      vetPhone,
      tagShape,
      tagColor,
      tagline,
    ],
  );

  const publicUrl = useMemo(() => generateTagPublicUrl(tagData), [tagData]);

  const [qrSvgString, setQrSvgString] = useState<string>("");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    let active = true;
    generateQrSvg(publicUrl, {
      size: 320,
      color: tagColor === "#ffffff" ? "#0f172a" : tagColor,
      bgColor: "#ffffff",
      margin: 2,
      errorCorrectionLevel: "M",
    }).then((svg) => {
      if (active) setQrSvgString(svg);
    });

    generateQrDataUrl(publicUrl, {
      size: 1024,
      color: tagColor === "#ffffff" ? "#0f172a" : tagColor,
      bgColor: "#ffffff",
      margin: 2,
      errorCorrectionLevel: "M",
    }).then((url) => {
      if (active) setQrDataUrl(url);
    });

    return () => {
      active = false;
    };
  }, [publicUrl, tagColor]);

  function toggleAlert(alertText: string) {
    setSelectedAlerts((prev) =>
      prev.includes(alertText)
        ? prev.filter((a) => a !== alertText)
        : [...prev, alertText],
    );
  }

  function addCustomAlert() {
    if (!customAlertInput.trim()) return;
    if (!selectedAlerts.includes(customAlertInput.trim())) {
      setSelectedAlerts([...selectedAlerts, customAlertInput.trim()]);
    }
    setCustomAlertInput("");
  }

  function copyTagLink() {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    toast.success("Emergency Tag Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  }

  function downloadQrPng() {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.download = `${petName.toLowerCase()}-smart-collar-qr.png`;
    a.href = qrDataUrl;
    a.click();
    toast.success("High-Resolution QR Code PNG downloaded!");
  }

  function downloadQrSvg() {
    const blob = new Blob([qrSvgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.download = `${petName.toLowerCase()}-collar-qr.svg`;
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Vector SVG downloaded!");
  }

  function printCollarTagSheet() {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${petName} - Smart Collar Tag Kit</title>
          <style>
            @page { size: letter portrait; margin: 15mm; }
            body { font-family: system-ui, -apple-system, sans-serif; color: #0f172a; margin: 0; padding: 20px; }
            h1 { font-size: 22px; margin: 0 0 4px 0; color: ${tagColor}; }
            p { margin: 0 0 16px 0; font-size: 13px; color: #64748b; }
            .grid { display: flex; gap: 20px; flex-wrap: wrap; margin-top: 20px; }
            .tag-card {
              width: 240px;
              border: 2px dashed #94a3b8;
              border-radius: 16px;
              padding: 16px;
              text-align: center;
              page-break-inside: avoid;
              background: #fafafa;
            }
            .tag-title { font-weight: bold; font-size: 16px; margin-bottom: 6px; }
            .qr-box { width: 140px; height: 140px; margin: 0 auto 10px auto; }
            .cut-line { font-size: 10px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
            .collar-strip {
              width: 100%;
              max-width: 500px;
              border: 2px dashed #cbd5e1;
              border-radius: 8px;
              padding: 12px 16px;
              margin-top: 24px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              background: white;
            }
            .strip-text { font-size: 13px; font-weight: bold; }
            @media print {
              .no-print { display: none; }
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <h1>🐾 FurTools Smart Collar Tag Kit: ${petName}</h1>
          <p>Cut along dashed lines. Laminate or slide inside clear collar pouches, key rings, or luggage tags.</p>

          <div class="grid">
            <div class="tag-card">
              <div class="cut-line">✂️ Cut Along Dashed Border (Front)</div>
              <div class="qr-box">${qrSvgString}</div>
              <div class="tag-title">${petName}</div>
              <div style="font-size: 11px; font-weight: 600; color: ${tagColor};">${tagline}</div>
            </div>

            <div class="tag-card">
              <div class="cut-line">✂️ Cut Along Dashed Border (Back)</div>
              <div style="margin-top: 10px;">
                <div style="font-size: 18px; font-weight: bold; color: ${tagColor};">${petName}</div>
                <div style="font-size: 12px; color: #64748b; margin-bottom: 12px;">${breed || species}</div>
                <div style="font-size: 13px; font-weight: bold; margin-bottom: 4px;">📞 ${primaryPhone}</div>
                ${backupPhone ? `<div style="font-size: 11px; color: #475569; margin-bottom: 8px;">Alt: ${backupPhone}</div>` : ""}
                ${microchipNumber ? `<div style="font-size: 10px; color: #64748b;">Microchip: ${microchipNumber}</div>` : ""}
                ${rewardAmount ? `<div style="margin-top: 10px; background: #fef2f2; color: #b91c1c; font-size: 11px; font-weight: bold; padding: 4px 8px; border-radius: 6px; display: inline-block;">${rewardAmount}</div>` : ""}
              </div>
            </div>
          </div>

          <div class="collar-strip">
            <div>
              <div class="cut-line">✂️ Collar Slide-In Strip</div>
              <div class="strip-text">${petName} | REWARD | Call ${primaryPhone}</div>
              <div style="font-size: 10px; color: #64748b;">Scan QR on reverse for medical alerts & vet data</div>
            </div>
            <div style="width: 60px; height: 60px;">
              ${qrSvgString}
            </div>
          </div>

          <script>
            window.onload = () => { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }

  function printLostPetFlyer() {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>LOST PET FLYER: ${petName}</title>
          <style>
            @page { size: letter portrait; margin: 10mm; }
            body { font-family: system-ui, -apple-system, sans-serif; color: #0f172a; margin: 0; padding: 0; text-align: center; }
            .header-banner { background: ${tagColor}; color: white; padding: 18px; font-size: 42px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; border-radius: 12px; margin-bottom: 16px; }
            .pet-img { width: 280px; height: 280px; object-fit: cover; border-radius: 16px; border: 4px solid #0f172a; margin-bottom: 12px; }
            .pet-name { font-size: 38px; font-weight: 900; margin: 0; line-height: 1; color: #0f172a; }
            .pet-sub { font-size: 20px; color: #475569; margin: 4px 0 16px 0; font-weight: 600; }
            .reward-box { background: #fef2f2; border: 3px solid #dc2626; color: #dc2626; font-size: 28px; font-weight: 900; padding: 10px 24px; border-radius: 12px; display: inline-block; margin-bottom: 16px; }
            .contact-box { background: #f8fafc; border: 2px solid #cbd5e1; border-radius: 16px; padding: 16px; max-width: 600px; margin: 0 auto 20px auto; }
            .phone-large { font-size: 32px; font-weight: 900; color: #0f172a; margin: 4px 0; }
            .grid-bottom { display: flex; justify-content: center; align-items: center; gap: 24px; max-width: 600px; margin: 0 auto; text-align: left; }
            .qr-frame { width: 140px; height: 140px; flex-shrink: 0; }
            .details-text { font-size: 14px; line-height: 1.5; color: #334155; }
          </style>
        </head>
        <body>
          <div class="header-banner">🚨 LOST ${species.toUpperCase()} 🚨</div>
          ${photoUrl ? `<img src="${photoUrl}" class="pet-img" alt="${petName}" />` : ""}
          <div class="pet-name">${petName}</div>
          <div class="pet-sub">${breed || species} ${color ? `· ${color}` : ""} ${cityArea ? `· Last seen: ${cityArea}` : ""}</div>

          ${rewardAmount ? `<div class="reward-box">💰 ${rewardAmount}</div>` : ""}

          <div class="contact-box">
            <div style="font-size: 14px; text-transform: uppercase; font-weight: bold; color: #64748b;">If seen or found, please call immediately:</div>
            <div class="phone-large">📞 ${primaryPhone}</div>
            ${backupPhone ? `<div style="font-size: 16px; font-weight: 600; color: #475569;">Alternate Contact: ${backupPhone} (${ownerName})</div>` : ""}
          </div>

          <div class="grid-bottom">
            <div class="qr-frame">${qrSvgString}</div>
            <div class="details-text">
              <strong>SCAN QR CODE WITH ANY PHONE CAMERA</strong><br/>
              • Instant 1-tap call & WhatsApp<br/>
              • Send GPS pin where found<br/>
              • View vital medical alerts & microchip ID<br/>
              ${behaviorNotes ? `<div style="margin-top: 6px; font-size: 12px; color: #64748b;"><em>Note: ${behaviorNotes}</em></div>` : ""}
            </div>
          </div>

          <script>
            window.onload = () => { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-background p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Badge className="bg-primary/20 text-primary border-primary/30 mb-2 gap-1.5 font-semibold">
              <QrCode className="size-3.5" /> Next-Gen Pet Safety System
            </Badge>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Smart Collar QR Code & Lost Pet Tag Generator
            </h2>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl">
              Create a free, scannable QR collar tag for your pet. If they ever get lost, anyone who scans the tag with their phone can instantly call you, WhatsApp you, and share their GPS location with one tap.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            <Button
              onClick={printCollarTagSheet}
              variant="outline"
              className="rounded-full gap-1.5 shadow-xs"
            >
              <Printer className="size-4" /> Print Tag Kit
            </Button>
            <Button
              onClick={downloadQrPng}
              className="rounded-full gap-1.5 shadow-sm"
            >
              <Download className="size-4" /> Download QR
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Input Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Pet Identification */}
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-display font-semibold text-base flex items-center gap-2">
                <Heart className="size-4 text-primary" /> 1. Pet Profile
              </h3>
              <span className="text-xs text-muted-foreground">Basic ID</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="petName" className="text-xs font-semibold">
                  Pet Name *
                </Label>
                <Input
                  id="petName"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  placeholder="e.g. Buddy, Luna, Milo"
                  className="mt-1 font-semibold"
                />
              </div>

              <div>
                <Label htmlFor="species" className="text-xs font-semibold">
                  Species
                </Label>
                <Input
                  id="species"
                  value={species}
                  onChange={(e) => setSpecies(e.target.value)}
                  placeholder="Dog, Cat, Bird, Ferret"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="breed" className="text-xs font-semibold">
                  Breed
                </Label>
                <Input
                  id="breed"
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  placeholder="e.g. Golden Retriever"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="color" className="text-xs font-semibold">
                  Color / Markings
                </Label>
                <Input
                  id="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="e.g. Golden Cream, White Chest"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="microchip" className="text-xs font-semibold">
                  Microchip Number
                </Label>
                <Input
                  id="microchip"
                  value={microchipNumber}
                  onChange={(e) => setMicrochipNumber(e.target.value)}
                  placeholder="15-digit ISO number"
                  className="mt-1 font-mono text-xs"
                />
              </div>

              <div>
                <Label htmlFor="photo" className="text-xs font-semibold">
                  Photo URL
                </Label>
                <Input
                  id="photo"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://..."
                  className="mt-1 text-xs"
                />
              </div>
            </div>
          </div>

          {/* 2. Emergency Contacts */}
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-display font-semibold text-base flex items-center gap-2">
                <Phone className="size-4 text-emerald-500" /> 2. Emergency Contacts & Reward
              </h3>
              <span className="text-xs text-muted-foreground">Reunion Info</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ownerName" className="text-xs font-semibold">
                  Owner / Family Name *
                </Label>
                <Input
                  id="ownerName"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="Sarah Jenkins"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="primaryPhone" className="text-xs font-semibold">
                  Primary Contact Phone *
                </Label>
                <Input
                  id="primaryPhone"
                  value={primaryPhone}
                  onChange={(e) => setPrimaryPhone(e.target.value)}
                  placeholder="+1 (555) 234-5678"
                  className="mt-1 font-mono"
                />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border bg-muted/30 p-3 sm:col-span-2">
                <div className="space-y-0.5">
                  <Label htmlFor="hasWhatsApp" className="text-xs font-semibold cursor-pointer">
                    Enable WhatsApp 1-Tap Messaging & Location Pin
                  </Label>
                  <p className="text-[11px] text-muted-foreground">
                    Allows the finder to send their exact GPS pin and photos directly via WhatsApp.
                  </p>
                </div>
                <Switch
                  id="hasWhatsApp"
                  checked={hasWhatsApp}
                  onCheckedChange={setHasWhatsApp}
                />
              </div>

              <div>
                <Label htmlFor="backupPhone" className="text-xs font-semibold">
                  Alternate / Backup Phone
                </Label>
                <Input
                  id="backupPhone"
                  value={backupPhone}
                  onChange={(e) => setBackupPhone(e.target.value)}
                  placeholder="+1 (555) 876-5432"
                  className="mt-1 font-mono"
                />
              </div>

              <div>
                <Label htmlFor="cityArea" className="text-xs font-semibold">
                  Home City / Neighborhood
                </Label>
                <Input
                  id="cityArea"
                  value={cityArea}
                  onChange={(e) => setCityArea(e.target.value)}
                  placeholder="Austin, TX"
                  className="mt-1"
                />
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="rewardAmount" className="text-xs font-semibold">
                  Reward Notice (Optional incentive)
                </Label>
                <Input
                  id="rewardAmount"
                  value={rewardAmount}
                  onChange={(e) => setRewardAmount(e.target.value)}
                  placeholder="e.g. $250 Reward for Safe Return"
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* 3. Medical & Safety Alerts */}
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-display font-semibold text-base flex items-center gap-2">
                <AlertTriangle className="size-4 text-amber-500" /> 3. Medical & Behavioral Alerts
              </h3>
              <span className="text-xs text-muted-foreground">Critical Care</span>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-semibold">Quick-Select Health & Behavior Badges:</Label>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_MEDICAL_ALERTS.map((alert) => {
                  const isSelected = selectedAlerts.includes(alert);
                  return (
                    <button
                      key={alert}
                      type="button"
                      onClick={() => toggleAlert(alert)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                        isSelected
                          ? "bg-amber-500/15 text-amber-900 dark:text-amber-300 border-amber-500/40 font-semibold shadow-xs"
                          : "bg-muted/40 hover:bg-muted border-border text-muted-foreground"
                      }`}
                    >
                      {isSelected ? "✓ " : "+ "}
                      {alert}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-2 pt-2">
                <Input
                  placeholder="Add custom medical alert or medication..."
                  value={customAlertInput}
                  onChange={(e) => setCustomAlertInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCustomAlert();
                    }
                  }}
                  className="text-xs"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={addCustomAlert}
                  className="shrink-0 gap-1"
                >
                  <Plus className="size-3.5" /> Add
                </Button>
              </div>

              <div>
                <Label htmlFor="behaviorNotes" className="text-xs font-semibold">
                  Finder Instructions & Temperament Notes
                </Label>
                <Textarea
                  id="behaviorNotes"
                  value={behaviorNotes}
                  onChange={(e) => setBehaviorNotes(e.target.value)}
                  rows={2}
                  placeholder="How should a stranger approach your pet? Any favorite treats or fears?"
                  className="mt-1 text-xs leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <Label htmlFor="vetName" className="text-xs font-semibold">
                    Primary Vet Clinic
                  </Label>
                  <Input
                    id="vetName"
                    value={vetName}
                    onChange={(e) => setVetName(e.target.value)}
                    placeholder="Central Animal Hospital"
                    className="mt-1 text-xs"
                  />
                </div>
                <div>
                  <Label htmlFor="vetPhone" className="text-xs font-semibold">
                    Vet Phone Number
                  </Label>
                  <Input
                    id="vetPhone"
                    value={vetPhone}
                    onChange={(e) => setVetPhone(e.target.value)}
                    placeholder="+1 (555) 999-8877"
                    className="mt-1 text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 4. Tag Visual Customizer */}
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-display font-semibold text-base flex items-center gap-2">
                <Palette className="size-4 text-primary" /> 4. Tag Styling & Colors
              </h3>
              <span className="text-xs text-muted-foreground">Appearance</span>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-xs font-semibold mb-2 block">Theme Color</Label>
                <div className="flex flex-wrap gap-2">
                  {THEME_COLORS.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setTagColor(c.value)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                        tagColor === c.value
                          ? "border-primary ring-2 ring-primary/20 bg-accent shadow-xs"
                          : "border-border bg-card hover:bg-muted/50"
                      }`}
                    >
                      <span className={`size-3 rounded-full ${c.bg}`} />
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold mb-2 block">Tag Shape</Label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: "circle", label: "Circle ⚪" },
                    { id: "bone", label: "Bone 🦴" },
                    { id: "shield", label: "Shield 🛡️" },
                    { id: "hexagon", label: "Hexagon ⬡" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setTagShape(s.id as any)}
                      className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-all ${
                        tagShape === s.id
                          ? "bg-primary text-primary-foreground border-primary shadow-xs"
                          : "bg-muted/30 border-border hover:bg-muted"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="tagline" className="text-xs font-semibold">
                  Collar Tag Action Headline
                </Label>
                <Input
                  id="tagline"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="IF I AM ALONE, I AM LOST! SCAN ME."
                  className="mt-1 text-xs uppercase font-bold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Interactive Previews & Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-base flex items-center gap-2">
                <Sparkles className="size-4 text-primary" /> Live Preview
              </h3>
              <Tabs
                value={previewTab}
                onValueChange={(v) => setPreviewTab(v as any)}
                className="w-auto"
              >
                <TabsList className="h-8">
                  <TabsTrigger value="collar" className="text-xs">
                    Collar Tag
                  </TabsTrigger>
                  <TabsTrigger value="mobile" className="text-xs">
                    Finder View
                  </TabsTrigger>
                  <TabsTrigger value="flyer" className="text-xs">
                    Poster
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* TAB 1: Physical Collar Tag Mockup */}
            {previewTab === "collar" && (
              <div className="space-y-4">
                <div className="flex justify-center py-6 bg-gradient-to-b from-muted/50 via-muted/20 to-background rounded-2xl border border-border/80 relative overflow-hidden">
                  {/* Metallic Ring Top Hook */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <div className="size-6 rounded-full border-4 border-slate-400 bg-slate-200 shadow-inner" />
                    <div className="w-1 h-3 bg-slate-400 -mt-1" />
                  </div>

                  {/* Physical Tag Body */}
                  <div
                    className={`mt-6 w-64 p-5 text-center shadow-xl border-4 transition-all duration-300 ${
                      tagShape === "circle"
                        ? "rounded-full aspect-square flex flex-col items-center justify-center"
                        : tagShape === "bone"
                          ? "rounded-3xl aspect-square flex flex-col items-center justify-center border-double"
                          : tagShape === "shield"
                            ? "rounded-b-3xl rounded-t-xl aspect-square flex flex-col items-center justify-center"
                            : "rounded-2xl aspect-square flex flex-col items-center justify-center"
                    }`}
                    style={{
                      borderColor: tagColor,
                      backgroundColor: "#ffffff",
                    }}
                  >
                    {tagSide === "front" ? (
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="size-36 p-1 bg-white rounded-xl shadow-xs">
                          <div
                            className="size-full [&>svg]:size-full"
                            dangerouslySetInnerHTML={{ __html: qrSvgString }}
                          />
                        </div>
                        <div
                          className="font-black text-xs uppercase tracking-tight px-2 leading-tight"
                          style={{ color: tagColor }}
                        >
                          {tagline}
                        </div>
                        <div className="text-[10px] font-bold text-slate-800">
                          {petName}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center space-y-2 p-2">
                        <div
                          className="font-black text-2xl leading-none"
                          style={{ color: tagColor }}
                        >
                          {petName}
                        </div>
                        <div className="text-xs text-muted-foreground font-medium">
                          {breed || species}
                        </div>
                        <div className="h-px w-24 bg-border my-1" />
                        <div className="text-xs font-bold text-slate-900">
                          📞 {primaryPhone}
                        </div>
                        {backupPhone && (
                          <div className="text-[10px] text-muted-foreground">
                            Alt: {backupPhone}
                          </div>
                        )}
                        {rewardAmount && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                            {rewardAmount}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-full text-xs gap-1.5"
                    onClick={() => setTagSide(tagSide === "front" ? "back" : "front")}
                  >
                    <RotateCcw className="size-3.5" /> Flip Tag ({tagSide === "front" ? "Front" : "Back"})
                  </Button>
                </div>
              </div>
            )}

            {/* TAB 2: Mobile Emergency Finder Screen */}
            {previewTab === "mobile" && (
              <div className="rounded-2xl border-4 border-slate-800 bg-slate-900 p-2 shadow-xl max-w-xs mx-auto">
                <div className="rounded-xl bg-background overflow-hidden text-left border border-border">
                  {/* Phone Status Bar */}
                  <div className="bg-slate-950 text-white text-[10px] px-3 py-1 flex justify-between">
                    <span>9:41</span>
                    <span>5G • 100%</span>
                  </div>

                  {/* Red Emergency Header */}
                  <div className="bg-red-600 text-white p-3 text-center">
                    <div className="text-[11px] font-black tracking-widest uppercase">
                      🚨 LOST PET ALERT 🚨
                    </div>
                    <div className="text-xs opacity-90">Please help me get home!</div>
                  </div>

                  <div className="p-3.5 space-y-3">
                    {/* Pet Row */}
                    <div className="flex items-center gap-3">
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt=""
                          className="size-12 rounded-xl object-cover border border-border"
                        />
                      ) : (
                        <div className="size-12 rounded-xl bg-muted flex items-center justify-center text-lg">
                          🐾
                        </div>
                      )}
                      <div>
                        <div className="font-display font-bold text-base leading-tight">
                          {petName}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {breed || species} {color ? `· ${color}` : ""}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-1.5 pt-1">
                      <div className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-center text-xs flex items-center justify-center gap-1.5 shadow-xs">
                        <Phone className="size-3.5" /> Call Owner ({primaryPhone})
                      </div>
                      {hasWhatsApp && (
                        <div className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-1.5 rounded-xl text-center text-[11px] flex items-center justify-center gap-1.5 shadow-xs">
                          <MessageCircle className="size-3.5" /> WhatsApp Owner
                        </div>
                      )}
                      <div className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 rounded-xl text-center text-[11px] flex items-center justify-center gap-1.5 shadow-xs">
                        <MapPin className="size-3.5" /> Share My GPS Pin
                      </div>
                    </div>

                    {/* Medical Badges */}
                    {selectedAlerts.length > 0 && (
                      <div className="pt-1">
                        <div className="text-[10px] font-bold text-red-600 uppercase mb-1">
                          Medical & Safety:
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {selectedAlerts.map((a) => (
                            <span
                              key={a}
                              className="text-[9px] font-semibold bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 px-1.5 py-0.5 rounded-md"
                            >
                              {a}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Printable Lost Pet Flyer Preview */}
            {previewTab === "flyer" && (
              <div className="border border-border rounded-xl p-4 bg-white text-slate-900 text-center space-y-2 text-xs shadow-inner">
                <div
                  className="font-black text-lg uppercase tracking-wider py-1 px-2 rounded-md text-white"
                  style={{ backgroundColor: tagColor }}
                >
                  🚨 LOST {species.toUpperCase()} 🚨
                </div>
                {photoUrl && (
                  <img
                    src={photoUrl}
                    alt=""
                    className="size-24 rounded-lg object-cover mx-auto border-2 border-slate-900"
                  />
                )}
                <div className="font-extrabold text-xl leading-tight">{petName}</div>
                <div className="text-xs text-slate-600 font-medium">{breed}</div>
                {rewardAmount && (
                  <div className="font-black text-red-600 bg-red-50 py-0.5 rounded text-xs border border-red-200">
                    💰 {rewardAmount}
                  </div>
                )}
                <div className="p-2 bg-slate-100 rounded-lg font-bold text-xs">
                  Call: {primaryPhone}
                </div>
                <div className="size-20 mx-auto">
                  <div
                    className="size-full [&>svg]:size-full"
                    dangerouslySetInnerHTML={{ __html: qrSvgString }}
                  />
                </div>
                <div className="text-[9px] text-slate-500 uppercase font-semibold">
                  Scan QR with camera for full medical info
                </div>
              </div>
            )}

            {/* Public Link & Quick Actions */}
            <div className="space-y-3 pt-3 border-t border-border">
              <div>
                <Label className="text-xs font-semibold text-muted-foreground mb-1 block">
                  Public Emergency URL (Embedded in QR):
                </Label>
                <div className="flex items-center gap-1.5">
                  <Input
                    readOnly
                    value={publicUrl}
                    className="text-xs font-mono bg-muted/40 h-8"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={copyTagLink}
                    className="h-8 gap-1 shrink-0"
                  >
                    {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button
                  onClick={downloadQrPng}
                  variant="outline"
                  className="rounded-xl text-xs gap-1.5 h-9"
                >
                  <Download className="size-3.5" /> High-Res PNG
                </Button>
                <Button
                  onClick={downloadQrSvg}
                  variant="outline"
                  className="rounded-xl text-xs gap-1.5 h-9"
                >
                  <FileText className="size-3.5" /> Vector SVG
                </Button>
                <Button
                  onClick={printCollarTagSheet}
                  className="rounded-xl text-xs gap-1.5 h-9 col-span-2 bg-primary text-primary-foreground shadow-xs"
                >
                  <Printer className="size-3.5" /> Print Collar Tag & Cut-out Sheet
                </Button>
                <Button
                  onClick={printLostPetFlyer}
                  variant="secondary"
                  className="rounded-xl text-xs gap-1.5 h-9 col-span-2"
                >
                  <FileText className="size-3.5" /> Print 8.5x11 Lost Pet Poster
                </Button>
              </div>

              <div className="pt-2">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs text-muted-foreground hover:text-foreground gap-1.5"
                >
                  <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="size-3.5" /> Test Open Scanned Emergency Landing Page
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
