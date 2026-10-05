import { useState, useMemo, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import {
  generateQrSvg,
  generateQrDataUrl,
  getQrScannableContent,
  type PetTagData,
  type QrActionType,
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
  Upload,
  Image as ImageIcon,
  X,
} from "lucide-react";

type T = (key: string, options?: Record<string, unknown>) => string;

const NS = "pet-qr-tag-generator";

const ALERT_KEYS = [
  "alertDiabetic",
  "alertAllergy",
  "alertDeaf",
  "alertBlind",
  "alertMedication",
  "alertNervous",
  "alertFriendly",
  "alertVetCare",
  "alertMicrochipped",
] as const;

const THEME_COLORS = [
  { nameKey: "themeCrimson", value: "#dc2626", text: "text-red-600", bg: "bg-red-600" },
  { nameKey: "themeSapphire", value: "#2563eb", text: "text-blue-600", bg: "bg-blue-600" },
  { nameKey: "themeAmber", value: "#d97706", text: "text-amber-600", bg: "bg-amber-600" },
  { nameKey: "themeEmerald", value: "#059669", text: "text-emerald-600", bg: "bg-emerald-600" },
  { nameKey: "themePurple", value: "#7c3aed", text: "text-purple-600", bg: "bg-purple-600" },
  { nameKey: "themeSlate", value: "#0f172a", text: "text-slate-900", bg: "bg-slate-900" },
  { nameKey: "themeCoral", value: "#ea580c", text: "text-orange-600", bg: "bg-orange-600" },
];

const SAMPLE_PHOTOS = [
  { labelKey: "photoGolden", url: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80" },
  { labelKey: "photoShepherd", url: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=600&q=80" },
  { labelKey: "photoHusky", url: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=600&q=80" },
  { labelKey: "photoFrenchie", url: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80" },
  { labelKey: "photoTabby", url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80" },
  { labelKey: "photoCalico", url: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=600&q=80" },
];

export function SmartCollarQRTool() {
  const { t } = useTranslation("tools");
  const alerts = useMemo(() => ALERT_KEYS.map((k) => t(`${NS}.ui.${k}`)), [t]);
  const themeColors = useMemo(
    () => THEME_COLORS.map((c) => ({ ...c, name: t(`${NS}.ui.${c.nameKey}`) })),
    [t],
  );
  const samplePhotos = useMemo(
    () => SAMPLE_PHOTOS.map((p) => ({ ...p, label: t(`${NS}.ui.${p.labelKey}`) })),
    [t],
  );
  const [petName, setPetName] = useState(t(`${NS}.ui.defaultPetName`));
  const [species, setSpecies] = useState(t(`${NS}.ui.defaultSpecies`));
  const [breed, setBreed] = useState(t(`${NS}.ui.defaultBreed`));
  const [photoUrl, setPhotoUrl] = useState(
    "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80",
  );
  const [microchipNumber, setMicrochipNumber] = useState("985141002348912");
  const [gender, setGender] = useState(t(`${NS}.ui.defaultGender`));
  const [color, setColor] = useState(t(`${NS}.ui.defaultColor`));
  const [isLost, setIsLost] = useState(true);
  const [rewardAmount, setRewardAmount] = useState(t(`${NS}.ui.defaultReward`));

  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleImageFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error(t(`${NS}.ui.toastInvalidImage`));
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const rawDataUrl = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const maxDim = 600;
        let width = img.width;
        let height = img.height;
        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.85);
          setPhotoUrl(compressedDataUrl);
          toast.success(t(`${NS}.ui.toastPhotoUploaded`));
        }
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  }

  // Owner Contacts
  const [ownerName, setOwnerName] = useState(t(`${NS}.ui.defaultOwnerName`));
  const [primaryPhone, setPrimaryPhone] = useState("+1 (555) 234-5678");
  const [hasWhatsApp, setHasWhatsApp] = useState(true);
  const [backupPhone, setBackupPhone] = useState("+1 (555) 876-5432");
  const [cityArea, setCityArea] = useState(t(`${NS}.ui.defaultCity`));

  // Medical & Behavior
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([
    t(`${NS}.ui.alertDiabetic`),
    t(`${NS}.ui.alertFriendly`),
    t(`${NS}.ui.alertMicrochipped`),
  ]);
  const [customAlertInput, setCustomAlertInput] = useState("");
  const [behaviorNotes, setBehaviorNotes] = useState(t(`${NS}.ui.defaultNotes`));
  const [vetName, setVetName] = useState(t(`${NS}.ui.defaultVetName`));
  const [vetPhone, setVetPhone] = useState("+1 (555) 999-8877");

  // Tag Styling & Action Mode
  const [tagShape, setTagShape] = useState<"circle" | "bone" | "shield" | "hexagon">("circle");
  const [tagColor, setTagColor] = useState("#dc2626");
  const [tagline, setTagline] = useState(t(`${NS}.ui.defaultTagline`));
  const [qrActionType, setQrActionType] = useState<QrActionType>("web");

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
      qrActionType,
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
      qrActionType,
    ],
  );

  const publicUrl = useMemo(() => generateTagPublicUrl(tagData), [tagData]);
  const scannableContent = useMemo(
    () => getQrScannableContent(tagData, qrActionType),
    [tagData, qrActionType],
  );

  const [qrSvgString, setQrSvgString] = useState<string>("");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    let active = true;
    generateQrSvg(scannableContent, {
      size: 320,
      color: "#0f172a",
      bgColor: "#ffffff",
      margin: 3,
      errorCorrectionLevel: "M",
    }).then((svg) => {
      if (active) setQrSvgString(svg);
    });

    generateQrDataUrl(scannableContent, {
      size: 1024,
      color: "#0f172a",
      bgColor: "#ffffff",
      margin: 3,
      errorCorrectionLevel: "M",
    }).then((url) => {
      if (active) setQrDataUrl(url);
    });

    return () => {
      active = false;
    };
  }, [scannableContent]);

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
    toast.success(t(`${NS}.ui.toastLinkCopied`));
    setTimeout(() => setCopied(false), 2000);
  }

  function downloadQrPng() {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.download = `${petName.toLowerCase()}-smart-collar-qr.png`;
    a.href = qrDataUrl;
    a.click();
    toast.success(t(`${NS}.ui.toastPngDownloaded`));
  }

  function downloadQrSvg() {
    const blob = new Blob([qrSvgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.download = `${petName.toLowerCase()}-collar-qr.svg`;
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(t(`${NS}.ui.toastSvgDownloaded`));
  }

  function printCollarTagSheet() {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${t(`${NS}.ui.printTagTitle`, { petName })}</title>
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
          <h1>🐾 ${t(`${NS}.ui.printTagH1`, { petName })}</h1>
          <p>${t(`${NS}.ui.printTagIntro`)}</p>

          <div class="grid">
            <div class="tag-card">
              <div class="cut-line">${t(`${NS}.ui.cutFront`)}</div>
              <div class="qr-box">
                <img src="${qrDataUrl}" width="140" height="140" alt="${t(`${NS}.ui.qrAlt`)}" style="display: block; margin: 0 auto;" />
              </div>
              <div class="tag-title">${petName}</div>
              <div style="font-size: 11px; font-weight: 600; color: ${tagColor};">${tagline}</div>
            </div>

            <div class="tag-card">
              <div class="cut-line">${t(`${NS}.ui.cutBack`)}</div>
              <div style="margin-top: 10px;">
                <div style="font-size: 18px; font-weight: bold; color: ${tagColor};">${petName}</div>
                <div style="font-size: 12px; color: #64748b; margin-bottom: 12px;">${breed || species}</div>
                <div style="font-size: 13px; font-weight: bold; margin-bottom: 4px;">📞 ${primaryPhone}</div>
                ${backupPhone ? `<div style="font-size: 11px; color: #475569; margin-bottom: 8px;">${t(`${NS}.ui.printAlt`, { phone: backupPhone })}</div>` : ""}
                ${microchipNumber ? `<div style="font-size: 10px; color: #64748b;">${t(`${NS}.ui.printMicrochip`, { num: microchipNumber })}</div>` : ""}
                ${rewardAmount ? `<div style="margin-top: 10px; background: #fef2f2; color: #b91c1c; font-size: 11px; font-weight: bold; padding: 4px 8px; border-radius: 6px; display: inline-block;">${rewardAmount}</div>` : ""}
              </div>
            </div>
          </div>

          <div class="collar-strip">
            <div>
              <div class="cut-line">${t(`${NS}.ui.cutStrip`)}</div>
              <div class="strip-text">${t(`${NS}.ui.printStripText`, { petName, phone: primaryPhone })}</div>
              <div style="font-size: 10px; color: #64748b;">${t(`${NS}.ui.printStripSub`)}</div>
            </div>
            <div style="width: 60px; height: 60px;">
              <img src="${qrDataUrl}" width="60" height="60" alt="${t(`${NS}.ui.qrAlt`)}" />
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
          <title>${t(`${NS}.ui.printFlyerTitle`, { petName })}</title>
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
          <div class="header-banner">🚨 ${t(`${NS}.ui.printFlyerBanner`, { species: species.toUpperCase() })} 🚨</div>
          ${photoUrl ? `<img src="${photoUrl}" class="pet-img" alt="${petName}" />` : ""}
          <div class="pet-name">${petName}</div>
          <div class="pet-sub">${breed || species} ${color ? `· ${color}` : ""} ${cityArea ? `· ${t(`${NS}.ui.printLastSeen`, { area: cityArea })}` : ""}</div>

          ${rewardAmount ? `<div class="reward-box">💰 ${rewardAmount}</div>` : ""}

          <div class="contact-box">
            <div style="font-size: 14px; text-transform: uppercase; font-weight: bold; color: #64748b;">${t(`${NS}.ui.printCallNow`)}</div>
            <div class="phone-large">📞 ${primaryPhone}</div>
            ${backupPhone ? `<div style="font-size: 16px; font-weight: 600; color: #475569;">${t(`${NS}.ui.printAltContact`, { phone: backupPhone, owner: ownerName })}</div>` : ""}
          </div>

          <div class="grid-bottom">
            <div class="qr-frame">
              <img src="${qrDataUrl}" width="140" height="140" alt="${t(`${NS}.ui.qrAlt`)}" />
            </div>
            <div class="details-text">
              <strong>${t(`${NS}.ui.printScanTitle`)}</strong><br/>
              • ${t(`${NS}.ui.printScan1`)}<br/>
              • ${t(`${NS}.ui.printScan2`)}<br/>
              • ${t(`${NS}.ui.printScan3`)}<br/>
              ${behaviorNotes ? `<div style="margin-top: 6px; font-size: 12px; color: #64748b;"><em>${t(`${NS}.ui.printNote`, { notes: behaviorNotes })}</em></div>` : ""}
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
              <QrCode className="size-3.5" /> {t(`${NS}.ui.bannerBadge`)}
            </Badge>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {t(`${NS}.ui.bannerTitle`)}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl">
              {t(`${NS}.ui.bannerDesc`)}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            <Button
              onClick={printCollarTagSheet}
              variant="outline"
              className="rounded-full gap-1.5 shadow-xs"
            >
              <Printer className="size-4" /> {t(`${NS}.ui.printTagKitButton`)}
            </Button>
            <Button
              onClick={downloadQrPng}
              className="rounded-full gap-1.5 shadow-sm"
            >
              <Download className="size-4" /> {t(`${NS}.ui.downloadQrButton`)}
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
                <Heart className="size-4 text-primary" /> {t(`${NS}.ui.section1Title`)}
              </h3>
              <span className="text-xs text-muted-foreground">{t(`${NS}.ui.section1Tag`)}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="petName" className="text-xs font-semibold">
                  {t(`${NS}.ui.petNameLabel`)}
                </Label>
                <Input
                  id="petName"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  placeholder={t(`${NS}.ui.petNamePh`)}
                  className="mt-1 font-semibold"
                />
              </div>

              <div>
                <Label htmlFor="species" className="text-xs font-semibold">
                  {t(`${NS}.ui.speciesLabel`)}
                </Label>
                <Input
                  id="species"
                  value={species}
                  onChange={(e) => setSpecies(e.target.value)}
                  placeholder={t(`${NS}.ui.speciesPh`)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="breed" className="text-xs font-semibold">
                  {t(`${NS}.ui.breedLabel`)}
                </Label>
                <Input
                  id="breed"
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  placeholder={t(`${NS}.ui.breedPh`)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="color" className="text-xs font-semibold">
                  {t(`${NS}.ui.colorLabel`)}
                </Label>
                <Input
                  id="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder={t(`${NS}.ui.colorPh`)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="microchip" className="text-xs font-semibold">
                  {t(`${NS}.ui.microchipLabel`)}
                </Label>
                <Input
                  id="microchip"
                  value={microchipNumber}
                  onChange={(e) => setMicrochipNumber(e.target.value)}
                  placeholder={t(`${NS}.ui.microchipPh`)}
                  className="mt-1 font-mono text-xs"
                />
              </div>

              <div className="sm:col-span-2 pt-2 border-t border-border/80">
                <Label className="text-xs font-semibold block mb-2">
                  {t(`${NS}.ui.photoLabel`)}
                </Label>

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png,image/jpeg,image/webp,image/jpg"
                  className="hidden"
                  onChange={handleImageFileChange}
                />

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  {/* Photo Preview Thumbnail */}
                  <div className="relative size-16 rounded-xl border border-border bg-muted/30 overflow-hidden flex items-center justify-center shrink-0 shadow-xs">
                    {photoUrl ? (
                      <>
                        <img src={photoUrl} alt={t(`${NS}.ui.petPreviewAlt`)} className="size-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setPhotoUrl("")}
                          className="absolute top-0.5 right-0.5 size-4 bg-background/80 hover:bg-destructive hover:text-white rounded-full flex items-center justify-center transition-colors"
                          title={t(`${NS}.ui.removePhotoTitle`)}
                        >
                          <X className="size-3" />
                        </button>
                      </>
                    ) : (
                      <ImageIcon className="size-6 text-muted-foreground/60" />
                    )}
                  </div>

                  {/* Upload Actions & URL input */}
                  <div className="flex-1 w-full space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="rounded-xl text-xs gap-1.5 h-8 font-semibold shadow-xs"
                      >
                        <Upload className="size-3.5 text-primary" /> {t(`${NS}.ui.uploadPhotoButton`)}
                      </Button>
                      {photoUrl && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setPhotoUrl("")}
                          className="text-xs text-destructive hover:text-destructive h-8 px-2"
                        >
                          {t(`${NS}.ui.removeButton`)}
                        </Button>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Input
                        id="photo"
                        value={photoUrl}
                        onChange={(e) => setPhotoUrl(e.target.value)}
                        placeholder={t(`${NS}.ui.photoUrlPh`)}
                        className="text-xs h-8"
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Preset Photos */}
                <div className="pt-2">
                  <span className="text-[11px] text-muted-foreground font-medium">{t(`${NS}.ui.samplePhotoLabel`)} </span>
                  <div className="inline-flex flex-wrap gap-1 mt-1">
                    {samplePhotos.map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => {
                          setPhotoUrl(p.url);
                          toast.success(t(`${NS}.ui.toastSamplePhoto`, { label: p.label }));
                        }}
                        className={`text-[10px] px-2 py-0.5 rounded-md border transition-all ${
                          photoUrl === p.url
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-muted/40 hover:bg-muted text-muted-foreground border-border"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Emergency Contacts */}
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-display font-semibold text-base flex items-center gap-2">
                <Phone className="size-4 text-emerald-500" /> {t(`${NS}.ui.section2Title`)}
              </h3>
              <span className="text-xs text-muted-foreground">{t(`${NS}.ui.section2Tag`)}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ownerName" className="text-xs font-semibold">
                  {t(`${NS}.ui.ownerLabel`)}
                </Label>
                <Input
                  id="ownerName"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder={t(`${NS}.ui.ownerPh`)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="primaryPhone" className="text-xs font-semibold">
                  {t(`${NS}.ui.primaryPhoneLabel`)}
                </Label>
                <Input
                  id="primaryPhone"
                  value={primaryPhone}
                  onChange={(e) => setPrimaryPhone(e.target.value)}
                  placeholder={t(`${NS}.ui.primaryPhonePh`)}
                  className="mt-1 font-mono"
                />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border bg-muted/30 p-3 sm:col-span-2">
                <div className="space-y-0.5">
                  <Label htmlFor="hasWhatsApp" className="text-xs font-semibold cursor-pointer">
                    {t(`${NS}.ui.whatsappLabel`)}
                  </Label>
                  <p className="text-[11px] text-muted-foreground">
                    {t(`${NS}.ui.whatsappDesc`)}
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
                  {t(`${NS}.ui.backupPhoneLabel`)}
                </Label>
                <Input
                  id="backupPhone"
                  value={backupPhone}
                  onChange={(e) => setBackupPhone(e.target.value)}
                  placeholder={t(`${NS}.ui.backupPhonePh`)}
                  className="mt-1 font-mono"
                />
              </div>

              <div>
                <Label htmlFor="cityArea" className="text-xs font-semibold">
                  {t(`${NS}.ui.cityLabel`)}
                </Label>
                <Input
                  id="cityArea"
                  value={cityArea}
                  onChange={(e) => setCityArea(e.target.value)}
                  placeholder={t(`${NS}.ui.cityPh`)}
                  className="mt-1"
                />
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="rewardAmount" className="text-xs font-semibold">
                  {t(`${NS}.ui.rewardLabel`)}
                </Label>
                <Input
                  id="rewardAmount"
                  value={rewardAmount}
                  onChange={(e) => setRewardAmount(e.target.value)}
                  placeholder={t(`${NS}.ui.rewardPh`)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* 3. Medical & Safety Alerts */}
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-display font-semibold text-base flex items-center gap-2">
                <AlertTriangle className="size-4 text-amber-500" /> {t(`${NS}.ui.section3Title`)}
              </h3>
              <span className="text-xs text-muted-foreground">{t(`${NS}.ui.section3Tag`)}</span>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-semibold">{t(`${NS}.ui.badgesLabel`)}</Label>
              <div className="flex flex-wrap gap-1.5">
                {alerts.map((alert) => {
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
                  placeholder={t(`${NS}.ui.customAlertPh`)}
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
                  <Plus className="size-3.5" /> {t(`${NS}.ui.addButton`)}
                </Button>
              </div>

              <div>
                <Label htmlFor="behaviorNotes" className="text-xs font-semibold">
                  {t(`${NS}.ui.notesLabel`)}
                </Label>
                <Textarea
                  id="behaviorNotes"
                  value={behaviorNotes}
                  onChange={(e) => setBehaviorNotes(e.target.value)}
                  rows={2}
                  placeholder={t(`${NS}.ui.notesPh`)}
                  className="mt-1 text-xs leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <Label htmlFor="vetName" className="text-xs font-semibold">
                    {t(`${NS}.ui.vetNameLabel`)}
                  </Label>
                  <Input
                    id="vetName"
                    value={vetName}
                    onChange={(e) => setVetName(e.target.value)}
                    placeholder={t(`${NS}.ui.vetNamePh`)}
                    className="mt-1 text-xs"
                  />
                </div>
                <div>
                  <Label htmlFor="vetPhone" className="text-xs font-semibold">
                    {t(`${NS}.ui.vetPhoneLabel`)}
                  </Label>
                  <Input
                    id="vetPhone"
                    value={vetPhone}
                    onChange={(e) => setVetPhone(e.target.value)}
                    placeholder={t(`${NS}.ui.vetPhonePh`)}
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
                <Palette className="size-4 text-primary" /> {t(`${NS}.ui.section4Title`)}
              </h3>
              <span className="text-xs text-muted-foreground">{t(`${NS}.ui.section4Tag`)}</span>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-xs font-semibold mb-2 block">{t(`${NS}.ui.themeLabel`)}</Label>
                <div className="flex flex-wrap gap-2">
                  {themeColors.map((c) => (
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
                <Label className="text-xs font-semibold mb-2 block">{t(`${NS}.ui.shapeLabel`)}</Label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: "circle", label: t(`${NS}.ui.shapeCircle`) },
                    { id: "bone", label: t(`${NS}.ui.shapeBone`) },
                    { id: "shield", label: t(`${NS}.ui.shapeShield`) },
                    { id: "hexagon", label: t(`${NS}.ui.shapeHexagon`) },
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
                  {t(`${NS}.ui.taglineLabel`)}
                </Label>
                <Input
                  id="tagline"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder={t(`${NS}.ui.taglinePh`)}
                  className="mt-1 text-xs uppercase font-bold"
                />
              </div>
            </div>
          </div>

          {/* 5. QR Scan Action Type */}
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-display font-semibold text-base flex items-center gap-2">
                <QrCode className="size-4 text-primary" /> {t(`${NS}.ui.section5Title`)}
              </h3>
              <span className="text-xs text-muted-foreground">{t(`${NS}.ui.section5Tag`)}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                {
                  id: "web",
                  title: t(`${NS}.ui.optWebTitle`),
                  desc: t(`${NS}.ui.optWebDesc`),
                },
                {
                  id: "call",
                  title: t(`${NS}.ui.optCallTitle`),
                  desc: t(`${NS}.ui.optCallDesc`),
                },
                {
                  id: "whatsapp",
                  title: t(`${NS}.ui.optWhatsappTitle`),
                  desc: t(`${NS}.ui.optWhatsappDesc`),
                },
                {
                  id: "vcard",
                  title: t(`${NS}.ui.optVcardTitle`),
                  desc: t(`${NS}.ui.optVcardDesc`),
                },
                {
                  id: "text",
                  title: t(`${NS}.ui.optTextTitle`),
                  desc: t(`${NS}.ui.optTextDesc`),
                },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setQrActionType(opt.id as any)}
                  className={`text-left p-3 rounded-xl border transition-all ${
                    qrActionType === opt.id
                      ? "border-primary bg-primary/10 ring-2 ring-primary/20 shadow-xs"
                      : "border-border bg-card hover:bg-muted/40"
                  } ${opt.id === "text" ? "sm:col-span-2" : ""}`}
                >
                  <div className="text-xs font-bold text-foreground">{opt.title}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Interactive Previews & Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-base flex items-center gap-2">
                <Sparkles className="size-4 text-primary" /> {t(`${NS}.ui.previewTitle`)}
              </h3>
              <Tabs
                value={previewTab}
                onValueChange={(v) => setPreviewTab(v as any)}
                className="w-auto"
              >
                <TabsList className="h-8">
                  <TabsTrigger value="collar" className="text-xs">
                    {t(`${NS}.ui.tabCollar`)}
                  </TabsTrigger>
                  <TabsTrigger value="mobile" className="text-xs">
                    {t(`${NS}.ui.tabMobile`)}
                  </TabsTrigger>
                  <TabsTrigger value="flyer" className="text-xs">
                    {t(`${NS}.ui.tabFlyer`)}
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
                        <div className="size-36 p-1 bg-white rounded-xl shadow-xs flex items-center justify-center">
                          {qrDataUrl ? (
                            <img src={qrDataUrl} alt="${t(`${NS}.ui.qrAlt`)}" className="size-full object-contain" />
                          ) : (
                            <div className="text-xs text-muted-foreground">{t(`${NS}.ui.loadingText`)}</div>
                          )}
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
                    <RotateCcw className="size-3.5" /> {t(`${NS}.ui.flipTag`, { side: tagSide === "front" ? t(`${NS}.ui.flipFront`) : t(`${NS}.ui.flipBack`) })}
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
                      {t(`${NS}.ui.mobileAlertTitle`)}
                    </div>
                    <div className="text-xs opacity-90">{t(`${NS}.ui.mobileAlertSub`)}</div>
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
                        <Phone className="size-3.5" /> {t(`${NS}.ui.mobileCall`, { phone: primaryPhone })}
                      </div>
                      {hasWhatsApp && (
                        <div className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-1.5 rounded-xl text-center text-[11px] flex items-center justify-center gap-1.5 shadow-xs">
                          <MessageCircle className="size-3.5" /> {t(`${NS}.ui.mobileWhatsapp`)}
                        </div>
                      )}
                      <div className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 rounded-xl text-center text-[11px] flex items-center justify-center gap-1.5 shadow-xs">
                        <MapPin className="size-3.5" /> {t(`${NS}.ui.mobileGps`)}
                      </div>
                    </div>

                    {/* Medical Badges */}
                    {selectedAlerts.length > 0 && (
                      <div className="pt-1">
                        <div className="text-[10px] font-bold text-red-600 uppercase mb-1">
                          {t(`${NS}.ui.mobileMedical`)}
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
                  🚨 {t(`${NS}.ui.flyerBanner`, { species: species.toUpperCase() })} 🚨
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
                  {t(`${NS}.ui.flyerCall`, { phone: primaryPhone })}
                </div>
                <div className="size-20 mx-auto flex items-center justify-center">
                  {qrDataUrl ? (
                    <img src={qrDataUrl} alt="${t(`${NS}.ui.qrAlt`)}" className="size-full object-contain" />
                  ) : (
                    <div className="text-[10px] text-slate-400">{t(`${NS}.ui.loadingText`)}</div>
                  )}
                </div>
                <div className="text-[9px] text-slate-500 uppercase font-semibold">
                  {t(`${NS}.ui.flyerScanNote`)}
                </div>
              </div>
            )}

            {/* Scanned QR Output & Quick Actions */}
            <div className="space-y-3 pt-3 border-t border-border">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label className="text-xs font-semibold text-muted-foreground">
                    {t(`${NS}.ui.qrOutputLabel`)}
                  </Label>
                  <span className="text-[10px] font-bold uppercase text-primary">
                    {t(`${NS}.ui.qrMode`, { mode: qrActionType.toUpperCase() })}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Input
                    readOnly
                    value={scannableContent}
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
                    {copied ? t(`${NS}.ui.copiedShort`) : t(`${NS}.ui.copyShort`)}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button
                  onClick={downloadQrPng}
                  variant="outline"
                  className="rounded-xl text-xs gap-1.5 h-9"
                >
                  <Download className="size-3.5" /> {t(`${NS}.ui.pngButton`)}
                </Button>
                <Button
                  onClick={downloadQrSvg}
                  variant="outline"
                  className="rounded-xl text-xs gap-1.5 h-9"
                >
                  <FileText className="size-3.5" /> {t(`${NS}.ui.svgButton`)}
                </Button>
                <Button
                  onClick={printCollarTagSheet}
                  className="rounded-xl text-xs gap-1.5 h-9 col-span-2 bg-primary text-primary-foreground shadow-xs"
                >
                  <Printer className="size-3.5" /> {t(`${NS}.ui.printTagButton`)}
                </Button>
                <Button
                  onClick={printLostPetFlyer}
                  variant="secondary"
                  className="rounded-xl text-xs gap-1.5 h-9 col-span-2"
                >
                  <FileText className="size-3.5" /> {t(`${NS}.ui.printFlyerButton`)}
                </Button>
              </div>

              {qrActionType === "web" && (
                <div className="pt-2">
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs text-muted-foreground hover:text-foreground gap-1.5"
                  >
                    <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="size-3.5" /> {t(`${NS}.ui.testLandingButton`)}
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
