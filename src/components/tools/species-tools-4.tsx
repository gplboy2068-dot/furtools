import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalculatorLayout } from "@/components/layouts/tool-layouts";
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
function Disclaimer() {
  return (
    <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
      <strong>Educational only.</strong> This tool does not diagnose disease or replace veterinary care.
      For any emergency call your vet or a 24/7 animal poison control line immediately.
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   1. SYMPTOM CHECKER WIZARD
═══════════════════════════════════════════════════════════ */
type SymptomKey =
  | "vomiting" | "diarrhea" | "lethargy" | "appetite-loss" | "coughing" | "sneezing"
  | "limping" | "itching" | "seizure" | "difficulty-breathing" | "blood-in-stool"
  | "excessive-thirst" | "weight-loss" | "eye-discharge" | "ear-scratching";

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
    const causes = Array.from(new Set(items.flatMap((s) => s.causes)));
    return { urgency: escalated, causes, items };
  }, [selected, duration]);

  return (
    <CalculatorLayout
      form={
        <div className="space-y-4">
          <div>
            <Label>Species</Label>
            <Select value={species} onValueChange={setSpecies}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["dog","cat","rabbit","bird","reptile","other"].map((s) => (
                  <SelectItem key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>How long?</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="hours">A few hours</SelectItem>
                <SelectItem value="1day">About 1 day</SelectItem>
                <SelectItem value="days">2–3 days</SelectItem>
                <SelectItem value="week+">A week or more</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Symptoms (tap all that apply)</Label>
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
                >{SYMPTOM_MAP[k].label}</button>
              ))}
            </div>
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          {!analysis && <p className="text-sm text-muted-foreground text-center">Select at least one symptom to see possible causes.</p>}
          {analysis && (
            <>
              <div className={`rounded-lg p-4 ${URGENCY_STYLE[analysis.urgency].color}`}>
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide">
                  <AlertTriangle className="h-4 w-4" /> {analysis.urgency} urgency
                </div>
                <p className="mt-1 text-sm">{URGENCY_STYLE[analysis.urgency].note}</p>
              </div>
              <div>
                <SectionTitle icon={Stethoscope}>Possible causes to discuss with your vet</SectionTitle>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {analysis.causes.slice(0, 10).map((c) => <li key={c}>• {c}</li>)}
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
  { name: "Apoquel", generic: "oclacitinib", use: "Itching & allergies (dogs)", form: "Tablet, scored, film-coated", species: ["dog"], notes: "Not for dogs <12 months." },
  { name: "Rimadyl", generic: "carprofen", use: "Pain & inflammation (dogs)", form: "Chewable tablet or caplet", species: ["dog"], notes: "NSAID — never combine with steroids." },
  { name: "Metacam", generic: "meloxicam", use: "Pain & inflammation", form: "Oral liquid", species: ["dog", "cat"], notes: "Cats: single-use only in most regions." },
  { name: "Cerenia", generic: "maropitant", use: "Anti-vomiting / motion sickness", form: "Small round tablet", species: ["dog", "cat"], notes: "Give 2 h before travel." },
  { name: "Heartgard Plus", generic: "ivermectin + pyrantel", use: "Heartworm prevention", form: "Beef-flavored soft chew", species: ["dog"], notes: "Requires negative heartworm test first." },
  { name: "NexGard", generic: "afoxolaner", use: "Flea & tick prevention", form: "Soft chew", species: ["dog"], notes: "Isoxazoline class — history of seizures? discuss with vet." },
  { name: "Bravecto", generic: "fluralaner", use: "Flea & tick (12 weeks)", form: "Chew or spot-on", species: ["dog", "cat"], notes: "Isoxazoline class." },
  { name: "Frontline Plus", generic: "fipronil + methoprene", use: "Flea & tick topical", form: "Spot-on pipette", species: ["dog", "cat"], notes: "Do NOT use dog Frontline formulations on cats when concentration differs." },
  { name: "Clavamox", generic: "amoxicillin + clavulanate", use: "Broad-spectrum antibiotic", form: "Pink/off-white tablet or liquid", species: ["dog", "cat"], notes: "Refrigerate liquid; discard after 10 days." },
  { name: "Prednisone", generic: "prednisone / prednisolone", use: "Steroid — inflammation, immune disease", form: "White scored tablet", species: ["dog", "cat"], notes: "Never stop abruptly — always taper." },
  { name: "Denamarin", generic: "SAMe + silybin", use: "Liver support", form: "Blister-packed tablet", species: ["dog", "cat"], notes: "Give on empty stomach." },
  { name: "Gabapentin", generic: "gabapentin", use: "Pain, anxiety, seizures", form: "Capsule or oral liquid", species: ["dog", "cat"], notes: "Xylitol-free liquid formulation only for dogs." },
  { name: "Trazodone", generic: "trazodone", use: "Situational anxiety", form: "White scored tablet", species: ["dog", "cat"], notes: "Common for vet visits or fireworks." },
  { name: "Vetmedin", generic: "pimobendan", use: "Heart failure (dogs)", form: "Chewable tablet", species: ["dog"], notes: "Give 1 h before food for best absorption." },
  { name: "Methimazole", generic: "methimazole", use: "Hyperthyroidism (cats)", form: "Small tablet or transdermal gel", species: ["cat"], notes: "Wear gloves when handling — human hormone risk." },
  { name: "Insulin (Vetsulin)", generic: "porcine insulin zinc", use: "Diabetes", form: "Injectable, cloudy suspension", species: ["dog", "cat"], notes: "Roll — never shake. Refrigerate." },
  { name: "Atopica", generic: "cyclosporine", use: "Atopic dermatitis", form: "Soft gelatin capsule", species: ["dog", "cat"], notes: "Give on empty stomach." },
  { name: "Milbemax", generic: "milbemycin + praziquantel", use: "Dewormer", form: "Small film-coated tablet", species: ["dog", "cat"], notes: "Rule out heartworm first." },
  { name: "Otomax / Mometamax", generic: "gentamicin + betamethasone + clotrimazole", use: "Ear infection", form: "Ear drops", species: ["dog"], notes: "Confirm eardrum is intact." },
  { name: "Enalapril", generic: "enalapril", use: "Heart failure & hypertension", form: "White scored tablet", species: ["dog", "cat"], notes: "ACE inhibitor — monitor kidney values." },
  { name: "Furosemide", generic: "furosemide", use: "Diuretic for heart failure", form: "White scored tablet", species: ["dog", "cat"], notes: "Ensure constant water access." },
];

export function PillIdentifierForPets() {
  const [q, setQ] = useState("");
  const [species, setSpecies] = useState<string>("all");
  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    return PET_MEDS.filter((m) => {
      const speciesOk = species === "all" || m.species.includes(species);
      const textOk = !query ||
        m.name.toLowerCase().includes(query) ||
        m.generic.toLowerCase().includes(query) ||
        m.use.toLowerCase().includes(query) ||
        m.form.toLowerCase().includes(query);
      return speciesOk && textOk;
    });
  }, [q, species]);

  return (
    <CalculatorLayout
      form={
        <div className="space-y-4">
          <div>
            <Label>Search by name, generic, use, or shape</Label>
            <div className="relative mt-1.5">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. carprofen, white scored tablet" className="pl-9" />
            </div>
          </div>
          <div>
            <Label>Species</Label>
            <Select value={species} onValueChange={setSpecies}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="dog">Dog</SelectItem>
                <SelectItem value="cat">Cat</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-muted-foreground">Database: {PET_MEDS.length} common veterinary medications. Always confirm identity with your vet before administering.</p>
        </div>
      }
      result={
        <div className="space-y-3">
          {results.length === 0 && <p className="text-sm text-muted-foreground text-center">No matches. Try a different keyword.</p>}
          {results.slice(0, 12).map((m) => (
            <div key={m.name} className="rounded-lg border border-border bg-card p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 font-semibold text-foreground">
                    <Pill className="h-4 w-4 text-primary" /> {m.name}
                  </div>
                  <div className="text-xs text-muted-foreground">Generic: {m.generic}</div>
                </div>
                <div className="flex gap-1">{m.species.map((s) => <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>)}</div>
              </div>
              <div className="mt-2 space-y-1 text-sm">
                <p><span className="text-muted-foreground">Use:</span> {m.use}</p>
                <p><span className="text-muted-foreground">Appearance:</span> {m.form}</p>
                <p className="text-xs text-muted-foreground italic">⚠ {m.notes}</p>
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
const POISONS: { name: string; category: string; severity: Severity; dog: boolean; cat: boolean; symptoms: string; action: string }[] = [
  { name: "Chocolate", category: "Food", severity: "toxic", dog: true, cat: true, symptoms: "Vomiting, hyperactivity, tremors, arrhythmia", action: "Call vet or ASPCA Poison Control (888-426-4435). Dark & baker's chocolate most dangerous." },
  { name: "Grapes / raisins", category: "Food", severity: "deadly", dog: true, cat: false, symptoms: "Vomiting, lethargy, acute kidney failure within 24–72 h", action: "Emergency vet immediately — no safe dose exists." },
  { name: "Xylitol", category: "Food additive", severity: "deadly", dog: true, cat: false, symptoms: "Hypoglycemia within 30 min, liver failure within 24 h", action: "Emergency vet NOW. Found in sugar-free gum, peanut butter, toothpaste." },
  { name: "Onion / garlic / chives", category: "Food", severity: "toxic", dog: true, cat: true, symptoms: "Weakness, pale gums, dark urine (hemolytic anemia)", action: "Call vet — cats far more sensitive than dogs." },
  { name: "Macadamia nuts", category: "Food", severity: "toxic", dog: true, cat: false, symptoms: "Weakness in hind legs, tremors, hyperthermia", action: "Usually self-limits in 24–48 h but call vet." },
  { name: "Ibuprofen (Advil)", category: "Human medication", severity: "deadly", dog: true, cat: true, symptoms: "Vomiting, GI ulcers, kidney failure", action: "Emergency vet — even one pill can be fatal to a cat." },
  { name: "Acetaminophen (Tylenol)", category: "Human medication", severity: "deadly", dog: true, cat: true, symptoms: "Brown gums, difficulty breathing, liver failure", action: "Emergency vet. Cats lack the enzyme to metabolize it." },
  { name: "Antifreeze (ethylene glycol)", category: "Household chemical", severity: "deadly", dog: true, cat: true, symptoms: "Drunken gait, then kidney failure within 24–72 h", action: "Emergency vet within 3 hours — antidote is time-critical." },
  { name: "Lily (Easter, Tiger, Asiatic)", category: "Plant", severity: "deadly", dog: false, cat: true, symptoms: "Vomiting, lethargy, kidney failure within 24–72 h", action: "Emergency vet — even pollen or vase water can kill a cat." },
  { name: "Sago palm", category: "Plant", severity: "deadly", dog: true, cat: true, symptoms: "Vomiting, dark stool, liver failure", action: "Emergency vet — 50%+ mortality even with treatment." },
  { name: "Rodenticide", category: "Poison bait", severity: "deadly", dog: true, cat: true, symptoms: "Bleeding, weakness, seizures (varies by type)", action: "Emergency vet — bring packaging so vet identifies active ingredient." },
  { name: "Marijuana / THC", category: "Recreational", severity: "toxic", dog: true, cat: true, symptoms: "Wobbly gait, dilated pupils, urine dribbling", action: "Vet — recovery usually 12–24 h; edibles with chocolate/xylitol more dangerous." },
  { name: "Caffeine", category: "Food", severity: "toxic", dog: true, cat: true, symptoms: "Restlessness, arrhythmia, seizures", action: "Vet if a coffee grounds / tea / caffeine pill ingestion." },
  { name: "Bleach (concentrated)", category: "Household chemical", severity: "toxic", dog: true, cat: true, symptoms: "Drooling, oral ulcers, vomiting", action: "Rinse mouth with water/milk — do NOT induce vomiting. Call poison control." },
  { name: "Ibuprofen gel / patch", category: "Human medication", severity: "toxic", dog: true, cat: true, symptoms: "Kidney damage from skin contact or chewing", action: "Wash affected fur, call vet." },
  { name: "Alcohol", category: "Beverage", severity: "toxic", dog: true, cat: true, symptoms: "Depression, hypothermia, low blood sugar", action: "Emergency vet — even mouthwash or raw bread dough (fermenting) is dangerous." },
  { name: "Raw yeast dough", category: "Food", severity: "toxic", dog: true, cat: true, symptoms: "Bloated abdomen, alcohol toxicity, GI rupture", action: "Emergency vet immediately." },
  { name: "Essential oils (tea tree, peppermint, pine)", category: "Household", severity: "toxic", dog: true, cat: true, symptoms: "Drooling, tremors, liver damage (cats)", action: "Wash off skin, vet visit. Cats extremely sensitive." },
  { name: "Cocoa mulch", category: "Garden", severity: "toxic", dog: true, cat: false, symptoms: "Same as chocolate toxicity", action: "Vet — contains theobromine." },
  { name: "Fertilizer (with iron/insecticide)", category: "Garden", severity: "toxic", dog: true, cat: true, symptoms: "Vomiting, tremors, iron toxicity", action: "Call poison control with product name." },
  { name: "Sugarless gum (any Xylitol)", category: "Food", severity: "deadly", dog: true, cat: false, symptoms: "See Xylitol above", action: "Emergency vet immediately." },
  { name: "Bread dough (uncooked)", category: "Food", severity: "toxic", dog: true, cat: true, symptoms: "Bloat, ethanol toxicity", action: "Emergency vet." },
  { name: "Avocado (large amounts / pit)", category: "Food", severity: "caution", dog: true, cat: true, symptoms: "Mild GI upset in dogs/cats; pit is choking + obstruction risk", action: "Small flesh amounts usually fine for dogs; avoid for birds & rabbits (deadly)." },
  { name: "Milk / dairy", category: "Food", severity: "caution", dog: true, cat: true, symptoms: "Diarrhea, gas (lactose intolerance)", action: "Not toxic — just uncomfortable. Avoid." },
  { name: "Cooked bones", category: "Food", severity: "toxic", dog: true, cat: true, symptoms: "Splinters causing choking, GI perforation", action: "Never feed cooked bones. Emergency vet if swallowed." },
];

export function PoisonLookupDatabase() {
  const [q, setQ] = useState("");
  const [species, setSpecies] = useState<"dog" | "cat" | "all">("all");
  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    return POISONS
      .filter((p) => (species === "all") || (species === "dog" ? p.dog : p.cat))
      .filter((p) => !query || p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query) || p.symptoms.toLowerCase().includes(query))
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
    return <Badge className={`${map[s]} border-0 text-[10px] uppercase`}>{s}</Badge>;
  };

  return (
    <CalculatorLayout
      form={
        <div className="space-y-4">
          <div>
            <Label>Search anything — food, plant, chemical, medication</Label>
            <div className="relative mt-1.5">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. chocolate, lily, ibuprofen" className="pl-9" />
            </div>
          </div>
          <div>
            <Label>Species</Label>
            <Select value={species} onValueChange={(v: "dog" | "cat" | "all") => setSpecies(v)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Both</SelectItem>
                <SelectItem value="dog">Dog</SelectItem>
                <SelectItem value="cat">Cat</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-xs">
            <div className="flex items-center gap-2 font-semibold text-destructive"><ShieldAlert className="h-4 w-4" /> If your pet just ingested something:</div>
            <p className="mt-1 text-destructive/90">
              <strong>ASPCA:</strong> +1 (888) 426-4435 · <strong>Pet Poison Helpline:</strong> +1 (855) 764-7661 (fees apply, 24/7).
            </p>
          </div>
        </div>
      }
      result={
        <div className="space-y-3">
          {results.length === 0 && <p className="text-sm text-muted-foreground text-center">Nothing matches — but if it's not in this list, still call poison control.</p>}
          {results.slice(0, 15).map((p) => (
            <div key={p.name} className="rounded-lg border border-border bg-card p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="font-semibold text-foreground">{p.name}</div>
                {badge(p.severity)}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{p.category}</div>
              <p className="mt-2 text-sm"><span className="text-muted-foreground">Symptoms:</span> {p.symptoms}</p>
              <p className="mt-1 text-sm"><span className="text-muted-foreground">What to do:</span> {p.action}</p>
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
  { name: "DHPP (Distemper, Hepatitis, Parvo, Parainfluenza)", age: "6–8 weeks", core: true, notes: "First in puppy series" },
  { name: "DHPP booster", age: "10–12 weeks", core: true, notes: "Second in series" },
  { name: "DHPP + Leptospirosis", age: "14–16 weeks", core: true, notes: "Third; lepto often added regionally" },
  { name: "Rabies", age: "12–16 weeks", core: true, notes: "Legally required in most regions" },
  { name: "Bordetella (kennel cough)", age: "8+ weeks", core: false, notes: "Required for boarding/daycare" },
  { name: "Canine Influenza (H3N2/H3N8)", age: "8+ weeks", core: false, notes: "Recommended if boarding or in outbreak areas" },
  { name: "Lyme", age: "12+ weeks", core: false, notes: "Tick-endemic regions only" },
  { name: "DHPP + Rabies", age: "1 year (booster)", core: true, notes: "First annual boosters" },
  { name: "DHPP + Rabies (3-yr)", age: "Every 3 years", core: true, notes: "Adult maintenance — titers optional" },
];
const CAT_VACCINES: Vaccine[] = [
  { name: "FVRCP (Herpes, Calici, Panleuk)", age: "6–8 weeks", core: true, notes: "First in kitten series" },
  { name: "FVRCP booster", age: "10–12 weeks", core: true, notes: "Second in series" },
  { name: "FVRCP + FeLV", age: "14–16 weeks", core: true, notes: "FeLV core for all kittens" },
  { name: "Rabies", age: "12–16 weeks", core: true, notes: "Legally required in most regions" },
  { name: "FVRCP + Rabies", age: "1 year", core: true, notes: "First annual boosters" },
  { name: "FeLV (if outdoor/multi-cat)", age: "Annually", core: false, notes: "Indoor-only cats can skip after age 1" },
  { name: "FVRCP + Rabies (3-yr)", age: "Every 3 years", core: true, notes: "Adult maintenance" },
];
const RABBIT_VACCINES: Vaccine[] = [
  { name: "RHDV2 (Rabbit Hemorrhagic Disease)", age: "10+ weeks", core: true, notes: "Now essential in most of US/EU" },
  { name: "Myxomatosis", age: "5 weeks", core: true, notes: "Where available (EU/UK)" },
  { name: "Annual boosters", age: "Yearly", core: true, notes: "Both RHDV & myxo — combined available" },
];
const FERRET_VACCINES: Vaccine[] = [
  { name: "Canine Distemper", age: "8, 11, 14 weeks", core: true, notes: "Ferret-approved formulation" },
  { name: "Rabies", age: "12+ weeks", core: true, notes: "Annual" },
];

export function VaccineScheduleGenerator() {
  const [species, setSpecies] = useState<"dog" | "cat" | "rabbit" | "ferret">("dog");
  const [months, setMonths] = useState(3);

  const table = { dog: DOG_VACCINES, cat: CAT_VACCINES, rabbit: RABBIT_VACCINES, ferret: FERRET_VACCINES }[species];
  const stage = months < 4 ? "puppy/kitten series" : months < 12 ? "juvenile boosters" : "adult maintenance";
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
            <Label>Species</Label>
            <Select value={species} onValueChange={(v) => setSpecies(v as typeof species)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="dog">Dog / puppy</SelectItem>
                <SelectItem value="cat">Cat / kitten</SelectItem>
                <SelectItem value="rabbit">Rabbit</SelectItem>
                <SelectItem value="ferret">Ferret</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Current age (months)</Label>
            <Input type="number" min={0} step={0.5} value={months} onChange={(e) => setMonths(Number(e.target.value))} className="mt-1.5" />
          </div>
        </div>
      }
      result={
        <div className="space-y-3">
          <div className="rounded-lg bg-primary/10 p-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary"><Syringe className="h-4 w-4" /> Life stage: {stage}</div>
            {next && <p className="mt-1 text-sm text-muted-foreground">Next up: <strong>{next.name}</strong> at {next.age}.</p>}
          </div>
          <div className="space-y-2">
            {table.map((v) => (
              <div key={v.name} className="rounded-md border border-border p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="text-sm font-medium">{v.name}</div>
                  <Badge variant={v.core ? "default" : "secondary"} className="text-[10px]">{v.core ? "Core" : "Optional"}</Badge>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{v.age} · {v.notes}</div>
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
  const [zip, setZip] = useState("");
  const [loc, setLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [status, setStatus] = useState<string>("");

  const useMyLocation = () => {
    if (!navigator.geolocation) { setStatus("Geolocation not supported by this browser."); return; }
    setStatus("Locating…");
    navigator.geolocation.getCurrentPosition(
      (pos) => { setLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setStatus(""); },
      (err) => setStatus(`Could not get location: ${err.message}`),
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
          <Button type="button" onClick={useMyLocation} className="w-full"><MapPin className="mr-2 h-4 w-4" /> Use my location</Button>
          <div className="relative flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <div>
            <Label>ZIP / postcode / city</Label>
            <Input value={zip} onChange={(e) => setZip(e.target.value)} placeholder="e.g. 10001 or Berlin" className="mt-1.5" />
          </div>
          {status && <p className="text-xs text-muted-foreground">{status}</p>}
        </div>
      }
      result={
        <div className="space-y-4">
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-destructive"><ShieldAlert className="h-4 w-4" /> 24/7 poison hotlines</div>
            <ul className="mt-2 space-y-1 text-sm">
              <li><strong>ASPCA (US):</strong> <a className="underline" href="tel:+18884264435">+1 (888) 426-4435</a></li>
              <li><strong>Pet Poison Helpline:</strong> <a className="underline" href="tel:+18557647661">+1 (855) 764-7661</a></li>
              <li><strong>UK Vet Poisons:</strong> <a className="underline" href="tel:+442073055055">+44 20 7305 5055</a></li>
            </ul>
          </div>
          {mapsLink && (
            <div className="space-y-2">
              <SectionTitle icon={MapPin}>Nearby emergency vets</SectionTitle>
              <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="block rounded-md border border-primary bg-primary/10 p-3 text-sm font-semibold text-primary hover:bg-primary/20">
                Open Google Maps →
              </a>
              {appleLink && (
                <a href={appleLink} target="_blank" rel="noopener noreferrer" className="block rounded-md border border-border bg-card p-3 text-sm hover:bg-muted">
                  Open Apple Maps →
                </a>
              )}
            </div>
          )}
          {!mapsLink && <p className="text-sm text-muted-foreground text-center">Share your location or enter a ZIP/city to see nearby 24-hour clinics.</p>}
          <div className="rounded-md border border-border bg-card p-3 text-xs text-muted-foreground">
            <strong>While you travel:</strong> keep the pet warm and quiet, don't offer food or water unless the clinic instructs, bring any suspected toxin's packaging, and call ahead so the clinic can prepare.
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
  { key: "cre", label: "Creatinine", unit: "mg/dL", dogLow: 0.5, dogHigh: 1.5, catLow: 0.8, catHigh: 2.4,
    high: "Kidney disease, dehydration, urinary obstruction", low: "Low muscle mass — usually not concerning" },
  { key: "alt", label: "ALT (liver enzyme)", unit: "U/L", dogLow: 10, dogHigh: 100, catLow: 20, catHigh: 100,
    high: "Liver damage — toxins, medications, hepatitis", low: "Rare, usually meaningless" },
  { key: "alp", label: "ALP (alkaline phosphatase)", unit: "U/L", dogLow: 20, dogHigh: 150, catLow: 10, catHigh: 90,
    high: "Cushing's, steroids, bile stasis, bone growth", low: "Rare" },
  { key: "glu", label: "Glucose", unit: "mg/dL", dogLow: 70, dogHigh: 138, catLow: 71, catHigh: 148,
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
    return <Badge className={`${map[s]} border-0 text-[10px] uppercase`}>{s}</Badge>;
  };

  return (
    <CalculatorLayout
      form={
        <div className="space-y-4">
          <div>
            <Label>Species</Label>
            <Select value={species} onValueChange={(v: "dog" | "cat") => setSpecies(v)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="dog">Dog</SelectItem>
                <SelectItem value="cat">Cat</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {LABS.map((l) => (
              <div key={l.key} className="grid grid-cols-[1fr_100px] items-center gap-2">
                <Label className="text-xs">{l.label} <span className="text-muted-foreground">({l.unit})</span></Label>
                <Input type="number" step="0.1" value={values[l.key] ?? ""} onChange={(e) => setV(l.key, e.target.value)} placeholder="—" />
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">Enter only what appears on your report. Blank rows are skipped.</p>
        </div>
      }
      result={
        <div className="space-y-3">
          {rows.every((r) => r.status === null) && <p className="text-sm text-muted-foreground text-center">Enter one or more values from your report to see what they mean.</p>}
          {flagged.length > 0 && (
            <div className="rounded-md border border-amber-500/30 bg-amber-500/10 p-3 text-sm">
              <strong className="text-amber-700 dark:text-amber-400">{flagged.length} value(s) outside the reference range.</strong>
              <p className="mt-1 text-muted-foreground text-xs">Discuss these with your vet — a single out-of-range value is often meaningless without the full clinical picture.</p>
            </div>
          )}
          {rows.filter((r) => r.status).map((r) => (
            <div key={r.def.key} className="rounded-lg border border-border bg-card p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-semibold">{r.def.label}</div>
                  <div className="text-xs text-muted-foreground">Your value: <strong>{r.value} {r.def.unit}</strong> · Reference: {r.low}–{r.high}</div>
                </div>
                {statusBadge(r.status)}
              </div>
              {r.status === "high" && <p className="mt-2 text-sm">{r.def.high}</p>}
              {r.status === "low"  && <p className="mt-2 text-sm">{r.def.low}</p>}
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
