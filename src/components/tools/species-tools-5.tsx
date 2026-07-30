import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalculatorLayout } from "@/components/layouts/tool-layouts";
import { Sparkles, Heart, Cake, Search as SearchIcon, PawPrint, Users } from "lucide-react";

function SectionTitle({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
      <Icon className="h-4 w-4 text-primary" />
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   1. PET PERSONALITY QUIZ
═══════════════════════════════════════════════════════════ */
type Trait = "energy" | "social" | "independent" | "playful" | "calm";
const PERSONALITY_Q: { q: string; options: { label: string; trait: Trait }[] }[] = [
  { q: "How does your pet greet you at the door?", options: [
    { label: "Zooms and jumps everywhere", trait: "energy" },
    { label: "Wags tail and stays close", trait: "social" },
    { label: "Looks up, then goes back to napping", trait: "independent" },
    { label: "Brings you a toy", trait: "playful" },
  ]},
  { q: "Favorite time of day?", options: [
    { label: "Morning zoomies", trait: "energy" },
    { label: "Cuddle hour on the couch", trait: "social" },
    { label: "Quiet solo time", trait: "independent" },
    { label: "Playtime with toys", trait: "playful" },
  ]},
  { q: "At the park or with new people, they…", options: [
    { label: "Run the show", trait: "energy" },
    { label: "Say hi to everyone", trait: "social" },
    { label: "Do their own thing", trait: "independent" },
    { label: "Try to start a game", trait: "playful" },
  ]},
  { q: "Reaction to a new toy?", options: [
    { label: "Instant obsession", trait: "playful" },
    { label: "Excited zoomies", trait: "energy" },
    { label: "Investigates, then leaves", trait: "independent" },
    { label: "Brings it to you to share", trait: "social" },
  ]},
  { q: "Sleeping style?", options: [
    { label: "Sprawled and snoring", trait: "calm" },
    { label: "Curled next to you", trait: "social" },
    { label: "In their own quiet spot", trait: "independent" },
    { label: "One eye open, ready to go", trait: "energy" },
  ]},
  { q: "Reaction to loud noises?", options: [
    { label: "Barely notices", trait: "calm" },
    { label: "Looks to you for reassurance", trait: "social" },
    { label: "Goes off to hide alone", trait: "independent" },
    { label: "Tries to investigate", trait: "energy" },
  ]},
  { q: "How do they play?", options: [
    { label: "Non-stop, full throttle", trait: "energy" },
    { label: "Loves games with you", trait: "social" },
    { label: "Plays alone happily", trait: "independent" },
    { label: "Gentle, considered play", trait: "calm" },
  ]},
  { q: "On a car ride?", options: [
    { label: "Excited whining", trait: "energy" },
    { label: "Snuggled in the seat", trait: "social" },
    { label: "Chill and quiet", trait: "calm" },
    { label: "Watching every window", trait: "playful" },
  ]},
  { q: "How affectionate are they?", options: [
    { label: "Constant cuddle bug", trait: "social" },
    { label: "Warm but on their terms", trait: "independent" },
    { label: "Prefers gentle contact", trait: "calm" },
    { label: "Kisses and tail wags all day", trait: "playful" },
  ]},
  { q: "Training style that works best?", options: [
    { label: "High-energy reward games", trait: "energy" },
    { label: "Praise and affection", trait: "social" },
    { label: "Short, no-pressure sessions", trait: "independent" },
    { label: "Trick-training with toys", trait: "playful" },
  ]},
];
const TYPE_MAP: Record<Trait, { title: string; blurb: string }> = {
  energy: { title: "The Adventurer", blurb: "High-drive, loves activity, thrives on exercise and jobs to do." },
  social: { title: "The Companion", blurb: "People-focused, affectionate, does best with lots of family time." },
  independent: { title: "The Free Spirit", blurb: "Self-sufficient, confident, appreciates space and calm handling." },
  playful: { title: "The Entertainer", blurb: "Curious, goofy, always ready for a game or new trick." },
  calm: { title: "The Zen Master", blurb: "Easy-going, low-drama, happy with a predictable routine." },
};
export function PetPersonalityQuiz() {
  const [answers, setAnswers] = useState<(Trait | null)[]>(Array(PERSONALITY_Q.length).fill(null));
  const setAt = (i: number, t: Trait) => { const n = [...answers]; n[i] = t; setAnswers(n); };
  const done = answers.every(Boolean);
  const result = useMemo(() => {
    if (!done) return null;
    const counts: Record<Trait, number> = { energy: 0, social: 0, independent: 0, playful: 0, calm: 0 };
    answers.forEach((a) => { if (a) counts[a]++; });
    const top = (Object.entries(counts) as [Trait, number][]).sort((a, b) => b[1] - a[1])[0][0];
    return TYPE_MAP[top];
  }, [answers, done]);

  return (
    <div className="space-y-6">
      {PERSONALITY_Q.map((q, i) => (
        <div key={i} className="rounded-lg border border-border/60 bg-card p-4">
          <div className="mb-3 text-sm font-medium">{i + 1}. {q.q}</div>
          <div className="grid gap-2 sm:grid-cols-2">
            {q.options.map((o) => (
              <Button key={o.label} type="button" variant={answers[i] === o.trait ? "default" : "outline"} size="sm"
                onClick={() => setAt(i, o.trait)} className="justify-start text-left h-auto py-2 whitespace-normal">
                {o.label}
              </Button>
            ))}
          </div>
        </div>
      ))}
      {result && (
        <div className="rounded-xl bg-cream-deep p-6 text-center">
          <SectionTitle icon={Sparkles}>Your pet's personality type</SectionTitle>
          <div className="mt-3 font-display text-3xl font-semibold text-primary">{result.title}</div>
          <p className="mt-2 text-sm text-muted-foreground">{result.blurb}</p>
        </div>
      )}
      {!done && <p className="text-center text-xs text-muted-foreground">Answer all {PERSONALITY_Q.length} questions to see the result.</p>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   2. WHICH BREED SUITS ME? QUIZ
═══════════════════════════════════════════════════════════ */
type Match = { name: string; why: string };
const BREED_DB: { name: string; species: "dog" | "cat"; energy: number; size: number; grooming: number; kids: boolean; apartment: boolean; firstTime: boolean }[] = [
  { name: "Cavalier King Charles Spaniel", species: "dog", energy: 2, size: 1, grooming: 3, kids: true, apartment: true, firstTime: true },
  { name: "Labrador Retriever", species: "dog", energy: 4, size: 3, grooming: 2, kids: true, apartment: false, firstTime: true },
  { name: "Border Collie", species: "dog", energy: 5, size: 2, grooming: 3, kids: true, apartment: false, firstTime: false },
  { name: "French Bulldog", species: "dog", energy: 2, size: 1, grooming: 1, kids: true, apartment: true, firstTime: true },
  { name: "Shiba Inu", species: "dog", energy: 3, size: 2, grooming: 3, kids: false, apartment: true, firstTime: false },
  { name: "Poodle (Standard)", species: "dog", energy: 4, size: 3, grooming: 5, kids: true, apartment: false, firstTime: true },
  { name: "Greyhound", species: "dog", energy: 3, size: 3, grooming: 1, kids: true, apartment: true, firstTime: true },
  { name: "Ragdoll", species: "cat", energy: 2, size: 3, grooming: 3, kids: true, apartment: true, firstTime: true },
  { name: "British Shorthair", species: "cat", energy: 2, size: 2, grooming: 2, kids: true, apartment: true, firstTime: true },
  { name: "Bengal", species: "cat", energy: 5, size: 2, grooming: 1, kids: true, apartment: true, firstTime: false },
  { name: "Maine Coon", species: "cat", energy: 3, size: 3, grooming: 4, kids: true, apartment: true, firstTime: true },
  { name: "Siamese", species: "cat", energy: 4, size: 2, grooming: 1, kids: true, apartment: true, firstTime: true },
  { name: "Persian", species: "cat", energy: 1, size: 2, grooming: 5, kids: true, apartment: true, firstTime: false },
];
export function WhichBreedSuitsMe() {
  const [species, setSpecies] = useState<"dog" | "cat" | "any">("any");
  const [energy, setEnergy] = useState(3);
  const [size, setSize] = useState(2);
  const [grooming, setGrooming] = useState(3);
  const [kids, setKids] = useState(false);
  const [apartment, setApartment] = useState(false);
  const [firstTime, setFirstTime] = useState(false);

  const matches = useMemo<Match[]>(() => {
    return BREED_DB
      .filter((b) => species === "any" || b.species === species)
      .map((b) => {
        let score = 15;
        score -= Math.abs(b.energy - energy) * 2;
        score -= Math.abs(b.size - size);
        score -= Math.abs(b.grooming - grooming);
        if (kids && !b.kids) score -= 4;
        if (apartment && !b.apartment) score -= 4;
        if (firstTime && !b.firstTime) score -= 3;
        return { b, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(({ b, score }) => ({
        name: `${b.name} (${b.species})`,
        why: `Match score ${Math.max(0, score)}/15 · energy ${b.energy}/5 · grooming ${b.grooming}/5`,
      }));
  }, [species, energy, size, grooming, kids, apartment, firstTime]);

  const form = (
    <div className="space-y-3">
      <div><Label>Species</Label>
        <Select value={species} onValueChange={(v) => setSpecies(v as "dog" | "cat" | "any")}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="any">Any</SelectItem><SelectItem value="dog">Dog</SelectItem><SelectItem value="cat">Cat</SelectItem></SelectContent>
        </Select>
      </div>
      <div><Label>Your activity level (1–5)</Label><Input type="number" min={1} max={5} value={energy} onChange={(e) => setEnergy(+e.target.value)} /></div>
      <div><Label>Preferred size (1 small – 3 large)</Label><Input type="number" min={1} max={3} value={size} onChange={(e) => setSize(+e.target.value)} /></div>
      <div><Label>Grooming you'll do (1 low – 5 lots)</Label><Input type="number" min={1} max={5} value={grooming} onChange={(e) => setGrooming(+e.target.value)} /></div>
      <div className="flex flex-wrap gap-4 pt-1 text-sm">
        <label className="flex items-center gap-2"><input type="checkbox" checked={kids} onChange={(e) => setKids(e.target.checked)} />Kids at home</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={apartment} onChange={(e) => setApartment(e.target.checked)} />Apartment</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={firstTime} onChange={(e) => setFirstTime(e.target.checked)} />First-time owner</label>
      </div>
    </div>
  );

  const result = (
    <div className="space-y-3">
      <SectionTitle icon={PawPrint}>Top matches</SectionTitle>
      <ul className="space-y-2">
        {matches.map((m) => (
          <li key={m.name} className="rounded-md border border-border/60 bg-background p-3">
            <div className="font-medium">{m.name}</div>
            <div className="text-xs text-muted-foreground">{m.why}</div>
          </li>
        ))}
      </ul>
      <p className="text-xs text-muted-foreground">These are starting suggestions — always meet individual animals before adopting; personality varies within any breed.</p>
    </div>
  );

  return <CalculatorLayout form={form} result={result} />;
}

/* ═══════════════════════════════════════════════════════════
   3. PET COMPATIBILITY TEST
═══════════════════════════════════════════════════════════ */
export function PetCompatibilityTest() {
  const [aSpecies, setASpecies] = useState("dog");
  const [bSpecies, setBSpecies] = useState("cat");
  const [aAge, setAAge] = useState("adult");
  const [bAge, setBAge] = useState("adult");
  const [aTemper, setATemper] = useState("friendly");
  const [bTemper, setBTemper] = useState("friendly");
  const [sameSex, setSameSex] = useState(false);
  const [aNeutered, setANeutered] = useState(true);
  const [bNeutered, setBNeutered] = useState(true);

  const result = useMemo(() => {
    let score = 70;
    const pair = [aSpecies, bSpecies].sort().join("-");
    if (pair === "cat-dog") score -= 10;
    if (pair === "cat-rabbit" || pair === "dog-rabbit") score -= 20;
    if (pair === "cat-cat") score += 5;
    if (pair === "dog-dog") score += 10;
    if (aTemper === "aggressive" || bTemper === "aggressive") score -= 30;
    if (aTemper === "shy" && bTemper === "energetic") score -= 10;
    if (bTemper === "shy" && aTemper === "energetic") score -= 10;
    if (aAge === "senior" && bAge === "puppy") score -= 10;
    if (bAge === "senior" && aAge === "puppy") score -= 10;
    if (sameSex && (!aNeutered || !bNeutered)) score -= 15;
    if (aNeutered && bNeutered) score += 5;
    score = Math.max(5, Math.min(100, score));
    const band = score >= 80 ? "Excellent match" : score >= 60 ? "Likely to work with slow intros" : score >= 40 ? "Challenging — go slow, supervise" : "High risk — reconsider or consult a behaviorist";
    return { score, band };
  }, [aSpecies, bSpecies, aAge, bAge, aTemper, bTemper, sameSex, aNeutered, bNeutered]);

  const Row = ({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) => (
    <div><Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>{options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
      </Select>
    </div>
  );

  const form = (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <Row label="Pet A species" value={aSpecies} onChange={setASpecies} options={["dog","cat","rabbit","bird","hamster"]} />
        <Row label="Pet B species" value={bSpecies} onChange={setBSpecies} options={["dog","cat","rabbit","bird","hamster"]} />
        <Row label="Pet A age" value={aAge} onChange={setAAge} options={["puppy","adult","senior"]} />
        <Row label="Pet B age" value={bAge} onChange={setBAge} options={["puppy","adult","senior"]} />
        <Row label="Pet A temperament" value={aTemper} onChange={setATemper} options={["friendly","shy","energetic","aggressive"]} />
        <Row label="Pet B temperament" value={bTemper} onChange={setBTemper} options={["friendly","shy","energetic","aggressive"]} />
      </div>
      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2"><input type="checkbox" checked={sameSex} onChange={(e) => setSameSex(e.target.checked)} />Same sex</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={aNeutered} onChange={(e) => setANeutered(e.target.checked)} />A is spayed/neutered</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={bNeutered} onChange={(e) => setBNeutered(e.target.checked)} />B is spayed/neutered</label>
      </div>
    </div>
  );

  const out = (
    <div className="space-y-2 text-center">
      <SectionTitle icon={Users}>Compatibility</SectionTitle>
      <div className="font-display text-5xl font-semibold text-primary">{result.score}<span className="text-xl text-muted-foreground">/100</span></div>
      <Badge variant="secondary" className="text-sm">{result.band}</Badge>
      <p className="mt-3 text-xs text-muted-foreground">Introductions matter more than any score. Use scent swapping, gated meets, and short supervised sessions over 1–2 weeks.</p>
    </div>
  );
  return <CalculatorLayout form={form} result={out} />;
}

/* ═══════════════════════════════════════════════════════════
   4. HUMAN AGE → PET AGE REVERSE
═══════════════════════════════════════════════════════════ */
export function HumanToPetAge() {
  const [humanAge, setHumanAge] = useState(30);
  const [species, setSpecies] = useState<"dog-small" | "dog-med" | "dog-large" | "cat">("dog-med");

  // Reverse standard AVMA-ish tables: given human age, what pet age would match?
  const result = useMemo(() => {
    const h = Math.max(1, humanAge);
    // simple monotonic inverse mapping
    const map = {
      "dog-small": (age: number) => (age <= 15 ? 1 : age <= 24 ? 2 : 2 + (age - 24) / 4),
      "dog-med":   (age: number) => (age <= 15 ? 1 : age <= 24 ? 2 : 2 + (age - 24) / 5),
      "dog-large": (age: number) => (age <= 15 ? 1 : age <= 24 ? 2 : 2 + (age - 24) / 6),
      "cat":       (age: number) => (age <= 15 ? 1 : age <= 24 ? 2 : 2 + (age - 24) / 4),
    };
    const petAge = map[species](h);
    return Math.round(petAge * 10) / 10;
  }, [humanAge, species]);

  const form = (
    <div className="space-y-3">
      <div><Label>Your (human) age</Label><Input type="number" min={1} max={110} value={humanAge} onChange={(e) => setHumanAge(+e.target.value)} /></div>
      <div><Label>If I were a…</Label>
        <Select value={species} onValueChange={(v) => setSpecies(v as typeof species)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="dog-small">Small dog (&lt;20 lb)</SelectItem>
            <SelectItem value="dog-med">Medium dog (20–50 lb)</SelectItem>
            <SelectItem value="dog-large">Large dog (&gt;50 lb)</SelectItem>
            <SelectItem value="cat">Cat</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
  const out = (
    <div className="space-y-2 text-center">
      <SectionTitle icon={Heart}>You'd be</SectionTitle>
      <div className="font-display text-5xl font-semibold text-primary">{result} <span className="text-xl text-muted-foreground">years old</span></div>
      <p className="text-xs text-muted-foreground">Reverse of standard pet-age tables. Real aging depends on breed and individual health.</p>
    </div>
  );
  return <CalculatorLayout form={form} result={out} />;
}

/* ═══════════════════════════════════════════════════════════
   5. PET ZODIAC / BIRTHDAY CARD GENERATOR
═══════════════════════════════════════════════════════════ */
const ZODIAC: { name: string; start: [number, number]; end: [number, number]; traits: string }[] = [
  { name: "Capricorn", start: [12, 22], end: [1, 19], traits: "Loyal, patient, a natural rule-follower." },
  { name: "Aquarius",  start: [1, 20],  end: [2, 18], traits: "Independent, quirky, marches to their own drum." },
  { name: "Pisces",    start: [2, 19],  end: [3, 20], traits: "Gentle, intuitive, deeply bonded to their people." },
  { name: "Aries",     start: [3, 21],  end: [4, 19], traits: "Bold, energetic, first through the door." },
  { name: "Taurus",    start: [4, 20],  end: [5, 20], traits: "Food-motivated, cuddly, creature of comfort." },
  { name: "Gemini",    start: [5, 21],  end: [6, 20], traits: "Curious, chatty, always investigating." },
  { name: "Cancer",    start: [6, 21],  end: [7, 22], traits: "Sensitive, homebody, loves the family." },
  { name: "Leo",       start: [7, 23],  end: [8, 22], traits: "Confident, showy, the star of every room." },
  { name: "Virgo",     start: [8, 23],  end: [9, 22], traits: "Tidy, thoughtful, likes routines." },
  { name: "Libra",     start: [9, 23],  end: [10, 22],traits: "Friendly, balanced, loves company." },
  { name: "Scorpio",   start: [10, 23], end: [11, 21],traits: "Intense, loyal, one-person pet." },
  { name: "Sagittarius", start:[11, 22],end: [12, 21],traits: "Adventurous, playful, always ready to go." },
];
function findSign(m: number, d: number) {
  for (const z of ZODIAC) {
    const [sm, sd] = z.start, [em, ed] = z.end;
    if (sm === em) { if (m === sm && d >= sd && d <= ed) return z; }
    else {
      if ((m === sm && d >= sd) || (m === em && d <= ed)) return z;
    }
  }
  return ZODIAC[0];
}
export function PetZodiacCard() {
  const [name, setName] = useState("Buddy");
  const [birthday, setBirthday] = useState("2023-05-15");
  const parsed = useMemo(() => {
    const [y, m, d] = birthday.split("-").map(Number);
    if (!y || !m || !d) return null;
    return { y, m, d, sign: findSign(m, d) };
  }, [birthday]);

  const form = (
    <div className="space-y-3">
      <div><Label>Pet name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
      <div><Label>Birthday</Label><Input type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} /></div>
    </div>
  );
  const out = parsed ? (
    <div className="rounded-xl border border-primary/40 bg-cream-deep p-6 text-center">
      <SectionTitle icon={Cake}>Happy Birthday, {name}! 🎉</SectionTitle>
      <div className="mt-3 font-display text-3xl font-semibold text-primary">{parsed.sign.name}</div>
      <p className="mt-2 text-sm">{parsed.sign.traits}</p>
      <p className="mt-4 text-xs text-muted-foreground">Born {parsed.m}/{parsed.d}/{parsed.y}</p>
      <Button className="mt-4" onClick={() => window.print()}>Print card</Button>
    </div>
  ) : <p className="text-sm text-muted-foreground">Enter a valid birthday.</p>;
  return <CalculatorLayout form={form} result={out} />;
}

/* ═══════════════════════════════════════════════════════════
   6. PET NAME MEANING LOOKUP
═══════════════════════════════════════════════════════════ */
const NAME_MEANINGS: Record<string, { origin: string; meaning: string; vibe: string }> = {
  luna:     { origin: "Latin",     meaning: "Moon",                 vibe: "Calm, mysterious, feminine." },
  bella:    { origin: "Italian",   meaning: "Beautiful",            vibe: "Elegant, affectionate." },
  charlie:  { origin: "German",    meaning: "Free man",             vibe: "Friendly, easy-going." },
  max:      { origin: "Latin",     meaning: "Greatest",             vibe: "Confident, classic." },
  buddy:    { origin: "English",   meaning: "Friend, companion",    vibe: "Warm, loyal." },
  daisy:    { origin: "Old English",meaning: "Day's eye (flower)",  vibe: "Cheerful, sunny." },
  cooper:   { origin: "English",   meaning: "Barrel maker",         vibe: "Sturdy, dependable." },
  lucy:     { origin: "Latin",     meaning: "Light",                vibe: "Bright, joyful." },
  milo:     { origin: "Germanic",  meaning: "Merciful, gentle",     vibe: "Sweet, playful." },
  bailey:   { origin: "Old French",meaning: "Steward, guardian",    vibe: "Protective, loyal." },
  rocky:    { origin: "English",   meaning: "Rest, strong as rock", vibe: "Tough, spirited." },
  molly:    { origin: "Hebrew",    meaning: "Bitter or beloved",    vibe: "Sweet, classic." },
  bear:     { origin: "English",   meaning: "Strong, brave",        vibe: "Big, cuddly." },
  coco:     { origin: "French",    meaning: "Chocolate / helper",   vibe: "Chic, small and cute." },
  zeus:     { origin: "Greek",     meaning: "Sky father, king of gods", vibe: "Powerful, commanding." },
  nala:     { origin: "Swahili",   meaning: "Gift / beloved",       vibe: "Regal, playful." },
  simba:    { origin: "Swahili",   meaning: "Lion",                 vibe: "Bold, majestic." },
  mochi:    { origin: "Japanese",  meaning: "Sweet rice cake",      vibe: "Soft, adorable." },
  ollie:    { origin: "Latin",     meaning: "Olive tree, peace",    vibe: "Friendly, gentle." },
  ginger:   { origin: "English",   meaning: "The spice / redhead",  vibe: "Warm, lively." },
  shadow:   { origin: "English",   meaning: "Shade, dark companion",vibe: "Loyal, mysterious." },
  whiskey:  { origin: "Gaelic",    meaning: "Water of life",        vibe: "Bold, spirited." },
  peanut:   { origin: "English",   meaning: "Small nut",            vibe: "Tiny, cute." },
  ziggy:    { origin: "Germanic",  meaning: "Victorious protector", vibe: "Quirky, energetic." },
  pepper:   { origin: "English",   meaning: "The spice",            vibe: "Feisty, fun." },
};

export function PetNameMeaning() {
  const [q, setQ] = useState("Luna");
  const key = q.trim().toLowerCase();
  const hit = NAME_MEANINGS[key];
  const suggestions = useMemo(() => {
    if (hit || key.length < 2) return [];
    return Object.keys(NAME_MEANINGS).filter((k) => k.includes(key)).slice(0, 6);
  }, [key, hit]);

  const form = (
    <div className="space-y-3">
      <div><Label>Look up a pet name</Label>
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. Luna, Max, Simba" />
      </div>
      <p className="text-xs text-muted-foreground">{Object.keys(NAME_MEANINGS).length}+ names in the database.</p>
    </div>
  );
  const out = hit ? (
    <div className="space-y-2">
      <SectionTitle icon={SearchIcon}>{q.trim()}</SectionTitle>
      <div className="rounded-md bg-background p-4">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">Origin</div>
        <div className="font-medium">{hit.origin}</div>
        <div className="mt-3 text-xs uppercase tracking-wide text-muted-foreground">Meaning</div>
        <div className="font-medium">{hit.meaning}</div>
        <div className="mt-3 text-xs uppercase tracking-wide text-muted-foreground">Vibe</div>
        <div className="text-sm">{hit.vibe}</div>
      </div>
    </div>
  ) : (
    <div className="space-y-2 text-sm">
      <p className="text-muted-foreground">No exact match for "{q}".</p>
      {suggestions.length > 0 && (
        <div>
          <div className="text-xs font-semibold">Did you mean:</div>
          <div className="mt-1 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <Button key={s} size="sm" variant="outline" onClick={() => setQ(s[0].toUpperCase() + s.slice(1))}>{s}</Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
  return <CalculatorLayout form={form} result={out} />;
}
