import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalculatorLayout } from "@/components/layouts/tool-layouts";
import { useTranslation } from "react-i18next";
import { AlertTriangle, Search, ShieldAlert, MapPin, Pill, Stethoscope, Syringe } from "lucide-react";

/* ─────────── shared ─────────── */
function SectionTitle({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
      <Icon className="h-4 w-4 text-primary" />
      {children}
    </div>
  );
}
function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
function Disclaimer() {
  const { t } = useTranslation("tools");
  return (
    <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
      <strong>{t("shared.disclaimer.title")}</strong> {t("shared.disclaimer.body")}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   1. SYMPTOM CHECKER WIZARD
═══════════════════════════════════════════════════════════ */
type SymptomKey =
  | "vomiting" | "diarrhea" | "lethargy" | "appetite-loss" | "coughing" | "sneezing"
  | "limping" | "itching" | "seizure" | "difficulty-breathing" | "blood-in-stool"
  | "excessive-thirst" | "weight-loss" | "eye-discharge" | "ear-scratching"
  | "bloated-abdomen" | "straining-to-urinate" | "collapse" | "pale-gums" | "ate-poison";

const SYMPTOM_MAP: Record<SymptomKey, { label: string; causes: string[]; urgency: "low" | "medium" | "high" | "emergency" }> = {
  "vomiting":            { label: "Vomiting", urgency: "medium",    causes: ["Dietary indiscretion", "Gastritis", "Pancreatitis", "Foreign body", "Toxin ingestion", "Kidney disease"] },
  "diarrhea":            { label: "Diarrhea", urgency: "medium",    causes: ["Diet change", "Parasites (giardia, worms)", "Bacterial infection", "IBD", "Food intolerance", "Stress colitis"] },
  "lethargy":            { label: "Lethargy / weakness", urgency: "high", causes: ["Infection", "Anemia", "Heart disease", "Endocrine issue (Addison's, hypothyroid)", "Pain", "Toxicity"] },
  "appetite-loss":       { label: "Loss of appetite", urgency: "medium",  causes: ["Dental pain", "GI upset", "Fever", "Kidney or liver disease", "Stress"] },
  "coughing":            { label: "Coughing", urgency: "medium",    causes: ["Kennel cough", "Heart disease", "Collapsing trachea", "Heartworm", "Asthma (cats)"] },
  "sneezing":            { label: "Sneezing", urgency: "low",       causes: ["Allergies", "Upper respiratory infection", "Foreign body in nose", "Dental abscess"] },
  "limping":             { label: "Limping", urgency: "medium",     causes: ["Soft-tissue sprain", "Torn cruciate ligament", "Fracture", "Arthritis", "Paw injury / foreign body"] },
  "itching":             { label: "Itching / scratching", urgency: "low", causes: ["Fleas", "Environmental allergies", "Food allergy", "Mites", "Skin infection"] },
  "seizure":             { label: "Seizure", urgency: "emergency",  causes: ["Idiopathic epilepsy", "Toxin exposure", "Head trauma", "Low blood sugar", "Liver shunt", "Brain tumor"] },
  "difficulty-breathing":{ label: "Difficulty breathing", urgency: "emergency", causes: ["Heart failure", "Pneumonia", "Airway obstruction", "Asthma", "Heatstroke", "Anaphylaxis"] },
  "bloated-abdomen":     { label: "Swollen abdomen / retching without vomiting", urgency: "emergency", causes: ["Bloat (GDV)", "Foreign body", "Internal bleeding", "Toxin ingestion"] },
  "straining-to-urinate":{ label: "Straining to urinate / no urine", urgency: "emergency", causes: ["Urinary blockage", "Bladder stones", "Urinary infection"] },
  "collapse":            { label: "Collapse / can't stand", urgency: "emergency", causes: ["Internal bleeding", "Heart failure", "Heatstroke", "Shock"] },
  "pale-gums":           { label: "Pale, white or blue gums", urgency: "emergency", causes: ["Anemia", "Shock", "Heart failure", "Internal bleeding"] },
  "ate-poison":          { label: "Ate something poisonous", urgency: "emergency", causes: ["Toxin ingestion", "Chocolate toxicity", "Xylitol toxicity"] },
  "blood-in-stool":      { label: "Blood in stool", urgency: "high",causes: ["Parasites", "Hemorrhagic gastroenteritis", "Parvovirus (unvaccinated dogs)", "Colitis", "Foreign body"] },
  "excessive-thirst":    { label: "Excessive thirst / urination", urgency: "high", causes: ["Diabetes", "Kidney disease", "Cushing's disease", "Urinary infection", "Liver disease"] },
  "weight-loss":         { label: "Unexplained weight loss", urgency: "high",causes: ["Hyperthyroidism (cats)", "Diabetes", "Kidney disease", "Cancer", "Chronic parasites", "Malabsorption"] },
  "eye-discharge":       { label: "Eye discharge / redness", urgency: "medium",causes: ["Conjunctivitis", "Corneal ulcer", "Dry eye", "Foreign body", "Glaucoma"] },
  "ear-scratching":      { label: "Ear scratching / head shaking", urgency: "low", causes: ["Ear infection (yeast/bacterial)", "Ear mites", "Foreign body (grass awn)", "Allergies"] },
};

const URGENCY_STYLE = {
  low:       { color: "bg-secondary text-secondary-foreground", note: "Monitor at home. Call your vet if it lasts >48 hours or worsens." },
  medium:    { color: "bg-amber-500/15 text-amber-700 dark:text-amber-400", note: "Book a vet visit within 24–48 hours." },
  high:      { color: "bg-orange-500/15 text-orange-700 dark:text-orange-400", note: "See your vet the same day." },
  emergency: { color: "bg-destructive/15 text-destructive", note: "This is an emergency — go to an emergency vet NOW." },
} as const;

export function SymptomCheckerWizard() {
  const { t } = useTranslation("tools");
  const [species, setSpecies] = useState("dog");
  const [duration, setDuration] = useState("hours");
  const [selected, setSelected] = useState<Set<SymptomKey>>(new Set());

  const toggle = (k: SymptomKey) => {
    const next = new Set(selected);
    next.has(k) ? next.delete(k) : next.add(k);
    setSelected(next);
  };

  const analysis = useMemo(() => {
    if (selected.size === 0) return null;
    const items = Array.from(selected).map((k) => SYMPTOM_MAP[k]);
    const worst = items.reduce((acc, s) => {
      const order = { low: 0, medium: 1, high: 2, emergency: 3 } as const;
      return order[s.urgency] > order[acc] ? s.urgency : acc;
    }, "low" as "low" | "medium" | "high" | "emergency");
    const escalated: typeof worst = duration === "days" && worst === "low" ? "medium" :
                     duration === "week+" && (worst === "low" || worst === "medium") ? "high" : worst;
    // Cats that stop eating risk hepatic lipidosis, so feline appetite loss
    // is never "watch and wait" — it escalates to at least same-day (high).
    const finalUrgency: typeof worst =
      species === "cat" && selected.has("appetite-loss") && (escalated === "low" || escalated === "medium")
        ? "high" : escalated;
    const causes = Array.from(new Set(items.flatMap((s) => s.causes)));
    return { urgency: finalUrgency, causes, items };
  }, [selected, duration, species]);

  return (
    <CalculatorLayout
      form={
        <div className="space-y-4">
          <div>
            <Label>{t("pet-symptom-checker.ui.speciesLabel")}</Label>
            <Select value={species} onValueChange={setSpecies}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["dog","cat","rabbit","bird","reptile","other"].map((sp) => (
                  <SelectItem key={sp} value={sp}>{t(`pet-symptom-checker.ui.species.${sp}`)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>{t("pet-symptom-checker.ui.durationLabel")}</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="hours">{t("pet-symptom-checker.ui.durationHours")}</SelectItem>
                <SelectItem value="1day">{t("pet-symptom-checker.ui.duration1Day")}</SelectItem>
                <SelectItem value="days">{t("pet-symptom-checker.ui.durationDays")}</SelectItem>
                <SelectItem value="week+">{t("pet-symptom-checker.ui.durationWeek")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>{t("pet-symptom-checker.ui.symptomsLabel")}</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {(Object.keys(SYMPTOM_MAP) as SymptomKey[]).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => toggle(k)}
                  className={`rounded-full border px-3 py-1 text-xs transition ${
                    selected.has(k)
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background hover:border-primary/50"
                  }`}
                >{t(`pet-symptom-checker.ui.symptom.${k}`)}</button>
              ))}
            </div>
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          {!analysis && <p className="text-sm text-muted-foreground text-center">{t("pet-symptom-checker.ui.selectSymptomHint")}</p>}
          {analysis && (
            <>
              <div className={`rounded-lg p-4 ${URGENCY_STYLE[analysis.urgency].color}`}>
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide">
                  <AlertTriangle className="h-4 w-4" /> {t(`pet-symptom-checker.ui.urgency.${analysis.urgency}`)} {t("pet-symptom-checker.ui.urgencyWord")}
                </div>
                <p className="mt-1 text-sm">{t(`pet-symptom-checker.ui.urgencyNote.${analysis.urgency}`)}</p>
              </div>
              <div>
                <SectionTitle icon={Stethoscope}>{t("pet-symptom-checker.ui.causesTitle")}</SectionTitle>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {analysis.causes.slice(0, 10).map((c) => <li key={c}>• {t(`pet-symptom-checker.ui.cause.${slugify(c)}`)}</li>)}
                </ul>
              </div>
              <Disclaimer />
            </>
          )}
        </div>
      }
    />
  );
}

/* ═══════════════════════════════════════════════════════════
   2. PILL IDENTIFIER FOR PETS
═══════════════════════════════════════════════════════════ */
const PET_MEDS = [
  { name: "Apoquel", generic: "oclacitinib", use: "Itching and allergies", appearance: "Tablet, scored, film-coated", forms: ["tablet"], species: ["dog"], imprint: "varies", notes: "Not for dogs under 12 months." },
  { name: "Rimadyl", generic: "carprofen", use: "Pain and inflammation", appearance: "Chewable tablet or caplet", forms: ["chewable"], species: ["dog"], imprint: "none", notes: "NSAID — never combine with steroids." },
  { name: "Metacam", generic: "meloxicam", use: "Pain and inflammation", appearance: "Oral liquid", forms: ["liquid"], species: ["dog", "cat"], imprint: "none", notes: "Cats: single-use only in most regions." },
  { name: "Cerenia", generic: "maropitant", use: "Anti-vomiting / motion sickness", appearance: "Small round tablet", forms: ["tablet"], species: ["dog", "cat"], imprint: "varies", notes: "Give 2 hours before travel." },
  { name: "Heartgard Plus", generic: "ivermectin + pyrantel", use: "Heartworm prevention", appearance: "Beef-flavored soft chew", forms: ["chewable"], species: ["dog"], imprint: "none", notes: "Requires a negative heartworm test first." },
  { name: "NexGard", generic: "afoxolaner", use: "Flea and tick prevention", appearance: "Soft chew", forms: ["chewable"], species: ["dog"], imprint: "none", notes: "Isoxazoline class — history of seizures? Discuss with your vet." },
  { name: "Bravecto", generic: "fluralaner", use: "Flea and tick (12 weeks)", appearance: "Chew or spot-on", forms: ["chewable", "spot-on"], species: ["dog", "cat"], imprint: "none", notes: "Isoxazoline class." },
  { name: "Frontline Plus", generic: "fipronil + (S)-methoprene", use: "Flea and tick topical", appearance: "Spot-on pipette", forms: ["spot-on"], species: ["dog", "cat"], imprint: "none", notes: "Do NOT use dog formulations on cats when concentration differs." },
  { name: "Clavamox", generic: "amoxicillin + clavulanate", use: "Broad-spectrum antibiotic", appearance: "Pink/off-white tablet or liquid", forms: ["tablet", "liquid"], species: ["dog", "cat"], imprint: "varies", notes: "Refrigerate liquid; discard after 10 days." },
  { name: "Prednisone", generic: "prednisone / prednisolone", use: "Steroid — inflammation, immune disease", appearance: "White scored tablet", forms: ["tablet"], species: ["dog", "cat"], imprint: "varies", notes: "Never stop abruptly — always taper." },
  { name: "Denamarin", generic: "SAMe + silybin", use: "Liver support", appearance: "Blister-packed tablet", forms: ["tablet"], species: ["dog", "cat"], imprint: "varies", notes: "Give on an empty stomach." },
  { name: "Gabapentin", generic: "gabapentin", use: "Pain, anxiety, seizures", appearance: "Capsule or oral liquid", forms: ["capsule", "liquid"], species: ["dog", "cat"], imprint: "varies", notes: "Xylitol-free liquid formulation only for dogs." },
  { name: "Simparica", generic: "sarolaner", use: "Flea and tick prevention", appearance: "Chewable tablet", forms: ["chewable"], species: ["dog"], imprint: "none", notes: "Isoxazoline class — use with caution in dogs with seizure history." },
  { name: "Credelio", generic: "lotilaner", use: "Flea and tick prevention", appearance: "Chewable tablet", forms: ["chewable"], species: ["dog", "cat"], imprint: "none", notes: "Isoxazoline class; give with food." },
  { name: "Galliprant", generic: "grapiprant", use: "Osteoarthritis pain", appearance: "Flavored tablet", forms: ["tablet"], species: ["dog"], imprint: "varies", notes: "Dog only; give on an empty stomach." },
  { name: "Onsior", generic: "robenacoxib", use: "Pain and inflammation (NSAID)", appearance: "Tablet", forms: ["tablet"], species: ["dog", "cat"], imprint: "varies", notes: "NSAID — do not combine with steroids or other NSAIDs." },
  { name: "Reconcile", generic: "fluoxetine", use: "Anxiety and behavior problems", appearance: "Chewable tablet", forms: ["chewable"], species: ["dog", "cat"], imprint: "none", notes: "Takes weeks for full effect; never stop abruptly." },
  { name: "Trazodone", generic: "trazodone", use: "Anxiety, sedation", appearance: "Tablet", forms: ["tablet"], species: ["dog", "cat"], imprint: "varies", notes: "May cause drowsiness — follow the timing your vet advises." },
  { name: "Baytril", generic: "enrofloxacin", use: "Broad-spectrum antibiotic", appearance: "Tablet", forms: ["tablet"], species: ["dog", "cat"], imprint: "varies", notes: "Avoid in young growing animals unless your vet directs." },
  { name: "Cephalexin", generic: "cephalexin", use: "Skin and soft-tissue antibiotic", appearance: "Capsule or tablet", forms: ["capsule", "tablet"], species: ["dog", "cat"], imprint: "varies", notes: "Give with food if it upsets the stomach." },
  { name: "Metronidazole", generic: "metronidazole", use: "Antibiotic / antiprotozoal (diarrhea, Giardia)", appearance: "Tablet or liquid", forms: ["tablet", "liquid"], species: ["dog", "cat"], imprint: "varies", notes: "Bitter taste; high doses can cause neurologic signs — use only as prescribed." },
  { name: "Felimazole", generic: "methimazole", use: "Hyperthyroidism", appearance: "Coated tablet", forms: ["tablet"], species: ["cat"], imprint: "varies", notes: "Cat only; needs regular blood monitoring." },
  { name: "Vetoryl", generic: "trilostane", use: "Cushing disease", appearance: "Capsule", forms: ["capsule"], species: ["dog"], imprint: "varies", notes: "Give with food; needs regular monitoring." },
  { name: "Thyro-Tabs", generic: "levothyroxine", use: "Hypothyroidism", appearance: "Tablet", forms: ["tablet"], species: ["dog"], imprint: "varies", notes: "Give on an empty stomach; lifelong therapy with blood monitoring." },
  { name: "Revolution", generic: "selamectin", use: "Flea, heartworm, ear mites, some worms", appearance: "Spot-on pipette", forms: ["spot-on"], species: ["dog", "cat"], imprint: "none", notes: "Topical only — never give by mouth." },
  { name: "Advantage II", generic: "imidacloprid + pyriproxyfen", use: "Flea topical", appearance: "Spot-on pipette", forms: ["spot-on"], species: ["dog", "cat"], imprint: "none", notes: "Dog and cat formulas differ — never swap them." },
  { name: "Trifexis", generic: "spinosad + milbemycin oxime", use: "Flea, heartworm, intestinal worms", appearance: "Chewable tablet", forms: ["chewable"], species: ["dog"], imprint: "none", notes: "Dog only; give with food." },
  { name: "Sentinel", generic: "milbemycin oxime + lufenuron", use: "Heartworm, flea egg control, intestinal worms", appearance: "Flavored tablet", forms: ["tablet"], species: ["dog"], imprint: "varies", notes: "Controls flea eggs, not adult fleas." },
  { name: "Interceptor Plus", generic: "milbemycin oxime + praziquantel", use: "Heartworm + intestinal worms incl. tapeworm", appearance: "Chewable tablet", forms: ["chewable"], species: ["dog"], imprint: "none", notes: "Dog only; give monthly as directed." },
  { name: "Drontal Plus", generic: "praziquantel + pyrantel + febantel", use: "Broad dewormer (tapeworm, roundworm, hookworm, whipworm)", appearance: "Tablet", forms: ["tablet"], species: ["dog"], imprint: "varies", notes: "Dog only; may be given with food." },
  { name: "Panacur", generic: "fenbendazole", use: "Dewormer", appearance: "Granules, liquid, or tablet", forms: ["granules", "liquid", "tablet"], species: ["dog", "cat"], imprint: "varies", notes: "Multi-day course — finish all doses." },
  { name: "Benadryl", generic: "diphenhydramine", use: "Allergies, itching, mild sedation", appearance: "Tablet, capsule, or liquid", forms: ["tablet", "capsule", "liquid"], species: ["dog", "cat"], imprint: "varies", notes: "OTC human product — use ONLY plain diphenhydramine; avoid combination formulas (decongestants like pseudoephedrine are toxic to pets)." },
];

export function PillIdentifierForPets() {
  const { t } = useTranslation("tools");
  const [q, setQ] = useState("");
  const [species, setSpecies] = useState<string>("all");
  const [form, setForm] = useState<string>("all");
  const [imprint, setImprint] = useState("");
  const imprintEntered = imprint.trim().length > 0;
  const results = useMemo(() => {
    // Safety rule: this database contains no real imprint codes (they vary by
    // manufacturer and strength), so any entered imprint code is unknown.
    // Never guess a match — return zero results and show the safety box.
    if (imprintEntered) return [];
    const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return PET_MEDS.filter((m) => {
      const speciesOk = species === "all" || m.species.includes(species);
      const formOk = form === "all" || m.forms.includes(form);
      const haystack = `${m.name} ${m.generic} ${m.use} ${m.appearance}`.toLowerCase();
      const textOk = words.every((w) => haystack.includes(w));
      return speciesOk && formOk && textOk;
    });
  }, [q, species, form, imprintEntered]);
  const resetFilters = () => { setQ(""); setSpecies("all"); setForm("all"); setImprint(""); };

  return (
    <CalculatorLayout
      form={
        <div className="space-y-4">
          <div>
            <Label>{t("pet-pill-identifier.ui.searchLabel")}</Label>
            <div className="relative mt-1.5">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("pet-pill-identifier.ui.searchPlaceholder")} className="pl-9" />
            </div>
          </div>
          <div>
            <Label>{t("pet-pill-identifier.ui.speciesLabel")}</Label>
            <Select value={species} onValueChange={setSpecies}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("pet-pill-identifier.ui.speciesAll")}</SelectItem>
                <SelectItem value="dog">{t("pet-pill-identifier.ui.speciesDog")}</SelectItem>
                <SelectItem value="cat">{t("pet-pill-identifier.ui.speciesCat")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>{t("pet-pill-identifier.ui.formLabel")}</Label>
            <Select value={form} onValueChange={setForm}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("pet-pill-identifier.ui.formAll")}</SelectItem>
                <SelectItem value="tablet">{t("pet-pill-identifier.ui.formTablet")}</SelectItem>
                <SelectItem value="capsule">{t("pet-pill-identifier.ui.formCapsule")}</SelectItem>
                <SelectItem value="chewable">{t("pet-pill-identifier.ui.formChewable")}</SelectItem>
                <SelectItem value="liquid">{t("pet-pill-identifier.ui.formLiquid")}</SelectItem>
                <SelectItem value="spot-on">{t("pet-pill-identifier.ui.formSpotOn")}</SelectItem>
                <SelectItem value="granules">{t("pet-pill-identifier.ui.formGranules")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>{t("pet-pill-identifier.ui.imprintLabel")}</Label>
            <Input value={imprint} onChange={(e) => setImprint(e.target.value)} placeholder={t("pet-pill-identifier.ui.imprintPlaceholder")} className="mt-1.5" />
            <p className="mt-1.5 text-xs text-muted-foreground">{t("pet-pill-identifier.ui.imprintNote")}</p>
          </div>
          <Button type="button" variant="outline" onClick={resetFilters} className="w-full">{t("pet-pill-identifier.ui.resetFilters")}</Button>
          <p className="text-xs text-muted-foreground">{t("pet-pill-identifier.ui.databaseNote", { count: PET_MEDS.length })}</p>
        </div>
      }
      result={
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">{t("pet-pill-identifier.ui.showingCount", { count: results.length, total: PET_MEDS.length })}</p>
          {imprintEntered && (
            <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-destructive">
                <ShieldAlert className="h-4 w-4" /> {t("pet-pill-identifier.ui.unknownTitle")}
              </div>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-foreground">
                <li>{t("pet-pill-identifier.ui.unknownStep1")}</li>
                <li>{t("pet-pill-identifier.ui.unknownStep2")}</li>
                <li>{t("pet-pill-identifier.ui.unknownStep3")}</li>
                <li>{t("pet-pill-identifier.ui.unknownStep4")}</li>
              </ol>
            </div>
          )}
          {!imprintEntered && results.length === 0 && <p className="text-sm text-muted-foreground text-center">{t("pet-pill-identifier.ui.noMatches")}</p>}
          {results.map((m) => (
            <div key={m.name} className="rounded-lg border border-border bg-card p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 font-semibold text-foreground">
                    <Pill className="h-4 w-4 text-primary" /> {m.name}
                  </div>
                  <div className="text-xs text-muted-foreground">{t("pet-pill-identifier.ui.genericLabel")}{m.generic}</div>
                </div>
                <div className="flex gap-1">{m.species.map((sp) => <Badge key={sp} variant="secondary" className="text-[10px]">{t(`pet-pill-identifier.ui.badgeSpecies.${sp}`)}</Badge>)}</div>
              </div>
              <div className="mt-2 space-y-1 text-sm">
                <p><span className="text-muted-foreground">{t("pet-pill-identifier.ui.useLabel")}</span> {t(`pet-pill-identifier.ui.med.${slugify(m.name)}.use`)}</p>
                <p><span className="text-muted-foreground">{t("pet-pill-identifier.ui.appearanceLabel")}</span> {t(`pet-pill-identifier.ui.med.${slugify(m.name)}.form`)}</p>
                <p><span className="text-muted-foreground">{t("pet-pill-identifier.ui.imprintCardLabel")}</span> {t(`pet-pill-identifier.ui.imprintValue.${m.imprint}`)}</p>
                <p className="text-xs text-muted-foreground italic">⚠ {t(`pet-pill-identifier.ui.med.${slugify(m.name)}.notes`)}</p>
              </div>
            </div>
          ))}
          <Disclaimer />
        </div>
      }
    />
  );
}

/* ═══════════════════════════════════════════════════════════
   3. POISON LOOKUP DATABASE
═══════════════════════════════════════════════════════════ */
type Severity = "safe" | "caution" | "toxic" | "deadly";
const POISONS: { name: string; category: string; severity: Severity; dog: boolean; cat: boolean; symptoms: string; action: string; aliases?: string }[] = [
  { name: "Chocolate", category: "Food", severity: "toxic", dog: true, cat: true, symptoms: "Vomiting, hyperactivity, tremors, arrhythmia", action: "Call vet or ASPCA Poison Control (888-426-4435). Dark & baker's chocolate most dangerous.", aliases: "candy cocoa cacao theobromine" },
  { name: "Grapes / raisins", category: "Food", severity: "deadly", dog: true, cat: false, symptoms: "Vomiting, lethargy, acute kidney failure within 24–72 h", action: "Emergency vet immediately — no safe dose exists.", aliases: "sultanas currants" },
  { name: "Xylitol", category: "Food additive", severity: "deadly", dog: true, cat: false, symptoms: "Hypoglycemia within 30 min, liver failure within 24 h", action: "Emergency vet NOW. Found in sugar-free gum, peanut butter, toothpaste.", aliases: "birch sugar peanut butter gum e967" },
  { name: "Onion / garlic / chives", category: "Food", severity: "toxic", dog: true, cat: true, symptoms: "Weakness, pale gums, dark urine (hemolytic anemia)", action: "Call vet — cats far more sensitive than dogs.", aliases: "allium leeks shallots scallions spring onion" },
  { name: "Macadamia nuts", category: "Food", severity: "toxic", dog: true, cat: false, symptoms: "Weakness in hind legs, tremors, hyperthermia", action: "Usually self-limits in 24–48 h but call vet.", aliases: "macadamias macadamia nut" },
  { name: "Ibuprofen (Advil)", category: "Human medication", severity: "deadly", dog: true, cat: true, symptoms: "Vomiting, GI ulcers, kidney failure", action: "Emergency vet — even one pill can be fatal to a cat.", aliases: "motrin nurofen nsaid" },
  { name: "Acetaminophen (Tylenol)", category: "Human medication", severity: "deadly", dog: true, cat: true, symptoms: "Brown gums, difficulty breathing, liver failure", action: "Emergency vet. Cats lack the enzyme to metabolize it.", aliases: "paracetamol panadol" },
  { name: "Antifreeze (ethylene glycol)", category: "Household chemical", severity: "deadly", dog: true, cat: true, symptoms: "Drunken gait, then kidney failure within 24–72 h", action: "Emergency vet within 3 hours — antidote is time-critical.", aliases: "coolant" },
  { name: "Lily (Easter, Tiger, Asiatic)", category: "Plant", severity: "deadly", dog: false, cat: true, symptoms: "Vomiting, lethargy, kidney failure within 24–72 h", action: "Emergency vet — even pollen or vase water can kill a cat.", aliases: "daylily day lily true lily lilies lillies" },
  { name: "Sago palm", category: "Plant", severity: "deadly", dog: true, cat: true, symptoms: "Vomiting, dark stool, liver failure", action: "Emergency vet — 50%+ mortality even with treatment.", aliases: "cycad coontie palm" },
  { name: "Rodenticide", category: "Poison bait", severity: "deadly", dog: true, cat: true, symptoms: "Bleeding, weakness, seizures (varies by type)", action: "Emergency vet — bring packaging so vet identifies active ingredient.", aliases: "rat poison rat bait mouse poison warfarin" },
  { name: "Marijuana / THC", category: "Recreational", severity: "toxic", dog: true, cat: true, symptoms: "Wobbly gait, dilated pupils, urine dribbling", action: "Vet — recovery usually 12–24 h; edibles with chocolate/xylitol more dangerous.", aliases: "cannabis weed edibles pot hash" },
  { name: "Caffeine", category: "Food", severity: "toxic", dog: true, cat: true, symptoms: "Restlessness, arrhythmia, seizures", action: "Vet if a coffee grounds / tea / caffeine pill ingestion.", aliases: "coffee energy drink espresso tea cola" },
  { name: "Bleach (concentrated)", category: "Household chemical", severity: "toxic", dog: true, cat: true, symptoms: "Drooling, oral ulcers, vomiting", action: "Rinse mouth with water/milk — do NOT induce vomiting. Call poison control.", aliases: "chlorine disinfectant" },
  { name: "Ibuprofen gel / patch", category: "Human medication", severity: "toxic", dog: true, cat: true, symptoms: "Kidney damage from skin contact or chewing", action: "Wash affected fur, call vet.", aliases: "ibuprofen gel patch diclofenac voltaren topical nsaid" },
  { name: "Alcohol", category: "Beverage", severity: "toxic", dog: true, cat: true, symptoms: "Depression, hypothermia, low blood sugar", action: "Emergency vet — even mouthwash or raw bread dough (fermenting) is dangerous.", aliases: "ethanol beer wine spirits liquor" },
  { name: "Raw yeast dough", category: "Food", severity: "toxic", dog: true, cat: true, symptoms: "Bloated abdomen, alcohol toxicity, GI rupture", action: "Emergency vet immediately.", aliases: "yeast pizza dough" },
  { name: "Essential oils (tea tree, peppermint, pine)", category: "Household", severity: "toxic", dog: true, cat: true, symptoms: "Drooling, tremors, liver damage (cats)", action: "Wash off skin, vet visit. Cats extremely sensitive.", aliases: "melaleuca tea tree oil diffuser oils" },
  { name: "Cocoa mulch", category: "Garden", severity: "toxic", dog: true, cat: false, symptoms: "Same as chocolate toxicity", action: "Vet — contains theobromine.", aliases: "cocoa husks mulch" },
  { name: "Fertilizer (with iron/insecticide)", category: "Garden", severity: "toxic", dog: true, cat: true, symptoms: "Vomiting, tremors, iron toxicity", action: "Call poison control with product name.", aliases: "plant food bone meal blood meal" },
  { name: "Sugarless gum (any Xylitol)", category: "Food", severity: "deadly", dog: true, cat: false, symptoms: "See Xylitol above", action: "Emergency vet immediately.", aliases: "sugar-free gum chewing gum sugarfree candy" },
  { name: "Bread dough (uncooked)", category: "Food", severity: "toxic", dog: true, cat: true, symptoms: "Bloat, ethanol toxicity", action: "Emergency vet.", aliases: "yeast dough pizza dough" },
  { name: "Avocado (large amounts / pit)", category: "Food", severity: "caution", dog: true, cat: true, symptoms: "Mild GI upset in dogs/cats; pit is choking + obstruction risk", action: "Small flesh amounts usually fine for dogs; avoid for birds & rabbits (deadly).", aliases: "persin guacamole" },
  { name: "Milk / dairy", category: "Food", severity: "caution", dog: true, cat: true, symptoms: "Diarrhea, gas (lactose intolerance)", action: "Not toxic — just uncomfortable. Avoid.", aliases: "lactose cheese cream" },
  { name: "Cooked bones", category: "Food", severity: "toxic", dog: true, cat: true, symptoms: "Splinters causing choking, GI perforation", action: "Never feed cooked bones. Emergency vet if swallowed.", aliases: "chicken bones bone splinters" },
];

export function PoisonLookupDatabase() {
  const { t } = useTranslation("tools");
  const [q, setQ] = useState("");
  const [species, setSpecies] = useState<"dog" | "cat" | "all">("all");
  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    return POISONS
      .filter((p) => (species === "all") || (species === "dog" ? p.dog : p.cat))
      .filter((p) => !query || `${p.name} ${p.category} ${p.symptoms} ${p.aliases ?? ""}`.toLowerCase().includes(query))
      .sort((a, b) => {
        const rank = { deadly: 0, toxic: 1, caution: 2, safe: 3 };
        return rank[a.severity] - rank[b.severity];
      });
  }, [q, species]);

  const badge = (s: Severity) => {
    const map: Record<Severity, string> = {
      safe: "bg-green-500/15 text-green-700 dark:text-green-400",
      caution: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
      toxic: "bg-orange-500/15 text-orange-700 dark:text-orange-400",
      deadly: "bg-destructive/15 text-destructive",
    };
    return <Badge className={`${map[s]} border-0 text-[10px] uppercase`}>{t(`pet-poison-lookup.ui.severity.${s}`)}</Badge>;
  };

  return (
    <CalculatorLayout
      form={
        <div className="space-y-4">
          <div>
            <Label>{t("pet-poison-lookup.ui.searchLabel")}</Label>
            <div className="relative mt-1.5">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("pet-poison-lookup.ui.searchPlaceholder")} className="pl-9" />
            </div>
          </div>
          <div>
            <Label>{t("pet-poison-lookup.ui.speciesLabel")}</Label>
            <Select value={species} onValueChange={(v: "dog" | "cat" | "all") => setSpecies(v)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("pet-poison-lookup.ui.speciesBoth")}</SelectItem>
                <SelectItem value="dog">{t("pet-poison-lookup.ui.speciesDog")}</SelectItem>
                <SelectItem value="cat">{t("pet-poison-lookup.ui.speciesCat")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-xs">
            <div className="flex items-center gap-2 font-semibold text-destructive"><ShieldAlert className="h-4 w-4" /> {t("pet-poison-lookup.ui.ingestedTitle")}</div>
            <p className="mt-1 text-destructive/90">
              <strong>{t("pet-poison-lookup.ui.aspcaLabel")}</strong> +1 (888) 426-4435 · <strong>{t("pet-poison-lookup.ui.helplineLabel")}</strong> +1 (855) 764-7661 {t("pet-poison-lookup.ui.helplineNote")}
            </p>
          </div>
        </div>
      }
      result={
        <div className="space-y-3">
          {results.length === 0 && <p className="text-sm text-muted-foreground text-center">{t("pet-poison-lookup.ui.noMatches")}</p>}
          {results.map((p) => (
            <div key={p.name} className="rounded-lg border border-border bg-card p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="font-semibold text-foreground">{t(`pet-poison-lookup.ui.poison.${slugify(p.name)}.name`)}</div>
                {badge(p.severity)}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{t(`pet-poison-lookup.ui.category.${slugify(p.category)}`)}</div>
              <p className="mt-2 text-sm"><span className="text-muted-foreground">{t("pet-poison-lookup.ui.symptomsLabel")}</span> {t(`pet-poison-lookup.ui.poison.${slugify(p.name)}.symptoms`)}</p>
              <p className="mt-1 text-sm"><span className="text-muted-foreground">{t("pet-poison-lookup.ui.actionLabel")}</span> {t(`pet-poison-lookup.ui.poison.${slugify(p.name)}.action`)}</p>
            </div>
          ))}
          <Disclaimer />
        </div>
      }
    />
  );
}

