import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  VET_CLINICS_DIRECTORY,
  VET_EMERGENCY_HOTLINES,
  type VetClinic,
  calculateDistanceMiles,
} from "@/data/vets";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Search,
  MapPin,
  Phone,
  Clock,
  Star,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Heart,
  Navigation,
  Sparkles,
  PlusCircle,
  Filter,
  CheckCircle2,
  Stethoscope,
  Building2,
  DollarSign,
  Compass,
  Map,
  Flame,
} from "lucide-react";

export function VetFinderTool({ slug }: { slug?: string }) {
  const { t } = useTranslation("tools");
  const p = slug ?? "shared.vet-finder-tool";
  const [searchQuery, setSearchQuery] = useState(t(`${p}.ui.defaultSearch`));
  const [selectedRadius, setSelectedRadius] = useState<number>(25);
  const [filter24Hour, setFilter24Hour] = useState(false);
  const [filterLowCost, setFilterLowCost] = useState(false);
  const [filterExotics, setFilterExotics] = useState(false);
  const [filterDental, setFilterDental] = useState(false);
  const [filterTelehealth, setFilterTelehealth] = useState(false);

  // User GPS state
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
    name?: string;
  } | null>(null);
  const [locating, setLocating] = useState(false);

  // Submit Clinic Dialog State
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [newClinicName, setNewClinicName] = useState("");
  const [newClinicCity, setNewClinicCity] = useState("");
  const [newClinicPhone, setNewClinicPhone] = useState("");
  const [newClinicAddress, setNewClinicAddress] = useState("");
  const [newClinicWebsite, setNewClinicWebsite] = useState("");
  const [newClinicIs247, setNewClinicIs247] = useState(false);
  const [newClinicNotes, setNewClinicNotes] = useState("");

  function handleUseMyLocation() {
    if (!navigator.geolocation) {
      toast.error(t(`${p}.ui.toastGeoUnsupported`));
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          name: t(`${p}.ui.currentLocation`),
        });
        setLocating(false);
        toast.success(t(`${p}.ui.toastLocationOk`));
      },
      (err) => {
        console.warn("Geolocation error:", err);
        setLocating(false);
        toast.error(t(`${p}.ui.toastLocationFail`));
      },
      { timeout: 10000, enableHighAccuracy: true },
    );
  }

  // Filter and sort clinics
  const filteredClinics = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return VET_CLINICS_DIRECTORY.map((clinic) => {
      let distance: number | undefined;
      if (userLocation) {
        distance = calculateDistanceMiles(
          userLocation.lat,
          userLocation.lng,
          clinic.lat,
          clinic.lng,
        );
      }
      return { ...clinic, distance };
    })
      .filter((clinic) => {
        // Query match (City, State, Zip, Name, Service)
        const matchesQuery =
          !q ||
          clinic.city.toLowerCase().includes(q) ||
          clinic.state.toLowerCase().includes(q) ||
          clinic.zipCode.toLowerCase().includes(q) ||
          clinic.name.toLowerCase().includes(q) ||
          clinic.address.toLowerCase().includes(q) ||
          clinic.services.some((s) => s.toLowerCase().includes(q));

        if (!matchesQuery) return false;

        // Radius filter if location is available
        if (clinic.distance !== undefined && clinic.distance > selectedRadius) {
          return false;
        }

        // Service filters
        if (filter24Hour && !clinic.is24HourEmergency) return false;
        if (filterLowCost && !clinic.isLowCost) return false;
        if (filterExotics && !clinic.offersExotics) return false;
        if (filterDental && !clinic.offersDental) return false;
        if (filterTelehealth && !clinic.offersTelehealth) return false;

        return true;
      })
      .sort((a, b) => {
        if (a.distance !== undefined && b.distance !== undefined) {
          return a.distance - b.distance;
        }
        if (a.is24HourEmergency && !b.is24HourEmergency) return -1;
        if (!a.is24HourEmergency && b.is24HourEmergency) return 1;
        return b.rating - a.rating;
      });
  }, [
    searchQuery,
    selectedRadius,
    filter24Hour,
    filterLowCost,
    filterExotics,
    filterDental,
    filterTelehealth,
    userLocation,
  ]);

  const liveGoogleMapsSearchUrl = useMemo(() => {
    const term = filter24Hour
      ? "24 hour emergency vet clinic"
      : filterLowCost
        ? "low cost affordable vet clinic"
        : "veterinary hospital";
    const loc = searchQuery ? searchQuery : userLocation ? "near me" : "veterinary clinic near me";
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${term} in ${loc}`)}`;
  }, [searchQuery, filter24Hour, filterLowCost, userLocation]);

  function handleRegisterClinic(e: React.FormEvent) {
    e.preventDefault();
    if (!newClinicName.trim() || !newClinicPhone.trim() || !newClinicCity.trim()) {
      toast.error(t(`${p}.ui.toastFormError`));
      return;
    }
    toast.success(t(`${p}.ui.toastSubmitOk`));
    setIsSubmitOpen(false);
    setNewClinicName("");
    setNewClinicCity("");
    setNewClinicPhone("");
    setNewClinicAddress("");
    setNewClinicWebsite("");
    setNewClinicNotes("");
  }

  return (
    <div className="space-y-8">
      {/* 1. Search & Location Bar */}
      <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-background p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
              <Compass className="size-3.5" /> {t(`${p}.ui.headerBadge`)}
            </div>
            <h2 className="font-display text-2xl font-bold tracking-tight">
              {t(`${p}.ui.headerTitle`)}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {t(`${p}.ui.headerDesc`)}
            </p>
          </div>

          <Dialog open={isSubmitOpen} onOpenChange={setIsSubmitOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="rounded-full gap-2 text-xs font-semibold shrink-0 shadow-xs">
                <PlusCircle className="size-4 text-primary" /> {t(`${p}.ui.registerButton`)}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{t(`${p}.ui.dialogTitle`)}</DialogTitle>
                <DialogDescription>
                  {t(`${p}.ui.dialogDesc`)}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleRegisterClinic} className="space-y-3 pt-2">
                <div>
                  <Label htmlFor="cname" className="text-xs font-semibold">{t(`${p}.ui.clinicNameLabel`)}</Label>
                  <Input
                    id="cname"
                    value={newClinicName}
                    onChange={(e) => setNewClinicName(e.target.value)}
                    placeholder={t(`${p}.ui.clinicNamePh`)}
                    className="mt-1 text-sm"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="ccity" className="text-xs font-semibold">{t(`${p}.ui.cityLabel`)}</Label>
                    <Input
                      id="ccity"
                      value={newClinicCity}
                      onChange={(e) => setNewClinicCity(e.target.value)}
                      placeholder={t(`${p}.ui.cityPh`)}
                      className="mt-1 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cphone" className="text-xs font-semibold">{t(`${p}.ui.phoneLabel`)}</Label>
                    <Input
                      id="cphone"
                      value={newClinicPhone}
                      onChange={(e) => setNewClinicPhone(e.target.value)}
                      placeholder={t(`${p}.ui.phonePh`)}
                      className="mt-1 text-sm"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="caddr" className="text-xs font-semibold">{t(`${p}.ui.addressLabel`)}</Label>
                  <Input
                    id="caddr"
                    value={newClinicAddress}
                    onChange={(e) => setNewClinicAddress(e.target.value)}
                    placeholder={t(`${p}.ui.addressPh`)}
                    className="mt-1 text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="cweb" className="text-xs font-semibold">{t(`${p}.ui.websiteLabel`)}</Label>
                  <Input
                    id="cweb"
                    value={newClinicWebsite}
                    onChange={(e) => setNewClinicWebsite(e.target.value)}
                    placeholder={t(`${p}.ui.websitePh`)}
                    className="mt-1 text-sm"
                  />
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="c247"
                    checked={newClinicIs247}
                    onChange={(e) => setNewClinicIs247(e.target.checked)}
                    className="rounded border-slate-300 text-primary size-4"
                  />
                  <Label htmlFor="c247" className="text-xs font-medium cursor-pointer">
                    {t(`${p}.ui.er247Label`)}
                  </Label>
                </div>
                <div>
                  <Label htmlFor="cnotes" className="text-xs font-semibold">{t(`${p}.ui.notesLabel`)}</Label>
                  <Textarea
                    id="cnotes"
                    value={newClinicNotes}
                    onChange={(e) => setNewClinicNotes(e.target.value)}
                    placeholder={t(`${p}.ui.notesPh`)}
                    className="mt-1 text-xs"
                    rows={2}
                  />
                </div>
                <Button type="submit" className="w-full rounded-xl font-bold mt-2">
                  {t(`${p}.ui.submitButton`)}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search Inputs & GPS */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
          <div className="sm:col-span-8 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t(`${p}.ui.searchPh`)}
              className="pl-10 h-11 rounded-2xl bg-card border-border/80 text-sm shadow-xs font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
              >
                {t(`${p}.ui.clearButton`)}
              </button>
            )}
          </div>

          <div className="sm:col-span-4 flex items-center gap-2">
            <Button
              type="button"
              variant={userLocation ? "default" : "outline"}
              onClick={handleUseMyLocation}
              disabled={locating}
              className="w-full h-11 rounded-2xl gap-2 text-xs font-semibold shadow-xs"
            >
              <Navigation className={`size-4 ${locating ? "animate-spin" : ""}`} />
              {locating ? t(`${p}.ui.locatingButton`) : userLocation ? t(`${p}.ui.nearMeButton`) : t(`${p}.ui.useLocationButton`)}
            </Button>
          </div>
        </div>

        {/* Quick City Presets */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
          <span className="text-muted-foreground font-medium mr-1">{t(`${p}.ui.popularLabel`)}</span>
          {["Austin", "New York", "Los Angeles", "Chicago", "Seattle", "Miami", "London", "Toronto"].map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => {
                setSearchQuery(city);
                setUserLocation(null);
              }}
              className={`px-2.5 py-1 rounded-full border transition-all text-xs ${
                searchQuery.toLowerCase() === city.toLowerCase()
                  ? "bg-primary text-primary-foreground border-primary font-semibold"
                  : "bg-card hover:bg-muted text-muted-foreground border-border"
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Filter Badges & Radius */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
            <Filter className="size-3.5 text-primary" /> {t(`${p}.ui.filterLabel`)}
          </div>

          {userLocation && (
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <span>{t(`${p}.ui.radiusLabel`)}</span>
              {[5, 10, 25, 50].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setSelectedRadius(r)}
                  className={`px-2 py-0.5 rounded-md border text-xs transition-all ${
                    selectedRadius === r
                      ? "bg-primary text-primary-foreground border-primary font-bold"
                      : "bg-muted/40 hover:bg-muted text-muted-foreground border-border"
                  }`}
                >
                  {t(`${p}.ui.radiusMi`, { r })}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant={filter24Hour ? "destructive" : "outline"}
            size="sm"
            onClick={() => setFilter24Hour(!filter24Hour)}
            className="rounded-xl text-xs gap-1.5 h-8 font-semibold shadow-xs"
          >
            {t(`${p}.ui.filter24h`)}
          </Button>

          <Button
            type="button"
            variant={filterLowCost ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterLowCost(!filterLowCost)}
            className="rounded-xl text-xs gap-1.5 h-8 font-semibold shadow-xs"
          >
            {t(`${p}.ui.filterLowCost`)}
          </Button>

          <Button
            type="button"
            variant={filterExotics ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterExotics(!filterExotics)}
            className="rounded-xl text-xs gap-1.5 h-8 font-semibold shadow-xs"
          >
            {t(`${p}.ui.filterExotics`)}
          </Button>

          <Button
            type="button"
            variant={filterDental ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterDental(!filterDental)}
            className="rounded-xl text-xs gap-1.5 h-8 font-semibold shadow-xs"
          >
            {t(`${p}.ui.filterDental`)}
          </Button>

          <Button
            type="button"
            variant={filterTelehealth ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterTelehealth(!filterTelehealth)}
            className="rounded-xl text-xs gap-1.5 h-8 font-semibold shadow-xs"
          >
            {t(`${p}.ui.filterTelehealth`)}
          </Button>

          {(filter24Hour || filterLowCost || filterExotics || filterDental || filterTelehealth) && (
            <button
              type="button"
              onClick={() => {
                setFilter24Hour(false);
                setFilterLowCost(false);
                setFilterExotics(false);
                setFilterDental(false);
                setFilterTelehealth(false);
              }}
              className="text-xs text-primary font-semibold hover:underline px-2"
            >
              {t(`${p}.ui.resetFilters`)}
            </button>
          )}
        </div>
      </div>

      {/* 3. Results Header & Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="text-sm font-semibold text-muted-foreground">
          {t(`${p}.ui.resultsBefore`)} <span className="font-bold text-foreground">{filteredClinics.length}</span> {t(`${p}.ui.resultsAfter`)}
          {searchQuery ? t(`${p}.ui.resultsMatching`, { query: searchQuery }) : ""}
        </div>

        <a
          href={liveGoogleMapsSearchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1.5"
        >
          <Map className="size-3.5" /> {t(`${p}.ui.mapsLink`)}
          <ExternalLink className="size-3" />
        </a>
      </div>

      {/* 4. Results List */}
      {filteredClinics.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border p-10 text-center space-y-4 bg-card">
          <div className="size-14 mx-auto rounded-full bg-muted flex items-center justify-center text-2xl">
            🏥
          </div>
          <div>
            <h3 className="font-display font-bold text-lg">{t(`${p}.ui.emptyTitle`, { query: searchQuery })}</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mt-1">
              {t(`${p}.ui.emptyDesc`, { query: searchQuery })}
            </p>
          </div>
          <div className="flex justify-center gap-3">
            <Button asChild className="rounded-full gap-2 text-xs font-bold">
              <a href={liveGoogleMapsSearchUrl} target="_blank" rel="noopener noreferrer">
                <MapPin className="size-3.5" /> {t(`${p}.ui.emptyMapsButton`, { query: searchQuery })}
              </a>
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setFilter24Hour(false);
                setFilterLowCost(false);
                setFilterExotics(false);
              }}
              className="rounded-full text-xs"
            >
              {t(`${p}.ui.viewAllButton`)}
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredClinics.map((clinic) => {
            const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              `${clinic.name} ${clinic.address} ${clinic.city} ${clinic.state} ${clinic.zipCode}`,
            )}`;

            return (
              <div
                key={clinic.id}
                className={`rounded-3xl border p-5 sm:p-6 shadow-sm transition-all hover:shadow-md flex flex-col justify-between ${
                  clinic.is24HourEmergency
                    ? "border-red-500/30 bg-gradient-to-b from-red-500/5 via-card to-card dark:border-red-950 dark:from-red-950/20"
                    : "border-border/80 bg-card hover:border-primary/40"
                }`}
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {clinic.is24HourEmergency && (
                        <Badge variant="destructive" className="font-bold text-[10px] uppercase tracking-wider">
                          {t(`${p}.ui.filter24h`)}
                        </Badge>
                      )}
                      {clinic.isLowCost && (
                        <Badge variant="secondary" className="font-bold text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">
                          {t(`${p}.ui.badgeLowCost`)}
                        </Badge>
                      )}
                      {clinic.offersExotics && (
                        <Badge variant="outline" className="text-[10px]">
                          {t(`${p}.ui.badgeExotics`)}
                        </Badge>
                      )}
                      {clinic.offersTelehealth && (
                        <Badge variant="outline" className="text-[10px]">
                          {t(`${p}.ui.badgeTelehealth`)}
                        </Badge>
                      )}
                    </div>

                    {clinic.distance !== undefined && (
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full shrink-0">
                        {t(`${p}.ui.distanceMi`, { d: clinic.distance })}
                      </span>
                    )}
                  </div>

                  {/* Clinic Name & Tagline */}
                  <div>
                    <h3 className="font-display font-bold text-lg leading-tight text-foreground flex items-center gap-1.5">
                      {clinic.name}
                      {clinic.verified && (
                        <CheckCircle2 className="size-4 text-primary shrink-0" title={t(`${p}.ui.verifiedTitle`)} />
                      )}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {clinic.tagline}
                    </p>
                  </div>

                  {/* Rating & Hours */}
                  <div className="flex flex-wrap items-center gap-4 text-xs pt-1 border-t border-border/60">
                    <div className="flex items-center gap-1 font-bold text-amber-500">
                      <Star className="size-3.5 fill-amber-400 text-amber-400" />
                      <span>{clinic.rating.toFixed(1)}</span>
                      <span className="text-muted-foreground font-normal">({t(`${p}.ui.reviews`, { count: clinic.reviewCount.toLocaleString() })})</span>
                    </div>

                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="size-3.5 text-slate-500" />
                      <span className={clinic.is24HourEmergency ? "font-bold text-red-600 dark:text-red-400" : ""}>
                        {clinic.hours.weekdays}
                      </span>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <MapPin className="size-3.5 text-primary shrink-0 mt-0.5" />
                    <span>
                      {clinic.address}, {clinic.city}, {clinic.state} {clinic.zipCode}
                    </span>
                  </div>

                  {/* Services Tags */}
                  <div className="pt-2">
                    <div className="text-[11px] font-semibold text-muted-foreground mb-1">{t(`${p}.ui.servicesLabel`)}</div>
                    <div className="flex flex-wrap gap-1">
                      {clinic.services.slice(0, 3).map((s) => (
                        <span
                          key={s}
                          className="text-[10px] bg-muted/60 text-muted-foreground px-2 py-0.5 rounded-md font-medium"
                        >
                          ✓ {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom 1-Click Action Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-5 mt-4 border-t border-border/80">
                  <Button
                    asChild
                    variant={clinic.is24HourEmergency ? "destructive" : "default"}
                    size="sm"
                    className="rounded-xl text-xs font-bold gap-1.5 shadow-xs"
                  >
                    <a href={`tel:${clinic.emergencyPhone || clinic.phone}`}>
                      <Phone className="size-3.5" /> {t(`${p}.ui.callNow`)}
                    </a>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="rounded-xl text-xs font-semibold gap-1.5 shadow-xs"
                  >
                    <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                      <Navigation className="size-3.5 text-primary" /> {t(`${p}.ui.directions`)}
                    </a>
                  </Button>

                  <Button
                    asChild
                    variant="secondary"
                    size="sm"
                    className="rounded-xl text-xs font-semibold gap-1.5 shadow-xs col-span-2 sm:col-span-1"
                  >
                    <a href={clinic.website} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="size-3.5" /> {t(`${p}.ui.websiteButton`)}
                    </a>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. 24/7 Animal Poison Control Hotlines */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-foreground font-display font-bold text-base">
          <Flame className="size-4 text-red-500" /> {t(`${p}.ui.hotlinesTitle`)}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {VET_EMERGENCY_HOTLINES.map((hotline) => (
            <div
              key={hotline.name}
              className="p-4 rounded-2xl border border-border/80 bg-muted/20 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    {hotline.badge}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{hotline.fee}</span>
                </div>
                <h4 className="font-bold text-sm text-foreground">{hotline.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">{hotline.description}</p>
              </div>
              <Button asChild size="sm" className="w-full rounded-xl text-xs font-bold gap-1.5 shadow-xs">
                <a href={`tel:${hotline.phone.replace(/[^0-9+]/g, "")}`}>
                  <Phone className="size-3.5" /> {t(`${p}.ui.hotlineCall`, { phone: hotline.phone })}
                </a>
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Pet Emergency Triage Guide Banner */}
      <div className="rounded-3xl border border-red-500/30 bg-gradient-to-r from-red-500/10 via-amber-500/5 to-background p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-sm">
          <AlertTriangle className="size-4" /> {t(`${p}.ui.triageTitle`)}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-muted-foreground leading-relaxed pt-1">
          <div className="p-3 bg-card rounded-2xl border border-border">
            <strong className="text-foreground block mb-1">{t(`${p}.ui.triageRedTitle`)}</strong>
            {t(`${p}.ui.triageRedBody`)}
          </div>
          <div className="p-3 bg-card rounded-2xl border border-border">
            <strong className="text-foreground block mb-1">{t(`${p}.ui.triageAmberTitle`)}</strong>
            {t(`${p}.ui.triageAmberBody`)}
          </div>
          <div className="p-3 bg-card rounded-2xl border border-border">
            <strong className="text-foreground block mb-1">{t(`${p}.ui.triageDriveTitle`)}</strong>
            {t(`${p}.ui.triageDriveBody`)}
          </div>
        </div>
      </div>
    </div>
  );
}
