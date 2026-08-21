import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { parsePetTagFromUrl, decodePetTagPayload, type PetTagData } from "@/lib/qr-tag";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Phone,
  MessageCircle,
  MapPin,
  AlertTriangle,
  Heart,
  ShieldCheck,
  Stethoscope,
  Info,
  Check,
  Copy,
  ExternalLink,
  Navigation,
  Loader2,
  Share2,
} from "lucide-react";

export const Route = createFileRoute("/tag/$id")({
  head: () => ({
    meta: [
      { title: "Lost Pet Emergency Tag — FurTools Safety" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: LostPetEmergencyPage,
});

function LostPetEmergencyPage() {
  const { id } = Route.useParams();
  const [loading, setLoading] = useState(true);
  const [petData, setPetData] = useState<PetTagData | null>(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [currentLocationUrl, setCurrentLocationUrl] = useState<string | null>(null);
  const [copiedPhone, setCopiedPhone] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);

      // 1. Check if URL contains search parameters or query param `data`
      if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        const parsed = parsePetTagFromUrl(urlParams);
        if (parsed) {
          setPetData(parsed);
          setLoading(false);
          return;
        }
      }

      // 2. Try fetching from Supabase `pets` table by ID
      if (id && id !== "p" && id !== "emergency") {
        try {
          const { data, error } = await supabase
            .from("pets")
            .select("*")
            .eq("id", id)
            .maybeSingle();

          if (data) {
            setPetData({
              id: data.id,
              petName: data.name,
              species: data.species || "Pet",
              breed: data.breed || undefined,
              microchipNumber: data.microchip_number || undefined,
              color: data.color || undefined,
              gender: data.gender || undefined,
              ownerName: "Pet Parent",
              primaryPhone: (data.notes && data.notes.match(/\+?[0-9\s-()]{7,20}/)?.[0]) || "+1 (555) 234-5678",
              hasWhatsApp: true,
              medicalAlerts: data.medical_notes ? [data.medical_notes] : ["Microchipped"],
              isLost: true,
              rewardAmount: "$200 Reward",
            });
            setLoading(false);
            return;
          }
        } catch (err) {
          console.warn("Could not load pet by UUID:", err);
        }
      }

      // 3. Fallback demo data if opened directly without parameters
      setPetData({
        petName: "Buddy",
        species: "Dog",
        breed: "Golden Retriever",
        photoUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80",
        microchipNumber: "985141002348912",
        color: "Golden Cream",
        gender: "Male",
        isLost: true,
        rewardAmount: "$250 Reward",
        ownerName: "Sarah Jenkins",
        primaryPhone: "+1 (555) 234-5678",
        hasWhatsApp: true,
        backupPhone: "+1 (555) 876-5432",
        cityArea: "Austin, TX (Downtown Area)",
        medicalAlerts: [
          "Diabetic (Requires Daily Insulin)",
          "Friendly & Gentle with Kids",
          "Microchipped",
        ],
        behaviorNotes: "Loves squeaky toys. Timid if approached too quickly—please call us right away!",
        vetName: "Central Animal Hospital",
        vetPhone: "+1 (555) 999-8877",
      });

      setLoading(false);
    })();
  }, [id]);

  function cleanPhoneNumber(phone: string): string {
    return phone.replace(/[^0-9+]/g, "");
  }

  function handleShareLocation() {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
        setCurrentLocationUrl(mapsUrl);
        setGettingLocation(false);

        const cleanPhone = cleanPhoneNumber(petData?.primaryPhone || "");
        const message = encodeURIComponent(
          `Hello ${petData?.ownerName || "Pet Owner"}, I just found your pet ${petData?.petName || "Buddy"}! Here is my current GPS location: ${mapsUrl}`,
        );

        if (petData?.hasWhatsApp) {
          window.open(`https://wa.me/${cleanPhone}?text=${message}`, "_blank");
        } else {
          window.open(`sms:${cleanPhone}?body=${message}`, "_blank");
        }
      },
      (err) => {
        setGettingLocation(false);
        toast.error("Could not retrieve GPS location. Please call or message the owner directly.");
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  function copyPhone() {
    if (!petData?.primaryPhone) return;
    navigator.clipboard.writeText(petData.primaryPhone);
    setCopiedPhone(true);
    toast.success("Phone number copied!");
    setTimeout(() => setCopiedPhone(false), 2000);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-muted/20 p-4">
        <Loader2 className="size-8 animate-spin text-primary mb-3" />
        <p className="text-sm font-medium text-muted-foreground">Loading Emergency Pet Profile…</p>
      </div>
    );
  }

  if (!petData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <AlertTriangle className="size-12 text-destructive mb-3" />
        <h1 className="text-xl font-bold">Tag Not Found</h1>
        <p className="text-sm text-muted-foreground mt-1">
          This pet tag link may be expired or invalid.
        </p>
      </div>
    );
  }

  const cleanPhone = cleanPhoneNumber(petData.primaryPhone);
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Hello ${petData.ownerName}, I scanned the collar tag on ${petData.petName}! Are you looking for them?`,
  )}`;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 pb-16">
      {/* Top Urgent Lost Pet Banner */}
      <div className="bg-red-600 text-white py-4 px-4 shadow-md sticky top-0 z-50">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex size-3 rounded-full bg-white animate-ping" />
            <div className="font-black text-sm sm:text-base uppercase tracking-wider">
              🚨 LOST PET ALERT 🚨
            </div>
          </div>
          {petData.rewardAmount && (
            <span className="bg-white text-red-700 font-extrabold text-xs px-2.5 py-1 rounded-full shadow-xs">
              💰 {petData.rewardAmount}
            </span>
          )}
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-4 space-y-4">
        {/* Main Pet Identity Card */}
        <div className="rounded-3xl border border-border bg-card p-5 shadow-lg space-y-4 text-center">
          {petData.photoUrl ? (
            <div className="relative size-36 sm:size-40 mx-auto rounded-3xl overflow-hidden border-4 border-primary/20 shadow-md">
              <img
                src={petData.photoUrl}
                alt={petData.petName}
                className="size-full object-cover"
              />
            </div>
          ) : (
            <div className="size-28 mx-auto rounded-3xl bg-primary/10 flex items-center justify-center text-4xl border border-primary/20">
              🐾
            </div>
          )}

          <div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground">
              {petData.petName}
            </h1>
            <p className="text-sm font-semibold text-muted-foreground mt-0.5">
              {petData.breed || petData.species}
              {petData.color ? ` · ${petData.color}` : ""}
              {petData.gender ? ` · ${petData.gender}` : ""}
            </p>
            {petData.cityArea && (
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
                <MapPin className="size-3.5 text-primary" /> Home Area: {petData.cityArea}
              </p>
            )}
          </div>

          {/* Quick 1-Tap Action Grid */}
          <div className="space-y-2 pt-2">
            <a
              href={`tel:${cleanPhone}`}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold py-3.5 px-4 rounded-2xl shadow-md text-base transition"
            >
              <Phone className="size-5" /> Call Owner ({petData.primaryPhone})
            </a>

            {petData.hasWhatsApp && (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] active:scale-[0.99] text-white font-bold py-3 px-4 rounded-2xl shadow-sm text-sm transition"
              >
                <MessageCircle className="size-4" /> WhatsApp Owner (Message & Photo)
              </a>
            )}

            <Button
              type="button"
              onClick={handleShareLocation}
              disabled={gettingLocation}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold py-3 px-4 rounded-2xl shadow-sm text-sm h-auto transition"
            >
              <Navigation className={`size-4 ${gettingLocation ? "animate-spin" : ""}`} />
              {gettingLocation ? "Retrieving GPS Coordinates…" : "📍 Send My GPS Pin to Owner"}
            </Button>
          </div>

          <div className="flex items-center justify-center gap-2 pt-1">
            <button
              type="button"
              onClick={copyPhone}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 py-1 px-2.5 rounded-lg border border-border bg-muted/40"
            >
              {copiedPhone ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
              {copiedPhone ? "Phone Copied" : "Copy Phone Number"}
            </button>
          </div>
        </div>

        {/* Critical Health & Safety Warnings */}
        {petData.medicalAlerts && petData.medicalAlerts.length > 0 && (
          <div className="rounded-2xl border-2 border-red-500/30 bg-red-50 dark:bg-red-950/40 p-4 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-red-700 dark:text-red-400">
              <AlertTriangle className="size-4 shrink-0 text-red-600" /> Critical Medical & Care Alerts
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {petData.medicalAlerts.map((alert) => (
                <span
                  key={alert}
                  className="text-xs font-bold bg-red-600 text-white px-2.5 py-1 rounded-xl shadow-xs"
                >
                  ⚠️ {alert}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Behavioral Notes & Safe Handling */}
        {petData.behaviorNotes && (
          <div className="rounded-2xl border border-border bg-card p-4 shadow-xs space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <Info className="size-3.5 text-primary" /> Temperament & How to Approach
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {petData.behaviorNotes}
            </p>
          </div>
        )}

        {/* Additional Contacts & Vet Data */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs space-y-3 text-xs">
          <div className="font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <ShieldCheck className="size-4 text-emerald-500" /> Identity & Verification Details
          </div>

          <div className="space-y-2 text-foreground divide-y divide-border">
            <div className="flex justify-between py-1.5">
              <span className="text-muted-foreground">Owner Name:</span>
              <span className="font-semibold">{petData.ownerName}</span>
            </div>

            {petData.backupPhone && (
              <div className="flex justify-between py-1.5">
                <span className="text-muted-foreground">Backup Phone:</span>
                <a href={`tel:${cleanPhoneNumber(petData.backupPhone)}`} className="font-semibold text-primary underline">
                  {petData.backupPhone}
                </a>
              </div>
            )}

            {petData.microchipNumber && (
              <div className="flex justify-between py-1.5">
                <span className="text-muted-foreground">Microchip ID:</span>
                <span className="font-mono font-bold">{petData.microchipNumber}</span>
              </div>
            )}

            {petData.vetName && (
              <div className="flex justify-between py-1.5">
                <span className="text-muted-foreground">Primary Vet:</span>
                <span className="font-semibold">{petData.vetName}</span>
              </div>
            )}

            {petData.vetPhone && (
              <div className="flex justify-between py-1.5">
                <span className="text-muted-foreground">Vet Clinic Phone:</span>
                <a href={`tel:${cleanPhoneNumber(petData.vetPhone)}`} className="font-semibold text-primary underline">
                  {petData.vetPhone}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Helpful Tips for the Finder */}
        <div className="rounded-2xl border border-border bg-muted/40 p-4 text-xs space-y-2 text-muted-foreground">
          <div className="font-bold text-foreground flex items-center gap-1.5">
            <Heart className="size-3.5 text-rose-500" /> Thank You for Helping!
          </div>
          <ul className="list-disc pl-4 space-y-1">
            <li>Keep the pet in a secure, quiet area with a small bowl of fresh water.</li>
            <li>Avoid feeding unusual foods or treats without checking with the owner.</li>
            <li>If the pet is injured, any local veterinary clinic will scan the microchip for free.</li>
          </ul>
        </div>

        <div className="text-center pt-2">
          <Link
            to="/"
            className="text-[11px] text-muted-foreground hover:text-primary transition-colors"
          >
            Powered by FurTools Smart Pet Safety
          </Link>
        </div>
      </div>
    </div>
  );
}