/* ═══════════════════════════════════════════════════════════
   4. VACCINE SCHEDULE GENERATOR
═══════════════════════════════════════════════════════════ */
type Vaccine = { name: string; age: string; core: boolean; notes: string };
const DOG_VACCINES: Vaccine[] = [
  { name: "DAPP (Distemper, Adenovirus, Parvo, Parainfluenza)", age: "8 weeks", core: true, notes: "First in puppy series" },
  { name: "DAPP booster + Leptospirosis #1", age: "12 weeks", core: true, notes: "Second in series; lepto if at risk (2-dose series)" },
  { name: "DAPP booster + Rabies + Leptospirosis #2", age: "16 weeks", core: true, notes: "Final puppy boosters; rabies required by law in most regions" },
  { name: "Bordetella (kennel cough)", age: "8+ weeks", core: false, notes: "Required for boarding/daycare" },
  { name: "Canine Influenza (H3N2/H3N8)", age: "8+ weeks", core: false, notes: "Recommended if boarding or in outbreak areas" },
  { name: "Lyme", age: "12+ weeks", core: false, notes: "Tick-endemic regions only" },
  { name: "DAPP + Rabies (1-year booster)", age: "1 year", core: true, notes: "First adult boosters" },
  { name: "DAPP + Rabies (3-yr)", age: "Every 3 years", core: true, notes: "Adult maintenance — titers optional; lepto/bordetella boosted annually if used" },
];
const CAT_VACCINES: Vaccine[] = [
  { name: "FVRCP (Herpes, Calici, Panleuk)", age: "8 weeks", core: true, notes: "First in kitten series" },
  { name: "FVRCP booster (2nd)", age: "12 weeks", core: true, notes: "Second in series" },
  { name: "FVRCP booster (3rd)", age: "16 weeks", core: true, notes: "Final kitten booster" },
  { name: "FeLV (leukemia)", age: "8+ weeks", core: false, notes: "2 doses, 3–4 weeks apart — for kittens/cats with outdoor or multi-cat risk" },
  { name: "Rabies", age: "12–16 weeks", core: true, notes: "Single dose; legally required in many regions — follow local law" },
  { name: "FVRCP + Rabies (1-year booster)", age: "1 year", core: true, notes: "First adult boosters" },
  { name: "FeLV booster (at-risk adults)", age: "Every 1–2 years", core: false, notes: "Only for cats with ongoing outdoor/multi-cat exposure" },
  { name: "FVRCP (3-yr)", age: "Every 3 years", core: true, notes: "Adult maintenance; rabies boosters per local law (1- or 3-year products)" },
];
const RABBIT_VACCINES: Vaccine[] = [
  { name: "RHDV2 (Rabbit Hemorrhagic Disease)", age: "7+ weeks", core: true, notes: "Two-dose start, 3 weeks apart, then annual — now essential in most of US/EU" },
  { name: "Myxomatosis", age: "5 weeks", core: true, notes: "Where available (EU/UK)" },
  { name: "Annual boosters", age: "Yearly", core: true, notes: "Both RHDV & myxo — combined available" },
];
const FERRET_VACCINES: Vaccine[] = [
  { name: "Canine Distemper", age: "8, 11, 14 weeks", core: true, notes: "Ferret-approved formulation" },
  { name: "Rabies", age: "12+ weeks", core: true, notes: "Annual" },
];

