export interface GlossaryTerm {
  id: string;
  term: string;
  category: 'brand' | 'breed' | 'technical' | 'custom';
  description?: string;
}

export interface QAValidationResult {
  isValid: boolean;
  warnings: string[];
}

export interface TranslationMemoryItem {
  sourceText: string;
  targetLang: string;
  translatedText: string;
  provider: string;
  updatedAt: string;
}

export interface TMSLog {
  id: string;
  sourceText: string;
  translatedText: string;
  targetLang: string;
  provider: string;
  model: string;
  tokens: number;
  cost: number;
  status: 'Draft' | 'AI Generated' | 'Reviewed' | 'Approved' | 'Published';
  createdAt: string;
  user: string;
}

export const DEFAULT_GLOSSARY_TERMS: GlossaryTerm[] = [
  { id: '1', term: 'FurTools', category: 'brand', description: 'Brand name - do not translate' },
  { id: '2', term: 'Dashboard', category: 'technical', description: 'UI navigation term' },
  { id: '3', term: 'API', category: 'technical', description: 'Technical acronym' },
  { id: '4', term: 'AI', category: 'technical', description: 'Artificial Intelligence acronym' },
  { id: '5', term: 'Maine Coon', category: 'breed', description: 'Cat breed name' },
  { id: '6', term: 'Persian', category: 'breed', description: 'Cat breed name' },
  { id: '7', term: 'Bengal', category: 'breed', description: 'Cat breed name' },
  { id: '8', term: 'Ragdoll', category: 'breed', description: 'Cat breed name' },
  { id: '9', term: 'Golden Retriever', category: 'breed', description: 'Dog breed name' },
  { id: '10', term: 'German Shepherd', category: 'breed', description: 'Dog breed name' },
];

const STORAGE_TM_KEY = 'furtools_tms_memory';
const STORAGE_GLOSSARY_KEY = 'furtools_tms_glossary';
const STORAGE_LOGS_KEY = 'furtools_tms_logs';

/**
 * Translation Memory (TM) Handler
 */
export class TranslationMemory {
  private static memory: Map<string, string> = new Map();

  private static getCacheKey(sourceText: string, targetLang: string): string {
    return `${targetLang}::${sourceText.trim()}`;
  }

  public static get(sourceText: string, targetLang: string): string | null {
    const key = this.getCacheKey(sourceText, targetLang);
    if (this.memory.has(key)) return this.memory.get(key) || null;

    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_TM_KEY);
        if (stored) {
          const parsed: Record<string, string> = JSON.parse(stored);
          if (parsed[key]) {
            this.memory.set(key, parsed[key]);
            return parsed[key];
          }
        }
      } catch {
        /* ignore storage error */
      }
    }
    return null;
  }

  public static set(sourceText: string, targetLang: string, translatedText: string): void {
    const key = this.getCacheKey(sourceText, targetLang);
    this.memory.set(key, translatedText);

    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_TM_KEY);
        const parsed: Record<string, string> = stored ? JSON.parse(stored) : {};
        parsed[key] = translatedText;
        localStorage.setItem(STORAGE_TM_KEY, JSON.stringify(parsed));
      } catch {
        /* ignore storage error */
      }
    }
  }

  public static clear(): void {
    this.memory.clear();
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_TM_KEY);
    }
  }
}

/**
 * Glossary Manager
 */
export class GlossaryManager {
  public static getTerms(): GlossaryTerm[] {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_GLOSSARY_KEY);
        if (stored) return JSON.parse(stored);
      } catch {
        /* ignore */
      }
    }
    return DEFAULT_GLOSSARY_TERMS;
  }

  public static addTerm(term: Omit<GlossaryTerm, 'id'>): GlossaryTerm {
    const current = this.getTerms();
    const newTerm: GlossaryTerm = { ...term, id: Date.now().toString() };
    const updated = [...current, newTerm];
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_GLOSSARY_KEY, JSON.stringify(updated));
    }
    return newTerm;
  }

  public static removeTerm(id: string): void {
    const updated = this.getTerms().filter((t) => t.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_GLOSSARY_KEY, JSON.stringify(updated));
    }
  }

  public static getPromptRule(): string {
    const terms = this.getTerms().map((t) => t.term);
    return `GLOSSARY (Do NOT translate these exact words): ${terms.join(', ')}. Keep them in English.`;
  }
}

/**
 * Quality Assurance (QA) Validator
 */
export function validateTranslation(original: string, translated: string): QAValidationResult {
  const warnings: string[] = [];

  if (!translated || !translated.trim()) {
    return { isValid: false, warnings: ['Translation output is empty.'] };
  }

  // 1. Check placeholders like {{count}}, {{entity}}, {name}
  const originalVars = original.match(/\{\{?[a-zA-Z0-9_]+\}?\}|\{[a-zA-Z0-9_]+\}/g) || [];
  const translatedVars = translated.match(/\{\{?[a-zA-Z0-9_]+\}?\}|\{[a-zA-Z0-9_]+\}/g) || [];

  for (const v of originalVars) {
    if (!translated.includes(v)) {
      warnings.push(`Missing variable placeholder: "${v}"`);
    }
  }

  // 2. Check HTML tag balance
  const originalTags = original.match(/<[^>]+>/g) || [];
  const translatedTags = translated.match(/<[^>]+>/g) || [];
  if (originalTags.length !== translatedTags.length) {
    warnings.push(`HTML tag count mismatch (Original: ${originalTags.length}, Translated: ${translatedTags.length})`);
  }

  // 3. Length sanity check
  if (original.length > 15 && translated.length < original.length * 0.25) {
    warnings.push('Translation output is unusually short.');
  }

  return {
    isValid: warnings.length === 0,
    warnings,
  };
}

/**
 * Audit Logger
 */
export class TMSLogger {
  public static getLogs(): TMSLog[] {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_LOGS_KEY);
        if (stored) return JSON.parse(stored);
      } catch {
        /* ignore */
      }
    }
    return [];
  }

  public static addLog(log: Omit<TMSLog, 'id' | 'createdAt'>): TMSLog {
    const logs = this.getLogs();
    const newLog: TMSLog = {
      ...log,
      id: Date.now().toString() + Math.random().toString(36).substring(2, 5),
      createdAt: new Date().toISOString(),
    };
    const updated = [newLog, ...logs].slice(0, 200); // keep last 200 logs
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_LOGS_KEY, JSON.stringify(updated));
    }
    return newLog;
  }
}