export function VaccineScheduleGenerator() {
  const { t } = useTranslation("tools");
  const [species, setSpecies] = useState<"dog" | "cat" | "rabbit" | "ferret">("dog");
  const [months, setMonths] = useState(3);

  const table = { dog: DOG_VACCINES, cat: CAT_VACCINES, rabbit: RABBIT_VACCINES, ferret: FERRET_VACCINES }[species];
  const stageKey = months < 4 ? "puppy" : months < 12 ? "juvenile" : "adult";
  const next = table.find((v) => {
    const match = v.age.match(/(\d+)/);
    const age = match ? Number(match[1]) : 999;
    const w = v.age.includes("week") ? age / 4 : v.age.includes("year") ? age * 12 : age;
    return w > months;
  });

  return (
    <CalculatorLayout
      form={
        <div className="space-y-4">
          <div>
            <Label>{t("pet-vaccine-schedule-generator.ui.speciesLabel")}</Label>
            <Select value={species} onValueChange={(v) => setSpecies(v as typeof species)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="dog">{t("pet-vaccine-schedule-generator.ui.speciesDog")}</SelectItem>
                <SelectItem value="cat">{t("pet-vaccine-schedule-generator.ui.speciesCat")}</SelectItem>
                <SelectItem value="rabbit">{t("pet-vaccine-schedule-generator.ui.speciesRabbit")}</SelectItem>
                <SelectItem value="ferret">{t("pet-vaccine-schedule-generator.ui.speciesFerret")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>{t("pet-vaccine-schedule-generator.ui.ageLabel")}</Label>
            <Input type="number" min={0} step={0.5} value={months} onChange={(e) => setMonths(Math.max(0, Number(e.target.value) || 0))} className="mt-1.5" />
          </div>
        </div>
      }
      result={
        <div className="space-y-3">
          <div className="rounded-lg bg-primary/10 p-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary"><Syringe className="h-4 w-4" /> {t("pet-vaccine-schedule-generator.ui.lifeStagePrefix")}{t(`pet-vaccine-schedule-generator.ui.stage.${stageKey}`)}</div>
            {next && <p className="mt-1 text-sm text-muted-foreground">{t("pet-vaccine-schedule-generator.ui.nextUpPrefix")}<strong>{t(`pet-vaccine-schedule-generator.ui.vaccine.${species}.${slugify(next.name)}.name`)}</strong>{t("pet-vaccine-schedule-generator.ui.nextUpSuffix", { age: t(`pet-vaccine-schedule-generator.ui.vaccine.${species}.${slugify(next.name)}.age`) })}</p>}
          </div>
          <div className="space-y-2">
            {table.map((v) => (
              <div key={v.name} className="rounded-md border border-border p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="text-sm font-medium">{t(`pet-vaccine-schedule-generator.ui.vaccine.${species}.${slugify(v.name)}.name`)}</div>
                  <Badge variant={v.core ? "default" : "secondary"} className="text-[10px]">{v.core ? t("pet-vaccine-schedule-generator.ui.badgeCore") : t("pet-vaccine-schedule-generator.ui.badgeOptional")}</Badge>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{t(`pet-vaccine-schedule-generator.ui.vaccine.${species}.${slugify(v.name)}.age`)} · {t(`pet-vaccine-schedule-generator.ui.vaccine.${species}.${slugify(v.name)}.notes`)}</div>
              </div>
            ))}
          </div>
          <Disclaimer />
        </div>
      }
    />
  );
}

/* ═══════════════════════════════════════════════════════════
   5. EMERGENCY VET FINDER
═══════════════════════════════════════════════════════════ */
export function EmergencyVetFinder() {
  const { t } = useTranslation("tools");
  const [zip, setZip] = useState("");
  const [loc, setLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [status, setStatus] = useState<string>("");

  const useMyLocation = () => {
    if (!navigator.geolocation) { setStatus(t("shared.EmergencyVetFinder.ui.geoUnsupported")); return; }
    setStatus(t("shared.EmergencyVetFinder.ui.locating"));
    navigator.geolocation.getCurrentPosition(
      (pos) => { setLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setStatus(""); },
      (err) => setStatus(t("shared.EmergencyVetFinder.ui.geoError", { message: err.message })),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const mapsLink = loc
    ? `https://www.google.com/maps/search/emergency+veterinarian/@${loc.lat},${loc.lng},13z`
    : zip.trim()
      ? `https://www.google.com/maps/search/emergency+veterinarian+near+${encodeURIComponent(zip.trim())}`
      : null;
  const appleLink = loc
    ? `https://maps.apple.com/?q=emergency+veterinarian&sll=${loc.lat},${loc.lng}`
    : zip.trim()
      ? `https://maps.apple.com/?q=emergency+veterinarian+${encodeURIComponent(zip.trim())}`
      : null;

  return (
    <CalculatorLayout
      form={
        <div className="space-y-4">
          <Button type="button" onClick={useMyLocation} className="w-full"><MapPin className="mr-2 h-4 w-4" /> {t("shared.EmergencyVetFinder.ui.useLocation")}</Button>
          <div className="relative flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">{t("shared.EmergencyVetFinder.ui.orDivider")}</span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <div>
            <Label>{t("shared.EmergencyVetFinder.ui.zipLabel")}</Label>
            <Input value={zip} onChange={(e) => setZip(e.target.value)} placeholder={t("shared.EmergencyVetFinder.ui.zipPlaceholder")} className="mt-1.5" />
          </div>
          {status && <p className="text-xs text-muted-foreground">{status}</p>}
        </div>
      }
      result={
        <div className="space-y-4">
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-destructive"><ShieldAlert className="h-4 w-4" /> {t("shared.EmergencyVetFinder.ui.hotlinesTitle")}</div>
            <ul className="mt-2 space-y-1 text-sm">
              <li><strong>{t("shared.EmergencyVetFinder.ui.aspcaLabel")}</strong> <a className="underline" href="tel:+18884264435">+1 (888) 426-4435</a></li>
              <li><strong>{t("shared.EmergencyVetFinder.ui.helplineLabel")}</strong> <a className="underline" href="tel:+18557647661">+1 (855) 764-7661</a></li>
              <li><strong>{t("shared.EmergencyVetFinder.ui.ukLabel")}</strong> <a className="underline" href="tel:+442073055055">+44 20 7305 5055</a></li>
            </ul>
          </div>
          {mapsLink && (
            <div className="space-y-2">
              <SectionTitle icon={MapPin}>{t("shared.EmergencyVetFinder.ui.nearbyTitle")}</SectionTitle>
              <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="block rounded-md border border-primary bg-primary/10 p-3 text-sm font-semibold text-primary hover:bg-primary/20">
                {t("shared.EmergencyVetFinder.ui.openGoogle")}
              </a>
              {appleLink && (
                <a href={appleLink} target="_blank" rel="noopener noreferrer" className="block rounded-md border border-border bg-card p-3 text-sm hover:bg-muted">
                  {t("shared.EmergencyVetFinder.ui.openApple")}
                </a>
              )}
            </div>
          )}
          {!mapsLink && <p className="text-sm text-muted-foreground text-center">{t("shared.EmergencyVetFinder.ui.shareHint")}</p>}
          <div className="rounded-md border border-border bg-card p-3 text-xs text-muted-foreground">
            <strong>{t("shared.EmergencyVetFinder.ui.whileTravelTitle")}</strong> {t("shared.EmergencyVetFinder.ui.whileTravelBody")}
          </div>
        </div>
      }
    />
  );
}

/* ═══════════════════════════════════════════════════════════
   6. BLOOD TEST RESULT EXPLAINER
═══════════════════════════════════════════════════════════ */
type LabDef = { key: string; label: string; unit: string; dogLow: number; dogHigh: number; catLow: number; catHigh: number; high: string; low: string };
const LABS: LabDef[] = [
  { key: "wbc", label: "WBC (white blood cells)", unit: "K/µL", dogLow: 6, dogHigh: 17, catLow: 5.5, catHigh: 19.5,
    high: "Infection, inflammation, stress, leukemia", low: "Bone marrow suppression, viral infection, sepsis" },
  { key: "rbc", label: "RBC (red blood cells)", unit: "M/µL", dogLow: 5.5, dogHigh: 8.5, catLow: 6.5, catHigh: 10,
    high: "Dehydration, polycythemia", low: "Anemia — bleeding, iron loss, kidney disease" },
  { key: "hct", label: "HCT / PCV (hematocrit)", unit: "%", dogLow: 37, dogHigh: 55, catLow: 30, catHigh: 45,
    high: "Dehydration", low: "Anemia (many causes — always investigate)" },
  { key: "plt", label: "Platelets", unit: "K/µL", dogLow: 200, dogHigh: 500, catLow: 200, catHigh: 500,
    high: "Inflammation, iron deficiency (usually mild)", low: "Immune-mediated destruction, tick-borne disease, bone marrow issue" },
  { key: "bun", label: "BUN (blood urea nitrogen)", unit: "mg/dL", dogLow: 7, dogHigh: 27, catLow: 16, catHigh: 36,
    high: "Kidney disease, dehydration, high-protein meal, GI bleeding", low: "Liver disease, low-protein diet" },
  { key: "cre", label: "Creatinine", unit: "mg/dL", dogLow: 0.5, dogHigh: 1.8, catLow: 0.8, catHigh: 2.4,
    high: "Kidney disease, dehydration, urinary obstruction", low: "Low muscle mass — usually not concerning" },
  { key: "alt", label: "ALT (liver enzyme)", unit: "U/L", dogLow: 10, dogHigh: 125, catLow: 12, catHigh: 130,
    high: "Liver damage — toxins, medications, hepatitis", low: "Rare, usually meaningless" },
  { key: "alp", label: "ALP (alkaline phosphatase)", unit: "U/L", dogLow: 20, dogHigh: 150, catLow: 10, catHigh: 90,
    high: "Cushing's, steroids, bile stasis, bone growth", low: "Rare" },
  { key: "glu", label: "Glucose", unit: "mg/dL", dogLow: 74, dogHigh: 143, catLow: 71, catHigh: 159,
    high: "Diabetes, stress (cats), post-meal", low: "Insulin overdose, sepsis, insulinoma, liver failure" },
  { key: "tp", label: "Total protein", unit: "g/dL", dogLow: 5.4, dogHigh: 7.5, catLow: 6, catHigh: 8.5,
    high: "Dehydration, chronic inflammation", low: "Blood loss, protein-losing enteropathy/nephropathy, liver failure" },
  { key: "alb", label: "Albumin", unit: "g/dL", dogLow: 2.5, dogHigh: 4, catLow: 2.5, catHigh: 3.9,
    high: "Dehydration", low: "Liver failure, kidney/GI loss, chronic disease" },
  { key: "k", label: "Potassium", unit: "mEq/L", dogLow: 3.5, dogHigh: 5.5, catLow: 3.5, catHigh: 5.5,
    high: "Urinary obstruction, Addison's, kidney failure — dangerous to heart", low: "Vomiting, diarrhea, diuretics" },
];

type LabStatus = "low" | "normal" | "high";
export function BloodTestExplainer() {
  const { t } = useTranslation("tools");
  const [species, setSpecies] = useState<"dog" | "cat">("dog");
  const [values, setValues] = useState<Record<string, string>>({});
  const setV = (k: string, v: string) => setValues((prev) => ({ ...prev, [k]: v }));

  const rows = LABS.map((l) => {
    const raw = values[l.key];
    const n = raw ? Number(raw) : NaN;
    const low = species === "dog" ? l.dogLow : l.catLow;
    const high = species === "dog" ? l.dogHigh : l.catHigh;
    let status: LabStatus | null = null;
    if (!isNaN(n) && raw) status = n < low ? "low" : n > high ? "high" : "normal";
    return { def: l, value: raw ?? "", n, low, high, status };
  });
  const flagged = rows.filter((r) => r.status && r.status !== "normal");

  const statusBadge = (s: LabStatus | null) => {
    if (!s) return null;
    const map = { low: "bg-blue-500/15 text-blue-700 dark:text-blue-400", normal: "bg-green-500/15 text-green-700 dark:text-green-400", high: "bg-destructive/15 text-destructive" } as const;
    return <Badge className={`${map[s]} border-0 text-[10px] uppercase`}>{t(`pet-blood-test-explainer.ui.status.${s}`)}</Badge>;
  };

  return (
    <CalculatorLayout
      form={
        <div className="space-y-4">
          <div>
            <Label>{t("pet-blood-test-explainer.ui.speciesLabel")}</Label>
            <Select value={species} onValueChange={(v: "dog" | "cat") => setSpecies(v)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="dog">{t("pet-blood-test-explainer.ui.speciesDog")}</SelectItem>
                <SelectItem value="cat">{t("pet-blood-test-explainer.ui.speciesCat")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {LABS.map((l) => (
              <div key={l.key} className="grid grid-cols-[1fr_100px] items-center gap-2">
                <Label className="text-xs">{t(`pet-blood-test-explainer.ui.lab.${l.key}.label`)} <span className="text-muted-foreground">({l.unit})</span></Label>
                <Input type="number" step="0.1" value={values[l.key] ?? ""} onChange={(e) => setV(l.key, e.target.value)} placeholder="—" />
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">{t("pet-blood-test-explainer.ui.enterHint")}</p>
        </div>
      }
      result={
        <div className="space-y-3">
          {rows.every((r) => r.status === null) && <p className="text-sm text-muted-foreground text-center">{t("pet-blood-test-explainer.ui.emptyHint")}</p>}
          {flagged.length > 0 && (
            <div className="rounded-md border border-amber-500/30 bg-amber-500/10 p-3 text-sm">
              <strong className="text-amber-700 dark:text-amber-400">{t("pet-blood-test-explainer.ui.outsideRange", { count: flagged.length })}</strong>
              <p className="text-xs text-muted-foreground mt-1">{t("pet-blood-test-explainer.ui.discussNote")}</p>
            </div>
          )}
          {rows.filter((r) => r.status).map((r) => (
            <div key={r.def.key} className="rounded-lg border border-border bg-card p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-semibold">{t(`pet-blood-test-explainer.ui.lab.${r.def.key}.label`)}</div>
                  <div className="text-xs text-muted-foreground">{t("pet-blood-test-explainer.ui.yourValue")} <strong>{r.value} {r.def.unit}</strong> · {t("pet-blood-test-explainer.ui.referenceRange", { low: r.low, high: r.high })}</div>
                </div>
                {statusBadge(r.status)}
              </div>
              {r.status === "high" && <p className="mt-2 text-sm">{t(`pet-blood-test-explainer.ui.lab.${r.def.key}.high`)}</p>}
              {r.status === "low"  && <p className="mt-2 text-sm">{t(`pet-blood-test-explainer.ui.lab.${r.def.key}.low`)}</p>}
            </div>
          ))}
          <Disclaimer />
        </div>
      }
    />
  );
}

// Silence unused-import warning when Textarea isn't consumed by every export.
export const __unused = Textarea;
